import { Test, TestingModule } from '@nestjs/testing';
import { CreateOrderService } from './create-order.service';
import { InstrumentService } from '@modules/instruments/services/instrument.service';
import { OrderService } from './order.service';
import { BalanceAccordingMovementService } from '@modules/wallet/services/balance-according-movement.service';
import { MarketDataService } from '@modules/marketdata/services/marketdata.service';
import { User } from '@modules/users/entities/user.entity';
import { CreateOrderDTO } from '../dtos/create-order.dto';
import { BadRequestException } from '@nestjs/common';
import { Order } from '../entities/order.entity';
import { Instrument } from '@modules/instruments/entities/instrument.entity';
import { MarketData } from '@modules/marketdata/entities/marketdata.entity';

describe('CreateOrderService', () => {
  let service: CreateOrderService;
  let instrumentService: InstrumentService;
  let orderService: OrderService;
  let balanceAccordingMovementService: BalanceAccordingMovementService;
  let marketDataService: MarketDataService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CreateOrderService,
        {
          provide: InstrumentService,
          useValue: {
            findOneByTicker: jest.fn(),
          },
        },
        {
          provide: OrderService,
          useValue: {
            findByUserId: jest.fn(),
            createOrder: jest.fn(),
          },
        },
        {
          provide: BalanceAccordingMovementService,
          useValue: {
            execute: jest.fn(),
          },
        },
        {
          provide: MarketDataService,
          useValue: {
            findByInstrumentId: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<CreateOrderService>(CreateOrderService);
    instrumentService = module.get<InstrumentService>(InstrumentService);
    orderService = module.get<OrderService>(OrderService);
    balanceAccordingMovementService =
      module.get<BalanceAccordingMovementService>(
        BalanceAccordingMovementService,
      );
    marketDataService = module.get<MarketDataService>(MarketDataService);
  });

  it('should throw BadRequestException if the instrument does not exist', async () => {
    jest.spyOn(instrumentService, 'findOneByTicker').mockResolvedValue(null);

    const user = { id: 1 } as User;
    const createOrderDto = {
      ticker: 'AAPL',
      type: 'LIMIT',
      size: 10,
    } as CreateOrderDTO;

    await expect(service.execute(user, createOrderDto)).rejects.toThrow(
      BadRequestException,
    );
  });

  it('should create a LIMIT order successfully', async () => {
    const instrument = { id: 1, ticker: 'AAPL' } as Instrument;
    jest
      .spyOn(instrumentService, 'findOneByTicker')
      .mockResolvedValue(instrument);
    jest.spyOn(orderService, 'findByUserId').mockResolvedValue([]);
    jest
      .spyOn(balanceAccordingMovementService, 'execute')
      .mockResolvedValue(1000);

    const user = { id: 1 } as User;
    const createOrderDto = {
      ticker: 'AAPL',
      type: 'LIMIT',
      size: 10,
      price: 100,
    } as CreateOrderDTO;

    const result = await service.execute(user, createOrderDto);

    expect(result).toEqual(
      expect.objectContaining({
        userid: user.id,
        instrument: instrument,
        size: createOrderDto.size,
        type: createOrderDto.type,
        price: createOrderDto.price,
        status: 'NEW',
      }),
    );
    expect(orderService.createOrder).toHaveBeenCalledWith(
      expect.objectContaining({
        userid: user.id,
        instrument: instrument,
      }),
    );
  });

  it('should create a MARKET order and use market data price', async () => {
    const instrument = { id: 1, ticker: 'AAPL' } as Instrument;
    jest
      .spyOn(instrumentService, 'findOneByTicker')
      .mockResolvedValue(instrument);
    const marketData = { close: 150 } as MarketData;
    jest
      .spyOn(marketDataService, 'findByInstrumentId')
      .mockResolvedValue(marketData);
    jest.spyOn(orderService, 'findByUserId').mockResolvedValue([]);
    jest
      .spyOn(balanceAccordingMovementService, 'execute')
      .mockResolvedValue(1000);

    const user = { id: 1 } as User;
    const createOrderDto = {
      ticker: 'AAPL',
      type: 'MARKET',
      size: 10,
    } as CreateOrderDTO;

    const result = await service.execute(user, createOrderDto);

    expect(result.price).toBe(marketData.close);
    expect(result.status).toBe('REJECTED');
    expect(orderService.createOrder).toHaveBeenCalledWith(result);
  });

  it('should reject the order if balance is insufficient', async () => {
    const instrument = { id: 1, ticker: 'AAPL' } as Instrument;
    jest
      .spyOn(instrumentService, 'findOneByTicker')
      .mockResolvedValue(instrument);
    jest.spyOn(orderService, 'findByUserId').mockResolvedValue([]);
    jest
      .spyOn(balanceAccordingMovementService, 'execute')
      .mockResolvedValue(500); // Insufficient balance

    const user = { id: 1 } as User;
    const createOrderDto = {
      ticker: 'AAPL',
      type: 'LIMIT',
      size: 10,
      price: 100,
    } as CreateOrderDTO;

    const result = await service.execute(user, createOrderDto);

    expect(result.status).toBe('REJECTED');
    expect(orderService.createOrder).toHaveBeenCalledWith(result);
  });
});
