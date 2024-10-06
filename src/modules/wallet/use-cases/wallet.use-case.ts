import { Injectable, UnauthorizedException } from '@nestjs/common';
import { BalanceAccordingMovementService } from '../services/balance-according-movement.service';
import { OrderService } from '@modules/orders/services/order.service';
import { UserService } from '@modules/users/services/user.service';
import { Order } from '@modules/orders/entities/order.entity';
import { GetInstrumentReturnService } from '../services/get-instrument-return.service';
import { SummarizeOrders } from '../services/summarize-orders.service';
import { AssetDTO } from '../dtos/asset.dto';
import { PortfolioDTO } from '../dtos/portfolio.dto';
import { User } from '@modules/users/entities/user.entity';

@Injectable()
export class WalletUseCase {
  constructor(
    private readonly userService: UserService,
    private readonly orderService: OrderService,
    private readonly balanceAccordingMovementService: BalanceAccordingMovementService,
    private readonly getInstrumentReturnService: GetInstrumentReturnService,
    private readonly summarizeOrders: SummarizeOrders,
  ) {}

  async getWalletData(userId: number): Promise<PortfolioDTO> {
    // Check if user exists
    const user: User = await this.userService.findOne(userId);
    if (!user) {
      throw new UnauthorizedException();
    }

    const orders: Order[] = await this.orderService.findByUserId(userId);

    // Summarize orders so that order with same TICKER are not repeated
    const summarizedOrders: Order[] = await this.summarizeOrders.execute(
      orders,
    );

    // Calculate and returns the investment return for every instrument
    const assets: AssetDTO[] = await this.getInstrumentReturnService.execute(
      summarizedOrders,
    );

    // Calculate and returns current user balance according historical movements
    const available_cash = await this.balanceAccordingMovementService.execute(
      orders,
    );

    // Calculate total balance by summing up available cash and investment returns
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
