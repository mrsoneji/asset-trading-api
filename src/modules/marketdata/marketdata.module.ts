import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MarketData } from './entities/marketdata.entity';
import { MarketDataService } from './services/marketdata.service';

@Module({
  imports: [TypeOrmModule.forFeature([MarketData])],
  providers: [MarketDataService],
})
export class MarketDataModule {}
