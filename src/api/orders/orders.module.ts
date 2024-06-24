import { Module } from '@nestjs/common';
import { ordersController } from './orders.controller';
import { ordersService } from './orders.service';


@Module({
  controllers: [ordersController],
  providers: [ordersService],
})
export class ordersModule {}