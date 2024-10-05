import { Instrument } from '@modules/instruments/entities/instrument.entity';
import { InstrumentService } from '@modules/instruments/services/instrument.service';
import { MarketData } from '@modules/marketdata/entities/marketdata.entity';
import { MarketDataService } from '@modules/marketdata/services/marketdata.service';
import { Injectable } from '@nestjs/common';
import { InstrumentDTO } from '../dtos/instrument.dto';

@Injectable()
export class GetDailyReturnsService {
  constructor(
    private readonly marketDataService: MarketDataService,
    private readonly instrumentService: InstrumentService,
  ) {}

  async execute(instrument: Instrument): Promise<InstrumentDTO> {
    // Busca el market data relacionado con el instrumento
    const marketData: MarketData =
      await this.marketDataService.findByInstrumentId(instrument.id);

    if (!marketData) {
      return {
        ...instrument,
        dailyReturn: 0,
        close: 0,
        previousClose: 0,
      };
    }

    const { close, previousclose } = marketData;

    if (!previousclose || previousclose === 0) {
      throw new Error('Previous close is not available or zero');
    }

    // Calcula el retorno diario
    const dailyReturn = ((close - previousclose) / previousclose) * 100;

    return {
      ...instrument,
      dailyReturn,
      close: marketData.close,
      previousClose: marketData.previousclose,
    };
  }
}
