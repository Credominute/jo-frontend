import { Order } from './order.model';

describe('Order model', () => {
  it('should create an Order with default values', () => {
    const order = new Order();
    expect(order.name).toBe('');
    expect(order.ticket.nb_places).toBe(0);
    expect(order.details.length).toBe(0);
  });

  it('should assign values from JSON correctly', () => {
    const json = {
      name: 'Commande 1',
      date_time: '2024-07-01',
      ticket: {
        qrcode: '123456',
        last_name: 'Dupont',
        first_name: 'Marie',
        nb_places: 3
      },
      details: ['A', 'B']
    };
    const order = new Order();
    order.loadfromJson(json);
    expect(order.name).toBe('Commande 1');
    expect(order.ticket.qrcode).toBe('123456');
    expect(order.details.length).toBe(2);
  });

  it('should keep default values if JSON is missing fields', () => {
    const json = { name: 'Commande partielle' };
    const order = new Order();
    order.loadfromJson(json);
    expect(order.name).toBe('Commande partielle');
    expect(order.ticket.nb_places).toBe(0);
  });
});
