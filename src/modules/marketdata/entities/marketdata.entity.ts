// market-data.entity.ts
import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('marketdata')
export class MarketData {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
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
}
