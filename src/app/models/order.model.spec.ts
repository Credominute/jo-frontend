import { Order } from './order.model';

describe('Order model', () => {
  it('should create an Order with default values', () => {
    const order = new Order();
    expect(order.user_id).toBe(0); // non initialisé dans le constructeur
    expect(order.date_time).toBeTruthy();  // Date string générée
    expect(order.price).toBe(0);   // idem
    expect(order.ticket_type).toBe('');
    expect(order.ticket.nb_places).toBe(0);
  });

  it('should assign values from JSON correctly', () => {
    const json = {
      user_id: 1,
      price: 30.5,
      ticket_type: 'duo',
      date_time: '2024-07-01T10:00:00Z',
      ticket: {
        qrcode: '123456',
        last_name: 'Dupont',
        first_name: 'Marie',
        nb_places: 3
      },
      details: ['Offre A', 'Offre B']
    };

    const order = new Order();
    order.loadfromJson(json);

    expect(order.user_id).toBe(1);
    expect(order.price).toBe(30.5);
    expect(order.ticket_type).toBe('duo');
    expect(order.date_time).toBe('2024-07-01T10:00:00Z');
    expect(order.ticket.qrcode).toBe('123456');
    expect(order.ticket.last_name).toBe('Dupont');
    expect(order.ticket.first_name).toBe('Marie');
    expect(order.ticket.nb_places).toBe(3);
  });

  it('should handle partial JSON input gracefully', () => {
    const json = {
      user_id: 2,
      ticket: {
        nb_places: 1
      }
    };

    const order = new Order();
    order.loadfromJson(json);

    expect(order.user_id).toBe(2);
    expect(order.ticket.nb_places).toBe(1);
    expect(order.date_time).toBeTruthy(); // par défaut dans constructor
  });
});

