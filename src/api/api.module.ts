import { Module } from '@nestjs/common';
import { ordersModule } from './orders/orders.module';
import { cartModule } from './cart/cart.module';


@Module({
    imports: [ordersModule,cartModule],
})

export class apiModule {}