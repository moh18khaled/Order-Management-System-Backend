import { Body, Controller, Post } from '@nestjs/common';
import { cartService } from './cart.service';

@Controller('api/cart')
export class cartController {
  constructor(private readonly appService: cartService) {}

  
  
}
