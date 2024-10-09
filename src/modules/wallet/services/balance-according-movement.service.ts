import { Order } from '@modules/orders/entities/order.entity';
import { Injectable } from '@nestjs/common';

@Injectable()
export class BalanceAccordingMovementService {
  // Métodos para operaciones
  addAvailableCash(available_cash: number, amount: number): number {
    return available_cash + amount;
  }

  subtractAvailableCash(available_cash: number, amount: number): number {
    return available_cash - amount;
  }

  returnAvailableCash(available_cash: number): number {
    return available_cash;
  }

  // Constructor con definición de operaciones
  operations = {
    CASH_IN: {
      FILLED: this.addAvailableCash,
    },
    CASH_OUT: {
      FILLED: this.subtractAvailableCash,
    },
    BUY: {
      NEW: this.subtractAvailableCash,
      FILLED: this.subtractAvailableCash,
      CANCELLED: this.returnAvailableCash,
      REJECTED: this.returnAvailableCash,
    },
    SELL: {
      FILLED: this.addAvailableCash,
      CANCELLED: this.returnAvailableCash,
      REJECTED: this.returnAvailableCash,
    },
  };

  async execute(orders: Order[]): Promise<number> {
    let available_cash = 0;
    // Iterar sobre las órdenes para calcular el available_cash
    for (const order of orders) {
      const { side, status, size, price } = order;

      available_cash = this.operations[side][status](
        available_cash,
        size * price,
      );
    }

    return available_cash;
  }
}
