import { Controller, Get, Post, Body, Param, Put } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { get } from 'http';

@Controller('api/orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  // Create order
  @Post()
  async show(@Body('userId') userId: string) {
    try {
      await this.ordersService.createOrder(userId);
    } catch (err) {
      throw err;
    }
  }

  // Retrieve the user's order
  @Get(':orderId')
  async retrieveOrder(@Param('orderId') orderId: string) {
    try {
      return await this.ordersService.retrieveOrder(orderId);
    } catch (err) {
      throw err;
    }
  }

  // Updates order status
  @Put(':orderId/status')
  async updateOrderStatus(
    @Param('orderId') orderId: string,
    @Body('status') status: string,
  ) {
    try {
      return await this.ordersService.updateOrderStatus(orderId, status);
    } catch (err) {
      throw err;
    }
  }
}
