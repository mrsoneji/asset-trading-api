import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('instruments') // Especificamos el nombre de la tabla en la base de datos
export class Instrument {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 10 })
  ticker: string;

  @Column({ type: 'varchar', length: 255 })
  name: string;

  @Column({ type: 'varchar', length: 10 })
  type: string;
}
