import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsIn,
  IsNotEmpty,
  IsNumberString,
  IsString,
  Length,
  ValidateIf,
} from 'class-validator';
import { ORDER_TYPES } from '../constants';

export class RequestOrderDTO {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  @Length(4)
  ticker: string;

  @ApiProperty({ enum: ORDER_TYPES })
  @IsNotEmpty()
  @IsIn(ORDER_TYPES)
  type: string;

  @ApiProperty()
  @IsNumberString()
  @ApiPropertyOptional()
  @ValidateIf((o) => o.type === ORDER_TYPES[1])
  price: number;
}
