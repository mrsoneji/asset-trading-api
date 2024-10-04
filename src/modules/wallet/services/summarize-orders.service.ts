import { Order } from '@modules/orders/entities/order.entity';
import { Injectable } from '@nestjs/common';
import { AssetDTO } from '../dtos/asset.dto';

@Injectable()
export class SummarizeOrders {
  async execute(orders: Order[]): Promise<AssetDTO[]> {
    const summarizedOrders: AssetDTO[] = orders.reduce((acc, order) => {
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
      const existingOrder = acc.find((o) => o.instrumentid === id);

      if (existingOrder) {
        // Si ya existe, acumulamos el `size` y `price` en la orden existente
        existingOrder.size += order.size;
        existingOrder.price += order.price * order.size; // Multiplicamos por el tamaño para calcular el precio total
      } else {
        // Si no existe, agregamos la nueva orden al array acumulador
        acc.push({
          ticker,
          size: order.size,
          price: order.price * order.size,
          instrumentid: order.instrument.id,
          daily_return: 0, // Inicializamos con 0 o cualquier valor que corresponda
        });
      }

      return acc;
    }, [] as AssetDTO[]);

    // Convertimos el objeto en un array
    return summarizedOrders;
  }
}
