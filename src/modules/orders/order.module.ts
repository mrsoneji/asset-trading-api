import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Order } from './entities/order.entity';
import { OrderService } from './services/order.service';
import { Instrument } from '@modules/instruments/entities/instrument.entity';
import { OrderController } from './controllers/order.controller';
import { CreateOrderService } from './services/create-order.service';
import { InstrumentModule } from '@modules/instruments/instrument.module';
import { WalletModule } from '@modules/wallet/wallet.module';
import { MarketDataModule } from '@modules/marketdata/marketdata.module';

@Module({
  controllers: [OrderController],
  imports: [
    TypeOrmModule.forFeature([Order, Instrument]),
    InstrumentModule,
    forwardRef(() => WalletModule),
    MarketDataModule,
  ],
  providers: [OrderService, CreateOrderService],
  exports: [OrderService],
})
export class OrderModule {}
