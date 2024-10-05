import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Instrument } from '../entities/instrument.entity';
import { InstrumentDTO } from '../dtos/instrument.dto';
import { MarketData } from '@modules/marketdata/entities/marketdata.entity';

@Injectable()
export class InstrumentService {
  constructor(
    @InjectRepository(Instrument)
    private instrumentRepository: Repository<Instrument>,
  ) {}

  // Método para obtener todos los instrumentos
  async findAll(): Promise<Instrument[]> {
    return this.instrumentRepository.find();
  }

  // Método para obtener un instrumento por ID
  async findOne(id: number): Promise<Instrument> {
    return this.instrumentRepository.findOneBy({ id });
  }

  async searchAssets(ticker = '', name = ''): Promise<InstrumentDTO[]> {
    const query = `
    SELECT 
      instrument.*, 
      latestMarketData.close, 
      latestMarketData.previousclose as previousClose
    FROM 
      instruments instrument 
    LEFT JOIN 
      marketdata latestMarketData 
    ON 
      latestMarketData.instrumentid = instrument.id 
    WHERE 
      latestMarketData.id = (
        SELECT MAX(m.id) 
        FROM marketdata m 
        WHERE m.instrumentid = instrument.id
      )
    AND instrument.ticker LIKE $1
    AND instrument.name LIKE $2
  `;

    // Preparamos los parámetros
    const parameters: string[] = [];
    parameters.push(`%${ticker}%`);
    parameters.push(`%${name}%`);

    const instruments = await this.instrumentRepository.manager.query(
      query,
      parameters,
    );

    return instruments.map((instrument) => {
      const latestMarketData = instrument.marketData
        ? instrument.marketData[0]
        : null;

      return {
        ...instrument,
        close: latestMarketData ? latestMarketData.close : 0,
        previousClose: latestMarketData ? latestMarketData.previousClose : 0,
        dailyReturn: 0,
      } as InstrumentDTO;
    });
  }
}
