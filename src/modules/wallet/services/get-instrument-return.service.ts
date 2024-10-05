import { InstrumentService } from '@modules/instruments/services/instrument.service';
import { MarketData } from '@modules/marketdata/entities/marketdata.entity';
import { MarketDataService } from '@modules/marketdata/services/marketdata.service';
import { Injectable } from '@nestjs/common';
import { AssetDTO } from '../dtos/asset.dto';
import { Order } from '@modules/orders/entities/order.entity';

@Injectable()
export class GetInstrumentReturnService {
  constructor(
    private readonly marketDataService: MarketDataService,
    private readonly instrumentService: InstrumentService,
  ) {}

  async execute(orders: Order[]): Promise<AssetDTO[]> {
    const returnValue: AssetDTO[] = [];

    for (const e of orders) {
      const { instrument } = e;

      // Busca el market data relacionado con el instrumento
      const marketData: MarketData =
        await this.marketDataService.findByInstrumentId(instrument.id);

      if (!marketData) {
        returnValue.push({
          instrumentid: instrument.id,
          price: 0,
          size: e.size,
          ticker: instrument.ticker,
          daily_return: 0,
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
        instrumentid: instrument.id,
        price: marketData.close,
        size: e.size,
        ticker: instrument.ticker,
        daily_return,
      });
    }

    return returnValue;
  }
}
