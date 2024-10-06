import { Module } from '@nestjs/common';
import { WalletController } from './controllers/wallet.controller';
import { UserModule } from '../users/user.module';
import { OrderModule } from '../orders/order.module';
import { MarketDataModule } from '@modules/marketdata/marketdata.module';
import { InstrumentModule } from '@modules/instruments/instrument.module';
import { WalletUseCase } from './use-cases/wallet.use-case';
import { BalanceAccordingMovementService } from './services/balance-according-movement.service';
import { GetInstrumentReturnService } from './services/get-instrument-return.service';
import { SummarizeOrders } from './services/summarize-orders.service';
import { JwtModule } from '@nestjs/jwt';
import { jwtConstants } from '@modules/auth/constants';

@Module({
  providers: [
    WalletUseCase,
    BalanceAccordingMovementService,
    GetInstrumentReturnService,
    SummarizeOrders,
  ],
  imports: [
    UserModule,
    OrderModule,
    MarketDataModule,
    InstrumentModule,
    JwtModule.register({
      global: true,
      secret: jwtConstants.secret,
      signOptions: { expiresIn: 'none' },
    }),
  ],
  controllers: [WalletController],
  exports: [WalletUseCase],
})
export class WalletModule {}
