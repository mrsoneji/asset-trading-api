import { Test, TestingModule } from '@nestjs/testing';
import { GetInstrumentReturnService } from './get-instrument-return.service'; // Ajusta la ruta según tu estructura de carpetas
import { InstrumentService } from '@modules/instruments/services/instrument.service';
import { MarketDataService } from '@modules/marketdata/services/marketdata.service';
import { Instrument } from '@modules/instruments/entities/instrument.entity';
import { MarketData } from '@modules/marketdata/entities/marketdata.entity';
import { Order } from '@modules/orders/entities/order.entity';

describe('GetInstrumentReturnService', () => {
  let getInstrumentReturnService: GetInstrumentReturnService;
  let instrumentService: InstrumentService;
  let marketDataService: MarketDataService;

  const mockInstrumentService = {
    findOne: jest.fn(),
  };

  const mockMarketDataService = {
    findByInstrumentId: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        GetInstrumentReturnService,
        { provide: InstrumentService, useValue: mockInstrumentService },
        { provide: MarketDataService, useValue: mockMarketDataService },
      ],
    }).compile();

    getInstrumentReturnService = module.get<GetInstrumentReturnService>(
      GetInstrumentReturnService,
    );
    instrumentService = module.get<InstrumentService>(InstrumentService);
    marketDataService = module.get<MarketDataService>(MarketDataService);
  });

  it('should calculate daily return for assets', async () => {
    const assets: Partial<Order>[] = [
      {
        instrument: {
          marketData: null,
          name: '',
          ticker: 'AAPL',
          type: '',
          id: 1,
        },
        size: 50,
        price: 930,
      },
      {
        instrument: {
          marketData: null,
          name: '',
          ticker: 'GOOGL',
          type: '',
          id: 2,
        },
        size: 30,
        price: 940,
      },
    ];

    const mockInstrument: Instrument = {
      id: 1,
      ticker: 'AAPL',
      type: 'ACCIONES',
    } as Instrument;
    const mockMarketData: MarketData = {
      close: 120,
      previousclose: 100,
    } as MarketData;

    mockInstrumentService.findOne.mockResolvedValue(mockInstrument);
    mockMarketDataService.findByInstrumentId.mockResolvedValue(mockMarketData);

    const result = await getInstrumentReturnService.execute(assets as Order[]);

    expect(result).toEqual([
      {
        instrumentid: 1,
        daily_return: 20,
        ticker: 'AAPL',
        size: 50,
        price: 120,
      }, // ((120-100)/100)*100 = 20%
      {
        instrumentid: 2,
        daily_return: 20,
        ticker: 'GOOGL',
        size: 30,
        price: 120,
      }, // ((120-100)/100)*100 = 20%
    ]);
  });

  it('should handle market data not found', async () => {
    const assets: Partial<Order>[] = [
      {
        instrument: {
          marketData: null,
          name: '',
          ticker: 'AAPL',
          type: '',
          id: 1,
        },
        size: 50,
        price: 930,
      },
    ];

    const mockInstrument: Instrument = {
      id: 1,
      ticker: 'AAPL',
      type: 'ACCIONES',
    } as Instrument;
    mockInstrumentService.findOne.mockResolvedValue(mockInstrument);
    mockMarketDataService.findByInstrumentId.mockResolvedValue(null);

    const result = await getInstrumentReturnService.execute(assets as Order[]);

    expect(result).toEqual([
      {
        ticker: 'AAPL',
        size: 50,
        daily_return: 0,
        instrumentid: 1,
        price: 0,
      },
    ]);
  });

  it('should throw error if previous close is not available', async () => {
    const assets: Partial<Order>[] = [
      {
        instrument: {
          marketData: null,
          name: '',
          ticker: 'AAPL',
          type: '',
          id: 1,
        },
        size: 50,
        price: 930,
      },
    ];

    const mockInstrument: Instrument = {
      id: 1,
      ticker: 'AAPL',
      type: 'ACCIONES',
    } as Instrument;
    const mockMarketData: MarketData = {
      close: 120,
      previousclose: 0,
    } as MarketData;

    mockInstrumentService.findOne.mockResolvedValue(mockInstrument);
    mockMarketDataService.findByInstrumentId.mockResolvedValue(mockMarketData);

    await expect(
      getInstrumentReturnService.execute(assets as Order[]),
    ).rejects.toThrow('Previous close is not available or zero');
  });
});
