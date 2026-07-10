import express from 'express';
import cors from 'cors';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

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
    const dir = 'media/';
    if (!fs.existsSync(dir)){
        fs.mkdirSync(dir, { recursive: true });
    }
    cb(null, dir);
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

// --- NOSOTROS (ABOUT) ---
app.get('/api/about', async (req, res) => {
  const about = await prisma.about.findFirst()
  res.json(about || {})
})

// Reservations
app.post('/api/reservations', async (req, res) => {
  try {
    const { name, email, phone, people, date, time, message } = req.body
    const reservation = await prisma.reservation.create({
      data: {
        name,
        email,
        phone,
        people: parseInt(people, 10),
        date,
        time,
        message
      }
    })
    res.status(201).json(reservation)
  } catch (error) {
    res.status(500).json({ error: 'Failed to create reservation' })
  }
})

app.get('/api/reservations', authenticateToken, async (req, res) => {
  try {
    const reservations = await prisma.reservation.findMany({
      orderBy: [
        { date: 'desc' },
        { time: 'desc' }
      ]
    })
    res.json(reservations)
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch reservations' })
  }
})

app.put('/api/reservations/:id/status', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const reservation = await prisma.reservation.update({
      where: { id: parseInt(id) },
      data: { status }
    });
    res.json(reservation);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update reservation status' });
  }
})

app.put('/api/about', authenticateToken, upload.single('imageFile'), async (req, res) => {
  try {
    const data = req.body;
    let finalImageUrl = data.imageUrl;
    
    if (data.removeImage === 'true') {
      finalImageUrl = '';
    } else if (req.file) {
      finalImageUrl = `http://localhost:3000/media/${req.file.filename}`;
    }

    const existingAbout = await prisma.about.findFirst();
    if (existingAbout) {
      const updated = await prisma.about.update({
        where: { id: existingAbout.id },
        data: {
          title: data.title,
          intro: data.intro,
          body: data.body,
          imageUrl: finalImageUrl,
          val1Icon: data.val1Icon,
          val1Title: data.val1Title,
          val1Desc: data.val1Desc,
          val2Icon: data.val2Icon,
          val2Title: data.val2Title,
          val2Desc: data.val2Desc,
          val3Icon: data.val3Icon,
          val3Title: data.val3Title,
          val3Desc: data.val3Desc,
        }
      });
      res.json(updated);
    } else {
      res.status(404).json({ error: 'About record not found' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error updating about data' });
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

app.delete('/api/categories/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    
    // Check if category has menu items
    const count = await prisma.menuItem.count({ where: { categoryId: parseInt(id) } });
    if (count > 0) {
      return res.status(400).json({ error: 'Cannot delete category because it has menu items.' });
    }

    await prisma.category.delete({
      where: { id: parseInt(id) }
    });
    res.json({ message: 'Deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Error deleting category' });
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

// --- PRICES ---
app.get('/api/prices', async (req, res) => {
  try {
    const prices = await prisma.priceItem.findMany();
    res.json(prices);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching prices' });
  }
});

app.post('/api/prices', authenticateToken, async (req, res) => {
  try {
    const { name, range, icon, desc } = req.body;
    const price = await prisma.priceItem.create({
      data: { name, range, icon, desc }
    });
    res.json(price);
  } catch (error) {
    res.status(500).json({ error: 'Error creating price' });
  }
});

app.put('/api/prices/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const { name, range, icon, desc } = req.body;
    const price = await prisma.priceItem.update({
      where: { id: parseInt(id) },
      data: { name, range, icon, desc }
    });
    res.json(price);
  } catch (error) {
    res.status(500).json({ error: 'Error updating price' });
  }
});

app.delete('/api/prices/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    await prisma.priceItem.delete({
      where: { id: parseInt(id) }
    });
    res.json({ message: 'Deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Error deleting price' });
  }
});

// --- CONTACT ---
app.get('/api/contact', async (req, res) => {
  const contact = await prisma.contact.findFirst();
  res.json(contact || {});
});

app.put('/api/contact', authenticateToken, async (req, res) => {
  try {
    const { address, phone, email, schedule } = req.body;
    const existingContact = await prisma.contact.findFirst();
    let contact;
    if (existingContact) {
      contact = await prisma.contact.update({
        where: { id: existingContact.id },
        data: { address, phone, email, schedule }
      });
    } else {
      contact = await prisma.contact.create({
        data: { address, phone, email, schedule }
      });
    }
    res.json(contact);
  } catch (error) {
    res.status(500).json({ error: 'Error updating contact' });
  }
});

app.listen(port, () => {
  console.log(`Backend server listening on port ${port}`);
});
