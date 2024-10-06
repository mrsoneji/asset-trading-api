// market-data.entity.ts
import { Instrument } from '@modules/instruments/entities/instrument.entity';
import { Exclude } from 'class-transformer';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';

@Entity('marketdata')
export class MarketData {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'instrumentid' })
  instrumentid: number;

  @Column('numeric', { precision: 10, scale: 2 })
  high: number;

  @Column('numeric', { precision: 10, scale: 2 })
  low: number;

  @Column('numeric', { precision: 10, scale: 2 })
  open: number;

  @Column('numeric', { precision: 10, scale: 2 })
  close: number;

  @Column('numeric', { precision: 10, scale: 2 })
  previousclose: number;

  @Column('date')
  date: Date;

  @ManyToOne(() => Instrument, (instrument) => instrument.marketData)
  @JoinColumn({ name: 'instrumentid', referencedColumnName: 'id' })
  instrument: Instrument;
}
