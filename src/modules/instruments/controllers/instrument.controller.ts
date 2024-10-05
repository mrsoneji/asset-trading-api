import { Controller, Get, Query } from '@nestjs/common';
import { InstrumentService } from '@modules/instruments/services/instrument.service';
import { InstrumentDTO } from '../dtos/instrument.dto';
import { Instrument } from '../entities/instrument.entity';
import { BatchGetDailyReturnsService } from '../services/batch-get-daily-returns.service';
import { ApiQuery } from '@nestjs/swagger';

@Controller('/instrument')
export class InstrumentController {
  constructor(
    private readonly instrumentService: InstrumentService,
    private readonly batchGetDailyReturnsService: BatchGetDailyReturnsService,
  ) {}

  @Get('/')
  @ApiQuery({ name: 'ticker', required: false, type: String })
  @ApiQuery({ name: 'name', required: false, type: String })
  async getInstruments(
    @Query('ticker') ticker?: string,
    @Query('name') name?: string,
  ): Promise<Partial<InstrumentDTO[]>> {
    const instruments: InstrumentDTO[] =
      await this.instrumentService.searchAssets(ticker, name);

    const results: InstrumentDTO[] =
      await this.batchGetDailyReturnsService.execute(instruments);

    return results;
  }
}
