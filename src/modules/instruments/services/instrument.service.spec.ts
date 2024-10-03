import { Test, TestingModule } from '@nestjs/testing';
import { InstrumentService } from './instrument.service'; // Asegúrate de que la ruta sea correcta
import { getRepositoryToken } from '@nestjs/typeorm';
import { Instrument } from '../entities/instrument.entity'; // Asegúrate de que la ruta sea correcta
import { Repository } from 'typeorm';

describe('InstrumentService', () => {
  let service: InstrumentService;
  let repository: Repository<Instrument>;

  const mockInstrumentRepository = {
    find: jest.fn(),
    findOneBy: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        InstrumentService,
        {
          provide: getRepositoryToken(Instrument),
          useValue: mockInstrumentRepository,
        },
      ],
    }).compile();

    service = module.get<InstrumentService>(InstrumentService);
    repository = module.get<Repository<Instrument>>(
      getRepositoryToken(Instrument),
    );
  });

  afterEach(() => {
    jest.clearAllMocks(); // Limpiar mocks después de cada prueba
  });

  describe('findAll', () => {
    it('should return an array of instruments', async () => {
      const instrumentsArray = [
        { id: 1, ticker: 'AAPL', name: 'Apple Inc.', type: 'Stock' },
        { id: 2, ticker: 'GOOGL', name: 'Alphabet Inc.', type: 'Stock' },
      ]; // Datos de prueba
      mockInstrumentRepository.find.mockResolvedValue(instrumentsArray);

      const result = await service.findAll();

      expect(mockInstrumentRepository.find).toHaveBeenCalled();
      expect(result).toEqual(instrumentsArray);
    });
  });

  describe('findOne', () => {
    it('should return an instrument entry by ID', async () => {
      const instrumentEntry = {
        id: 1,
        ticker: 'AAPL',
        name: 'Apple Inc.',
        type: 'Stock',
      };
      mockInstrumentRepository.findOneBy.mockResolvedValue(instrumentEntry);

      const result = await service.findOne(1);

      expect(mockInstrumentRepository.findOneBy).toHaveBeenCalledWith({
        id: 1,
      });
      expect(result).toEqual(instrumentEntry);
    });
  });
});
