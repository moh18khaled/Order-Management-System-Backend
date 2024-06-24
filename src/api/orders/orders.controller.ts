import { Controller, Get } from '@nestjs/common';
import { ordersService } from './orders.service';

@Controller()
export class ordersController {
  constructor(private readonly appService: ordersService) {}

  
}
