import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsNumber,
  IsString,
  IsEnum,
  ValidateIf,
  IsOptional,
} from 'class-validator';

export class CreateOrderDTO {
  @ApiProperty({ example: 'AAPL' })
  @IsString()
  @IsNotEmpty()
  ticker: string;

  @ApiProperty({ example: 100 })
  @IsNumber()
  @IsNotEmpty()
  size: number;

  @ApiProperty({ example: 'BUY' })
  @IsString()
  @IsEnum(['BUY', 'SELL'])
  @IsNotEmpty()
  side: string;

  @ApiProperty({ example: 'LIMIT' })
  @IsString()
  @IsEnum(['MARKET', 'LIMIT'])
  @IsNotEmpty()
  type: string;

  @ApiProperty({ example: 150.0, required: false })
  @ValidateIf((o) => o.type === 'LIMIT') // Solo valida si type es LIMIT
  @IsNotEmpty({ message: 'Price must be provided for LIMIT orders' })
  @IsNumber()
  price?: number;
}
