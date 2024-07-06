import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class CartService {
  constructor(private readonly prisma: PrismaService) {}

  // Add a product to the user's cart
  async addToCart(userId: string, productId: string, quantity: number) {
    try {
      await this.prisma.addToCart(userId, productId, quantity);
    } catch (err) {
      throw err;
    }
  }
  // View the user's cart
  async viewCart(userId: string) {
    try {
      return await this.prisma.viewCart(userId);
    } catch (err) {
      throw err;
    }
  }

  // Update a product's quantity in the cart
  async updateProductQuantity(productId: string, cartId: string, quantity: number) {
    try {
      await this.prisma.updateProductQuantity(productId, cartId, quantity);
    } catch (err) {
      throw err;
    }
  }

  // Remove a product from the cart
  async removeFromCart(productId: string, cartId: string) {
    try {
      await this.prisma.removeFromCart(productId, cartId);
    } catch (err) {
      throw err;
    }
  }
}
