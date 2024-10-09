import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString, IsUppercase, Length } from 'class-validator';

export class RequestInstrumentsDTO {
  @ApiProperty()
  @IsString()
  @Length(4)
  @IsOptional()
  @IsUppercase()
  ticker: string;

  @ApiProperty()
  name: string;
}
