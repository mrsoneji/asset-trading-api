import { Test, TestingModule } from '@nestjs/testing';
import { MarketDataService } from './marketdata.service'; // Asegúrate de que la ruta sea correcta
import { getRepositoryToken } from '@nestjs/typeorm';
import { MarketData } from '../entities/marketdata.entity'; // Asegúrate de que la ruta sea correcta
import { Repository } from 'typeorm';

describe('MarketDataService', () => {
  let service: MarketDataService;
  let repository: Repository<MarketData>;

  const mockMarketDataRepository = {
    find: jest.fn(),
    findOneBy: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MarketDataService,
        {
          provide: getRepositoryToken(MarketData),
          useValue: mockMarketDataRepository,
        },
      ],
    }).compile();

    service = module.get<MarketDataService>(MarketDataService);
    repository = module.get<Repository<MarketData>>(
      getRepositoryToken(MarketData),
    );
  });

  afterEach(() => {
    jest.clearAllMocks(); // Limpiar mocks después de cada prueba
  });

  describe('findAll', () => {
    it('should return an array of market data', async () => {
      const marketDataArray = [
        { id: 1, close: 100 },
        { id: 2, close: 200 },
      ]; // Datos de prueba
      mockMarketDataRepository.find.mockResolvedValue(marketDataArray);

      const result = await service.findAll();

      expect(mockMarketDataRepository.find).toHaveBeenCalled();
      expect(result).toEqual(marketDataArray);
    });
  });

  describe('findOne', () => {
    it('should return a market data entry by ID', async () => {
      const marketDataEntry = { id: 1, close: 100 };
      mockMarketDataRepository.findOneBy.mockResolvedValue(marketDataEntry);

      const result = await service.findOne(1);

      expect(mockMarketDataRepository.findOneBy).toHaveBeenCalledWith({
        id: 1,
      });
      expect(result).toEqual(marketDataEntry);
    });
  });
});
