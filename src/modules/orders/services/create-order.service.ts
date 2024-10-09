import {
  BadRequestException,
  forwardRef,
  Inject,
  Injectable,
} from '@nestjs/common';
import { CreateOrderDTO } from '../dtos/create-order.dto';
import { User } from '@modules/users/entities/user.entity';
import { Order } from '../entities/order.entity';
import { Instrument } from '@modules/instruments/entities/instrument.entity';
import { InstrumentService } from '@modules/instruments/services/instrument.service';
import { OrderService } from './order.service';
import { BalanceAccordingMovementService } from '@modules/wallet/services/balance-according-movement.service';
import { MarketDataService } from '@modules/marketdata/services/marketdata.service';
import { MarketData } from '@modules/marketdata/entities/marketdata.entity';

@Injectable()
export class CreateOrderService {
  constructor(
    private readonly instrumentService: InstrumentService,
    private readonly orderService: OrderService,
    @Inject(forwardRef(() => BalanceAccordingMovementService))
    private readonly balanceAccordingMovementService: BalanceAccordingMovementService,
    private readonly marketDataService: MarketDataService,
  ) {}

  async execute(user: User, createOrderDto: CreateOrderDTO): Promise<Order> {
    // Find the instrument by its ticker symbol
    const instrument: Instrument = await this.instrumentService.findOneByTicker(
      createOrderDto.ticker,
    );
    // Throw an error if the instrument does not exist
    if (!instrument) {
      throw new BadRequestException('Instrument does not exists.');
    }

    // Create a new Order object and populate its fields
    const order = new Order();
    order.userid = user.id;
    order.instrument = instrument;
    order.size = createOrderDto.size;
    order.side = createOrderDto.side;
    order.type = createOrderDto.type;
    order.status = createOrderDto.type === 'MARKET' ? 'FILLED' : 'NEW';
    order.datetime = new Date();
    order.price = createOrderDto.price;

    // If the order type is MARKET, fetch the current market price
    if (createOrderDto.type === 'MARKET') {
      const marketData: MarketData =
        await this.marketDataService.findByInstrumentId(order.instrument.id);

      // Update the order price with the market price
      order.price = marketData.close;
    }

    // Fetch the user's existing orders to check the balance
    const orders: Order[] = await this.orderService.findByUserId(order.userid);
    // Calculate the user's balance based on existing orders
    const balance: number = await this.balanceAccordingMovementService.execute(
      orders,
    );

    // If the order size multiplied by the price exceeds the balance, reject the order
    if (order.size * order.price > balance) {
      order.status = 'REJECTED';
    }

    // Create the order in the order service
    this.orderService.createOrder(order);

    // Return the created order
    return order;
  }
}
