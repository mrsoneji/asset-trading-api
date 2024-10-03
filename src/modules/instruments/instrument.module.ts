import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Instrument } from './entities/instrument.entity';
import { InstrumentService } from './services/instrument.service';

@Module({
  imports: [TypeOrmModule.forFeature([Instrument])],
  providers: [InstrumentService],
})
export class InstrumentModule {}
