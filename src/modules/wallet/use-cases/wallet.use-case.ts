import { Injectable } from '@nestjs/common';
import { BalanceAccordingMovementService } from '../services/balance-according-movement.service';
import { MarketDataService } from '@modules/marketdata/services/marketdata.service';
import { InstrumentService } from '@modules/instruments/services/instrument.service';
import { OrderService } from '@modules/orders/services/order.service';
import { UserService } from '@modules/users/services/user.service';
import { Order } from '@modules/orders/entities/order.entity';
import { GetInstrumentReturnService } from '../services/get-instrument-return.service';
import { SummarizeOrders } from '../services/summarize-orders.service';
import { AssetDTO } from '../dtos/asset.dto';

@Injectable()
export class WalletUseCase {
  constructor(
    private readonly userService: UserService,
    private readonly orderService: OrderService,
    private readonly marketDataService: MarketDataService,
    private readonly instrumentService: InstrumentService,
    private readonly balanceAccordingMovementService: BalanceAccordingMovementService,
    private readonly getInstrumentReturnService: GetInstrumentReturnService,
    private readonly summarizeOrders: SummarizeOrders,
  ) {}

  async getWalletData(userId: number) {
    const orders: Order[] = await this.orderService.findByUserId(userId);

    // Uso del resumen
    const summarizedOrders: AssetDTO[] = await this.summarizeOrders.execute(
      orders,
    );

    const assets: AssetDTO[] = await this.getInstrumentReturnService.execute(
      summarizedOrders,
    );

    const available_cash = await this.balanceAccordingMovementService.execute(
      orders,
    );

    const total_balance: number =
      available_cash +
      summarizedOrders.reduce((acc, summary) => acc + summary.price, 0);

    return {
      total_balance,
      available_cash,
      assets,
    };
  }
}
