import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Instrument } from '../entities/instrument.entity';
import { InstrumentDTO } from '../dtos/instrument.dto';

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

  // Método para obtener un instrumento por ID
  async findOneByTicker(ticker: string): Promise<Instrument> {
    return this.instrumentRepository.findOneBy({ ticker });
  }

  async searchAssets(ticker = '', name = ''): Promise<InstrumentDTO[]> {
    const query = `
    SELECT 
      instrument.*, 
      latestMarketData.close, 
      latestMarketData.previousclose
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
        id: instrument.id,
        ticker: instrument.ticker,
        name: instrument.name,
        type: instrument.type,
        close: instrument.close,
        previousClose: instrument.previousclose,
        dailyReturn: latestMarketData
          ? ((instrument.close - instrument.previousclose) /
              instrument.previousclose) *
            100
          : 0,
      } as InstrumentDTO;
    });
  }
}
