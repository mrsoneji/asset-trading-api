import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Instrument } from '../entities/instrument.entity';

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
}
