import { Test, TestingModule } from '@nestjs/testing';
import { OrderService } from './order.service'; // Asegúrate de que la ruta sea correcta
import { getRepositoryToken } from '@nestjs/typeorm';
import { Order } from '../entities/order.entity'; // Asegúrate de que la ruta sea correcta
import { Repository } from 'typeorm';

describe('OrderService', () => {
  let service: OrderService;
  let repository: Repository<Order>;

  const mockOrderRepository = {
    find: jest.fn(),
    findOneBy: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        OrderService,
        {
          provide: getRepositoryToken(Order),
          useValue: mockOrderRepository,
        },
      ],
    }).compile();

    service = module.get<OrderService>(OrderService);
    repository = module.get<Repository<Order>>(getRepositoryToken(Order));
  });

  afterEach(() => {
    jest.clearAllMocks(); // Limpiar mocks después de cada prueba
  });

  describe('findAll', () => {
    it('should return an array of orders', async () => {
      const orders = [{ id: 1 }, { id: 2 }];
      mockOrderRepository.find.mockResolvedValue(orders);

      const result = await service.findAll();

      expect(mockOrderRepository.find).toHaveBeenCalled();
      expect(result).toEqual(orders);
    });
  });

  describe('findOne', () => {
    it('should return an order by ID', async () => {
      const order = { id: 1, price: 100 };
      mockOrderRepository.findOneBy.mockResolvedValue(order);

      const result = await service.findOne(1);

      expect(mockOrderRepository.findOneBy).toHaveBeenCalledWith({ id: 1 });
      expect(result).toEqual(order);
    });
  });
});
