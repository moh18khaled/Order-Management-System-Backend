import {
  Body,
  Controller,
  Post,
  Param,
  Get,
  Patch,
  Delete,
} from '@nestjs/common';
import { CartService } from './cart.service';

@Controller('api/cart')
export class CartController {
  constructor(private readonly cartService: CartService) {}

  // Add a product to the user's cart
  @Post('add')
  async show(
    @Body('userId') userId: string,
    @Body('productId') productId: string,
    @Body('quantity') quantity: number,
  ) {
    try {
      await this.cartService.addToCart(userId, productId, quantity);
    } catch (err) {
      throw err;
    }
  }

  // View the user's cart
  @Get(':userId')
  async view(@Param('userId') userId: string) {
    try {
      return await this.cartService.viewCart(userId);
    } catch (err) {
      throw err;
    }
  }

  // Update a product's quantity in the cart
  @Patch('update')
  async Update(
    @Body('productId') productId: string,
    @Body('cartId') cartId: string,
    @Body('quantity') quantity: number,
  ) {
    try {
      await this.cartService.updateProductQuantity(productId, cartId, quantity);
    } catch (err) {
      throw err;
    }
  }

  // Remove a product from the cart
  @Delete('remove')
  async remove(
    @Body('productId') productId: string,
    @Body('cartId') cartId: string,
  ) {
    try {
      await this.cartService.removeFromCart(productId, cartId);
    } catch (err) {
      throw err;
    }
  }
}
