import { Test, TestingModule } from '@nestjs/testing';
import { InstrumentService } from './instrument.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Instrument } from '../entities/instrument.entity';
import { Repository } from 'typeorm';

describe('InstrumentService', () => {
  let service: InstrumentService;
  let instrumentRepository: Repository<Instrument>;

  // Datos mock
  const mockInstruments = [
    {
      id: 1,
      ticker: 'AAPL',
      name: 'Apple Inc.',
      marketData: [{ close: 150.0, previousClose: 145.0 }],
    },
    {
      id: 2,
      ticker: 'TSLA',
      name: 'Tesla Inc.',
      marketData: [{ close: 900.0, previousClose: 880.0 }],
    },
  ];

  const mockRepository = {
    find: jest.fn().mockResolvedValue(mockInstruments),
    findOneBy: jest.fn().mockImplementation(({ id }) => {
      return mockInstruments.find((instrument) => instrument.id === id);
    }),
    manager: {
      query: jest.fn().mockResolvedValue(mockInstruments),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        InstrumentService,
        {
          provide: getRepositoryToken(Instrument),
          useValue: mockRepository,
        },
      ],
    }).compile();

    service = module.get<InstrumentService>(InstrumentService);
    instrumentRepository = module.get<Repository<Instrument>>(
      getRepositoryToken(Instrument),
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
