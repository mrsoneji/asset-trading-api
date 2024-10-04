import { Instrument } from '@modules/instruments/entities/instrument.entity';
import { InstrumentService } from '@modules/instruments/services/instrument.service';
import { MarketData } from '@modules/marketdata/entities/marketdata.entity';
import { MarketDataService } from '@modules/marketdata/services/marketdata.service';
import { Injectable } from '@nestjs/common';
import { AssetDTO } from '../dtos/asset.dto';

@Injectable()
export class GetInstrumentReturnService {
  constructor(
    private readonly marketDataService: MarketDataService,
    private readonly instrumentService: InstrumentService,
  ) {}

  async execute(assets: AssetDTO[]): Promise<AssetDTO[]> {
    const returnValue: AssetDTO[] = [];

    for (const e of assets) {
      const { instrumentid } = e;

      const instrument: Instrument = await this.instrumentService.findOne(
        instrumentid,
      );

      if (!instrument) {
        throw new Error('Instrument not found');
      }

      // Busca el market data relacionado con el instrumento
      const marketData: MarketData =
        await this.marketDataService.findByInstrumentId(instrumentid);

      if (!marketData) {
        returnValue.push({
          ...e,
          daily_return: 0, // o algún valor predeterminado
        });
        continue; // Salta al siguiente elemento si no hay market data
      }

      const { close, previousclose } = marketData;

      if (!previousclose || previousclose === 0) {
        throw new Error('Previous close is not available or zero');
      }

      // Calcula el retorno diario
      const daily_return = ((close - previousclose) / previousclose) * 100;

      returnValue.push({
        ...e,
        daily_return,
      });
    }

    return returnValue;
  }
}
