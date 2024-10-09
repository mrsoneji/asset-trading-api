import { Test, TestingModule } from '@nestjs/testing';
import { BalanceAccordingMovementService } from './balance-according-movement.service'; // Ajusta la ruta según tu estructura de carpetas
import { Order } from '@modules/orders/entities/order.entity'; // Ajusta la ruta según tu estructura de carpetas

describe('BalanceAccordingMovementService', () => {
  let balanceService: BalanceAccordingMovementService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [BalanceAccordingMovementService],
    }).compile();

    balanceService = module.get<BalanceAccordingMovementService>(
      BalanceAccordingMovementService,
    );
  });

  it('should correctly calculate available cash for CASH_IN orders', async () => {
    const orders: Partial<Order>[] = [
      { side: 'CASH_IN', status: 'FILLED', size: 1, price: 100 },
      { side: 'CASH_IN', status: 'FILLED', size: 1, price: 200 },
    ];

    const result = await balanceService.execute(orders as Order[]);

    expect(result).toBe(300); // 100 + 200
  });

  it('should correctly calculate available cash for CASH_OUT orders', async () => {
    const orders: Partial<Order>[] = [
      { side: 'CASH_OUT', status: 'FILLED', size: 1, price: 100 },
      { side: 'CASH_OUT', status: 'FILLED', size: 1, price: 50 },
    ];

    const result = await balanceService.execute(orders as Order[]);

    expect(result).toBe(-150); // 0 - (100 + 50)
  });

  it('should handle BUY orders correctly', async () => {
    const orders: Partial<Order>[] = [
      { side: 'BUY', status: 'NEW', size: 1, price: 100 },
      { side: 'BUY', status: 'FILLED', size: 1, price: 200 },
      { side: 'BUY', status: 'CANCELLED', size: 1, price: 150 },
    ];

    const result = await balanceService.execute(orders as Order[]);

    expect(result).toBe(-300); // 0 - (100 + 200) + 0
  });

  it('should handle SELL orders correctly', async () => {
    const orders: Partial<Order>[] = [
      { side: 'SELL', status: 'FILLED', size: 1, price: 100 },
      { side: 'SELL', status: 'CANCELLED', size: 1, price: 50 },
      { side: 'SELL', status: 'REJECTED', size: 1, price: 25 },
    ];

    const result = await balanceService.execute(orders as Order[]);

    expect(result).toBe(100); // 0 + (100) + 0 + 0
  });

  it('should calculate available cash for mixed orders', async () => {
    const orders: Partial<Order>[] = [
      { side: 'CASH_IN', status: 'FILLED', size: 1, price: 200 },
      { side: 'BUY', status: 'NEW', size: 1, price: 100 },
      { side: 'SELL', status: 'FILLED', size: 1, price: 50 },
      { side: 'CASH_OUT', status: 'FILLED', size: 1, price: 30 },
    ];

    const result = await balanceService.execute(orders as Order[]);

    expect(result).toBe(120); // 200 - 100 + 50 - 30
  });
});
