import { Instrument } from '../entities/instrument.entity';

export class InstrumentDTO extends Instrument {
  dailyReturn: number;
  close: number;
  previousClose: number;
}
