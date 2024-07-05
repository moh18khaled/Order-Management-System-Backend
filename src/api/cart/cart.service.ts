import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class CartService {
  constructor(private readonly prisma: PrismaService) {}

  // Add a product to the user's cart
  async add(userId: string, productId: string, quantity: number) {
    try {
      await this.prisma.add(userId, productId, quantity);
    } catch (err) {
      throw err;
    }
  }
  // View the user's cart
  async view(userId: string) {
    try {
      return await this.prisma.view(userId);
    } catch (err) {
      throw err;
    }
  }

  // Update a product's quantity in the cart
  async Update(productId: string, cartId: string, quantity: number) {
    try {
      await this.prisma.Update(productId, cartId, quantity);
    } catch (err) {
      throw err;
    }
  }

  // Remove a product from the cart
  async remove(productId: string, cartId: string) {
    try {
      await this.prisma.remove(productId, cartId);
    } catch (err) {
      throw err;
    }
  }
}
