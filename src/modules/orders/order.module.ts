import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Order } from './entities/order.entity';
import { OrderService } from './services/order.service';
import { Instrument } from '@modules/instruments/entities/instrument.entity';
import { OrderController } from './controllers/order.controller';

@Module({
  controllers: [OrderController],
  imports: [TypeOrmModule.forFeature([Order, Instrument])],
  providers: [OrderService],
  exports: [OrderService],
})
export class OrderModule {}
