import express from 'express';
import cors from 'cors';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const prisma = new PrismaClient();
const app = express();
const port = 3000;
const JWT_SECRET = 'super-secret-key-ristorante';

app.use(cors());
app.use(express.json());

// Servir la carpeta de imágenes estáticamente
app.use('/media', express.static(path.join(__dirname, 'media')));

// --- CONFIGURACIÓN DE MULTER PARA SUBIDA DE ARCHIVOS ---
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'media/');
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});
const upload = multer({ storage: storage });

// --- MIDDLEWARE DE AUTENTICACIÓN ---
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  
  if (token == null) return res.sendStatus(401);

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
};

// --- AUTENTICACIÓN ---
app.post('/api/login', async (req, res) => {
  const { username, password } = req.body;
  try {
    const user = await prisma.user.findUnique({ where: { username } });
    if (!user) return res.status(401).json({ error: 'Usuario o contraseña incorrectos' });

    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) return res.status(401).json({ error: 'Usuario o contraseña incorrectos' });

    const token = jwt.sign({ id: user.id, username: user.username }, JWT_SECRET, { expiresIn: '2h' });
    res.json({ token });
  } catch (error) {
    res.status(500).json({ error: 'Error en el servidor' });
  }
});

// --- CATEGORÍAS ---
app.get('/api/categories', async (req, res) => {
  try {
    const categories = await prisma.category.findMany({
      include: { menuItems: true }
    });
    res.json(categories);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching categories' });
  }
});

app.post('/api/categories', authenticateToken, async (req, res) => {
  try {
    const { name } = req.body;
    const category = await prisma.category.create({
      data: { name }
    });
    res.json(category);
  } catch (error) {
    res.status(500).json({ error: 'Error creating category' });
  }
});

// --- PLATOS (MENU ITEMS) ---
app.get('/api/menu', async (req, res) => {
  try {
    const items = await prisma.menuItem.findMany({
      include: { category: true }
    });
    res.json(items);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching menu items' });
  }
});

app.post('/api/menu', authenticateToken, upload.single('imageFile'), async (req, res) => {
  try {
    const { title, description, price, categoryId } = req.body;
    let finalImageUrl = req.body.imageUrl || null;

    if (req.file) {
      finalImageUrl = `http://localhost:3000/media/${req.file.filename}`;
    }

    const item = await prisma.menuItem.create({
      data: {
        title,
        description,
        price,
        imageUrl: finalImageUrl,
        categoryId: parseInt(categoryId)
      }
    });
    res.json(item);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error creating menu item' });
  }
});

app.delete('/api/menu/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    await prisma.menuItem.delete({
      where: { id: parseInt(id) }
    });
    res.json({ message: 'Deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Error deleting menu item' });
  }
});

app.listen(port, () => {
  console.log(`Backend server listening on port ${port}`);
});
