import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Instrument } from './entities/instrument.entity';
import { InstrumentService } from './services/instrument.service';
import { InstrumentController } from './controllers/instrument.controller';
import { GetDailyReturnsService } from './services/get-daily-returns.service';
import { BatchGetDailyReturnsService } from './services/batch-get-daily-returns.service';
import { MarketDataModule } from '@modules/marketdata/marketdata.module';

@Module({
  controllers: [InstrumentController],
  imports: [TypeOrmModule.forFeature([Instrument]), MarketDataModule],
  providers: [
    InstrumentService,
    GetDailyReturnsService,
    BatchGetDailyReturnsService,
  ],
  exports: [InstrumentService],
})
export class InstrumentModule {}
