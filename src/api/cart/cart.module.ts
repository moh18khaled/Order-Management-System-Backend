import { Module } from '@nestjs/common';
import { cartController } from './cart.controller';
import { cartService } from './cart.service';


@Module({
  controllers: [cartController],
  providers: [cartService],
})
export class cartModule {}