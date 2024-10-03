import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { MarketData } from '../entities/marketdata.entity';

@Injectable()
export class MarketDataService {
  constructor(
    @InjectRepository(MarketData)
    private readonly marketDataRepository: Repository<MarketData>,
  ) {}

  async findAll(): Promise<MarketData[]> {
    return this.marketDataRepository.find();
  }

  async findOne(id: number): Promise<MarketData> {
    return this.marketDataRepository.findOneBy({ id });
  }
}
