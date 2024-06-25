import { Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class TestingService {
  constructor(private readonly prisma: PrismaClient) {}

  async showProducts(): Promise<any> {
    return await this.prisma.products.findMany();
  }

  async showCarts(): Promise<any> {
    return await this.prisma.cart.findMany();
  }

  async showUsers(): Promise<any> {
    return await this.prisma.users.findMany();
  }



  async delete() {
    await this.prisma.users.deleteMany();
    await this.prisma.cart.deleteMany();
    await this.prisma.products.deleteMany();
  }
}

