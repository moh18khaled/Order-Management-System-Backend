import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class OrdersService {
  constructor(private readonly prisma: PrismaService) {}

  // Add a product to the user's cart
  async createOrder(userId: string) {
    try {
      await this.prisma.createOrder(userId);
    } catch (err) {
      throw err;
    }
  }

  // Retrieve the user's order
  async retrieveOrder(orderId: string) {
    try {
      return await this.prisma.retrieveOrder(orderId);
    } catch (err) {
      throw err;
    }
  }

  // Updates order status
  async updateOrderStatus(orderId: string, status: string) {
    try {
      await this.prisma.updateOrderStatus(orderId, status);
    } catch (err) {
      throw err;
    }
  }
}
