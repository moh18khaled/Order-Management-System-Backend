import { Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class TestingService {
  constructor(private readonly prisma: PrismaClient) {}

  async showProducts() {
    return await this.prisma.products.findMany({
      include: {
        cart: true,
        CartToProduct: true,
      },
    });
  }

  async showCarts() {
    return await this.prisma.cart.findMany({
      include: {
        products:true,
        CartToProduct: true,
        user:true 
      },
    }); 
  }

  async showUsers() {
    return await this.prisma.users.findMany();
  }

  async showOrders() {
    return await this.prisma.orders.findMany({

      include: {
        products:true,
        user:true 
      },

    });
  }

  async delete() {
    await this.prisma.cartAndProduct.deleteMany();
    await this.prisma.orders.deleteMany();
    await this.prisma.products.deleteMany();
    await this.prisma.users.deleteMany();
    await this.prisma.cart.deleteMany();
  } 
} 
