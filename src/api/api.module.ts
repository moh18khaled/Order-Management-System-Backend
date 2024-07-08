import { Module, OnModuleInit } from '@nestjs/common';
import { OrdersModule } from './orders/orders.module';
import { CartModule } from './cart/cart.module';
import { TestingModule } from './testing/testing.module';
import { Seeding } from './seeds/seed';
import { PrismaClient } from '@prisma/client';

@Module({
  imports: [OrdersModule, CartModule, TestingModule],
  providers: [PrismaClient],
})
export class ApiModule implements OnModuleInit {
  constructor(private prisma: PrismaClient) {}

  async onModuleInit() {
    try {
      const user = await this.prisma.users.findUnique({
        where: {
          email: 'mohamed.15@gmail.com',
        },
      });

      if (!user) {
        // checking if the database is not seeded
        console.log('Seeding data');
        await Seeding();
        console.log('Seeding completed.');
      } else {
        console.log('Database already seeded, skipping seeding.');
      }
    } catch (err) {
      console.error('Error in onModuleInit:', err);
    } finally {
      await this.prisma.$disconnect();
    }
  }
}
