import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  const username = 'admin';
  const password = 'admin123';
  const hashedPassword = await bcrypt.hash(password, 10);

  const existingUser = await prisma.user.findUnique({ where: { username } });
  
  if (!existingUser) {
    await prisma.user.create({
      data: {
        username,
        password: hashedPassword,
      },
    });
    console.log('Admin user created: admin / admin123');
  } else {
    console.log('Admin user already exists');
  }

  const existingAbout = await prisma.about.findFirst();
  if (!existingAbout) {
    await prisma.about.create({
      data: {
        title: 'Chi Siamo',
        intro: 'Desde 1985, en **Ristorante Italia** llevamos la tradición culinaria italiana a tu mesa. Cada plato es una historia de pasión, familia y autenticidad.',
        body: 'Nuestros ingredientes son seleccionados cuidadosamente, muchos traídos directamente desde Italia, para garantizar el sabor más genuino en cada bocado. Cada receta cuenta con décadas de perfeccionamiento.',
        imageUrl: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=600&q=80',
        val1Icon: '🍝',
        val1Title: 'Tradición',
        val1Desc: 'Recetas transmitidas por generaciones',
        val2Icon: '👨‍👩‍👧‍👦',
        val2Title: 'Familia',
        val2Desc: 'Un ambiente acogedor para todos',
        val3Icon: '✨',
        val3Title: 'Autenticidad',
        val3Desc: 'Ingredientes importados de Italia'
      }
    });
    console.log('Default About data created');
  } else {
    console.log('About data already exists');
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
