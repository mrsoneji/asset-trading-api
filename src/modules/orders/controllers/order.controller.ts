import {
  Body,
  Controller,
  Get,
  Post,
  Query,
  Request,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from '@modules/auth/guards/jwtauth.guard';
import { User } from '@modules/users/entities/user.entity';
import { ApiResponse } from '@nestjs/swagger';
import { RequestOrderDTO } from '../dtos/request-order.dto';
import { CreateOrderDTO } from '../dtos/create-order.dto';
import { CreateOrderService } from '../services/create-order.service';

@Controller('/order')
@UseGuards(JwtAuthGuard)
export class OrderController {
  constructor(private readonly createOrderService: CreateOrderService) {}

  @ApiResponse({
    status: 200,
    description:
      "The order has been received and processed successfully. You can track the order's status as it progresses through the system",
  })
  @ApiResponse({
    status: 400,
    description:
      'One or more fields have invalid data types or do not meet the required specifications as per the API documentation',
  })
  @ApiResponse({
    status: 401,
    description:
      'JWT Bearer must to be provided or was formed using an incorrect secret',
  })
  @Get('/')
  async getWallet(
    @Request() req: any,
    @Query() params: RequestOrderDTO,
  ): Promise<any> {
    const user: User = req.user;
    return JSON.stringify(params, null, 2);
  }

  @ApiResponse({
    status: 201,
    description: 'The order has been created successfully',
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid data, order could not be created',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized request',
  })
  @Post('/')
  async createOrder(
    @Request() req: any,
    @Body() createOrderDto: CreateOrderDTO,
  ): Promise<any> {
    const user: User = req.user;
    const newOrder = await this.createOrderService.execute(
      user,
      createOrderDto,
    );
    return {
      message: 'Order created successfully',
      order: newOrder,
    };
  }
}
