import { Injectable } from '@nestjs/common';
import { InstrumentDTO } from '../dtos/instrument.dto';
import { Instrument } from '../entities/instrument.entity';
import { GetDailyReturnsService } from './get-daily-returns.service';

@Injectable()
export class BatchGetDailyReturnsService {
  constructor(
    private readonly getDailyReturnsService: GetDailyReturnsService,
  ) {}

  async execute(instruments: InstrumentDTO[]): Promise<InstrumentDTO[]> {
    const results: InstrumentDTO[] = instruments.map((e) => {
      return {
        ...e,
        dailyReturn: ((e.close - e.previousClose) / e.previousClose) * 100,
      };
    });
    return results;
  }
}
