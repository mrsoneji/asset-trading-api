import { MarketData } from '@modules/marketdata/entities/marketdata.entity';
import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';

@Entity('instruments')
export class Instrument {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 10 })
  ticker: string;

  @Column({ type: 'varchar', length: 255 })
  name: string;

  @Column({ type: 'varchar', length: 10 })
  type: string;

  // Definir la relación con MarketData
  @OneToMany(() => MarketData, (marketData) => marketData.instrument)
  marketData: MarketData[];
}
