import { Instrument } from '@modules/instruments/entities/instrument.entity';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';

@Entity('orders')
export class Order {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Instrument)
  @JoinColumn({ name: 'instrumentid' })
  instrument: Instrument;

  @Column({ type: 'int' })
  userid: number;

  @Column({ type: 'int' })
  size: number;

  @Column({ type: 'numeric', precision: 10, scale: 2 })
  price: number;

  @Column({ type: 'varchar', length: 10 })
  type: string;

  @Column({ type: 'varchar', length: 10 })
  side: string;

  @Column({ type: 'varchar', length: 20 })
  status: string;

  @Column({ type: 'timestamp' })
  datetime: Date;
}
