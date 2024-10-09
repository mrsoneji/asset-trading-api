import { Order } from '@modules/orders/entities/order.entity';
import { Injectable } from '@nestjs/common';

@Injectable()
export class SummarizeOrders {
  async execute(orders: Order[]): Promise<Order[]> {
    const summarizedOrders: Order[] = orders.reduce((acc, order) => {
      const { ticker, type, id } = order.instrument;
      const { status } = order;

      // Solo procesamos la orden si el tipo es 'ACCIONES'
      if (
        type !== 'ACCIONES' ||
        status === 'REJECTED' ||
        status === 'CANCELLED'
      ) {
        return acc; // Si el tipo no es 'ACCIONES', simplemente devolvemos el acumulador sin cambios
      }

      // Buscamos si ya existe una orden con el mismo ticker en el array
      const existingOrder = acc.find((o) => o.instrument.id === id);

      if (existingOrder) {
        // Si ya existe, acumulamos el `size` y `price` en la orden existente
        existingOrder.size += order.size;
        existingOrder.price += order.price * order.size; // Multiplicamos por el tamaño para calcular el precio total
      } else {
        // Si no existe, agregamos la nueva orden al array acumulador
        acc.push({
          ...order,
          size: order.size,
          price: order.price * order.size,
        });
      }

      return acc;
    }, [] as Order[]);

    // Convertimos el objeto en un array
    return summarizedOrders;
  }
}
