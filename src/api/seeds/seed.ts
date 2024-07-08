import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function Seeding() {
  //creating users and carts
  await prisma.users.create({
    data: {
      name: 'mohamed',
      email: 'mohamed.15@gmail.com',
      password: 'pass123',
      address: '',
      cart: {
        create: {
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      },
    },
    include: { cart: true }, // To created cart along with the user
  });

  await prisma.users.create({
    data: {
      name: 'ali',
      email: 'ali.200@gmail.com',
      password: '12345',
      address: '',
      cart: {
        create: {
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      },
    },
    include: { cart: true },
  });

  await prisma.users.create({
    data: {
      name: 'ahmed',
      email: 'ahmed.kh@gmail.com',
      password: 'ahmed13',
      address: '',
      cart: {
        create: {
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      },
    },
    include: { cart: true },
  });

  //creating products
  await prisma.products.createMany({
    data: [
      {
        name: 'Product 1',
        description: '',
        price: 100,
        stock: 100,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: 'Product 2',
        description: '',
        price: 150,
        stock: 5,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: 'Product 3',
        description: '',
        price: 300,
        stock: 0,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ],
  });
}
