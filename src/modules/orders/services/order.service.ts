import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Order } from '../entities/order.entity'; // Asegúrate de que la ruta sea correcta

@Injectable()
export class OrderService {
  constructor(
    @InjectRepository(Order)
    private orderRepository: Repository<Order>,
  ) {}

  // Método para crear una nueva orden
  async createOrder(orderData: Partial<Order>): Promise<Order> {
    const order = this.orderRepository.create(orderData);
    return this.orderRepository.save(order);
  }

  // Método para obtener todas las órdenes
  async findAll(): Promise<Order[]> {
    return this.orderRepository.find();
  }

  // Método para obtener una orden por ID
  async findOne(id: number): Promise<Order> {
    return this.orderRepository.findOneBy({ id });
  }

  // Método para actualizar una orden
  async updateOrder(id: number, updateData: Partial<Order>): Promise<Order> {
    await this.orderRepository.update(id, updateData);
    return this.findOne(id); // Devuelve la orden actualizada
  }

  // Método para eliminar una orden
  async removeOrder(id: number): Promise<void> {
    await this.orderRepository.delete(id);
  }
}
