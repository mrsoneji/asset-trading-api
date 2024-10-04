import { SummarizeOrders } from './summarize-orders.service'; // Ajusta la ruta según tu estructura de carpetas
import { Order } from '@modules/orders/entities/order.entity';
import { AssetDTO } from '../dtos/asset.dto';

describe('SummarizeOrders', () => {
  let summarizeOrders: SummarizeOrders;

  beforeEach(() => {
    summarizeOrders = new SummarizeOrders();
  });

  it('should summarize orders correctly', async () => {
    const orders: Partial<Order>[] = [
      {
        id: 1,
        size: 50,
        price: 930,
        status: 'FILLED',
        instrument: { id: 1, ticker: 'AAPL', type: 'ACCIONES', name: '' }, // Asegúrate de que el objeto instrument sea correcto
      },
      {
        id: 2,
        size: 30,
        price: 940,
        status: 'FILLED',
        instrument: { id: 1, ticker: 'AAPL', type: 'ACCIONES', name: '' },
      },
      {
        id: 3,
        size: 20,
        price: 950,
        status: 'REJECTED',
        instrument: { id: 2, ticker: 'GOOGL', type: 'ACCIONES', name: '' },
      },
      {
        id: 4,
        size: 10,
        price: 500,
        status: 'CANCELLED',
        instrument: { id: 3, ticker: 'AMZN', type: 'ACCIONES', name: '' },
      },
      {
        id: 5,
        size: 5,
        price: 1000,
        status: 'FILLED',
        instrument: { id: 4, ticker: 'TSLA', type: 'NO ACCIONES', name: '' },
      },
    ];

    const result: AssetDTO[] = await summarizeOrders.execute(orders as Order[]);

    expect(result).toEqual([
      {
        ticker: 'AAPL',
        size: 80,
        price: 74700,
        instrumentid: 1,
        daily_return: 0,
      },
    ]);
  });

  it('should ignore orders of type "ACCIONES" with status REJECTED or CANCELLED', async () => {
    const orders: Partial<Order>[] = [
      {
        id: 1,
        size: 50,
        price: 930,
        status: 'REJECTED',
        instrument: { id: 1, ticker: 'AAPL', type: 'ACCIONES', name: '' },
      },
      {
        id: 2,
        size: 30,
        price: 940,
        status: 'CANCELLED',
        instrument: { id: 1, ticker: 'AAPL', type: 'ACCIONES', name: '' },
      },
    ];

    const result: AssetDTO[] = await summarizeOrders.execute(orders as Order[]);

    expect(result).toEqual([]);
  });

  it('should ignore non-ACCIONES type orders', async () => {
    const orders: Partial<Order>[] = [
      {
        id: 1,
        size: 50,
        price: 930,
        status: 'FILLED',
        instrument: { id: 1, ticker: 'AAPL', type: 'NO ACCIONES', name: '' },
      },
    ];

    const result: AssetDTO[] = await summarizeOrders.execute(orders as Order[]);

    expect(result).toEqual([]);
  });
});
