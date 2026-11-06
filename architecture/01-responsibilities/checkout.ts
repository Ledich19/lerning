/*
Практика на 20–30 минут. Ответственность — область решений класса, связность — насколько его обязанности относятся к одной задаче, зацепление — насколько код зависит от деталей других частей.

1. Отрефактори CheckoutService.placeOrder. Покажи зависимости через конструкторы или сигнатуры. Сохрани порядок чтения пользователя и товаров, расчёта, записи заказа, отправки письма и возврата ID, а также текущее поведение на ошибках. Схему PostgreSQL и транзакции оставь за рамками задачи.
2. В комментарии или описании коммита назови три независимые причины изменения. Для двух изменений — новая скидка для premium и замена почтового API — перечисли затронутые классы и объясни, почему остальной код можно оставить прежним.
3. Приведи один пример лишнего дробления и объясни его цену.

Для 4 обязательны рабочий TypeScript, осмысленное разделение, явные зависимости, сохранение поведения и объяснение трёх причин и двух изменений. Для 5 дополнительно обоснуй компромисс на примере лишнего дробления и разбери пограничный случай сохранения поведения.
*/

import { Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

// Репозитории привязаны к сущностям приложения через метаданные TypeORM.
type Customer = { id: string; email: string; tier: 'standard' | 'premium' };
type Product = { id: string; priceInCents: number };
type Item = { productId: string; quantity: number };
type Order = { id: string; customerId: string; totalInCents: number; items: Item[] };

interface MailClient {
  send(message: { to: string; subject: string; html: string }): Promise<void>;
}

@Injectable()
export class CheckoutService {
  constructor(
    @InjectRepository('Customer') private readonly customers: Repository<Customer>,
    @InjectRepository('Product') private readonly products: Repository<Product>,
    @InjectRepository('Order') private readonly orders: Repository<Order>,
    @Inject('MAIL_CLIENT') private readonly mail: MailClient,
  ) {}

  async placeOrder(customerId: string, items: Item[]): Promise<string> {
    const customer = await this.customers.findOneByOrFail({ id: customerId });

    let subtotal = 0;
    for (const item of items) {
      const product = await this.products.findOneByOrFail({ id: item.productId });
      subtotal += product.priceInCents * item.quantity;
    }

    const discount = customer.tier === 'premium' ? Math.floor(subtotal / 10) : 0;
    const order = await this.orders.save({
      customerId,
      items,
      totalInCents: subtotal - discount,
    });

    await this.mail.send({
      to: customer.email,
      subject: 'Order confirmed',
      html: `<p>Total: ${order.totalInCents} cents</p>`,
    });

    return order.id;
  }
}
