import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { InstrumentService } from '@modules/instruments/services/instrument.service';
import { InstrumentDTO } from '../dtos/instrument.dto';
import { BatchGetDailyReturnsService } from '../services/batch-get-daily-returns.service';
import { ApiQuery, ApiResponse } from '@nestjs/swagger';
import { JwtAuthGuard } from '@modules/auth/guards/jwtauth.guard';
import { RequestInstrumentsDTO } from '../dtos/request-instruments.dto';

@Controller('/instrument')
@UseGuards(JwtAuthGuard)
export class InstrumentController {
  constructor(
    private readonly instrumentService: InstrumentService,
    private readonly batchGetDailyReturnsService: BatchGetDailyReturnsService,
  ) {}

  @ApiResponse({
    status: 401,
    description:
      'JWT Bearer must to be provided or was formed using an incorrect secret',
  })
  @ApiResponse({
    status: 200,
    description:
      'A list of instruments must to be provided by the server according the given criteria',
  })
  @Get('/')
  @ApiQuery({ name: 'ticker', required: false, type: String })
  @ApiQuery({ name: 'name', required: false, type: String })
  async getInstruments(
    @Query() params: RequestInstrumentsDTO,
  ): Promise<Partial<InstrumentDTO[]>> {
    const instruments: InstrumentDTO[] =
      await this.instrumentService.searchAssets(params.ticker, params.name);

    const results: InstrumentDTO[] =
      await this.batchGetDailyReturnsService.execute(instruments);

    return results;
  }
}
