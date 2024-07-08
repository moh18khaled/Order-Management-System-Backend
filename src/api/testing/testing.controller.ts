import { Body, Controller, Get, Delete } from '@nestjs/common';
import { TestingService } from './testing.service';

@Controller('api/testing')
export class TestingController {
  constructor(private readonly testingService: TestingService) {}

  @Get('show/products')
  showProducts() {
    return this.testingService.showProducts();
  }

  @Get('show/carts')
  showCarts() {
    return this.testingService.showCarts();
  }

  @Get('show/users')
  showUsers() {
    return this.testingService.showUsers();
  }

  @Get('show/orders')
  showOrders() {
    return this.testingService.showOrders();
  }

  @Delete('delete')
  delete() {
    return this.testingService.delete();
  }
}
