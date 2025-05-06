import { Order } from './order.model';

describe('Order model', () => {
  it('should create an Order with default values', () => {
    const order = new Order();
    expect(order.user_id).toBe(0);
    expect(order.date_order).toBeTruthy();
    expect(order.price).toBe(0);
    expect(order.ticket_type).toBe('');
    expect(order.tickets.length).toBe(0); // maintenant c’est un tableau
  });

  it('should assign values from JSON correctly', () => {
    const json = {
      user_id: 1,
      price: 30.5,
      ticket_type: 'duo',
      date_order: '2024-07-01T10:00:00Z',
      tickets: [
        {
          ticket_id: 1,
          order_id: 1,
          is_duo: true,
          is_single: false,
          is_familial: false,
          number_of_places: 2
        }
      ]
    };

    const order = new Order();
    order.loadfromJson(json);

    expect(order.user_id).toBe(1);
    expect(order.price).toBe(30.5);
    expect(order.ticket_type).toBe('duo');
    expect(order.date_order).toBe('2024-07-01T10:00:00Z');
    expect(order.tickets.length).toBe(1);
    expect(order.tickets[0].number_of_places).toBe(2);
    expect(order.tickets[0].is_duo).toBeTrue();
  });

  it('should handle partial JSON input gracefully', () => {
    const json = {
      user_id: 2,
      tickets: [
        { number_of_places: 1 }
      ]
    };

    const order = new Order();
    order.loadfromJson(json);

    expect(order.user_id).toBe(2);
    expect(order.tickets.length).toBe(1);
    expect(order.tickets[0].number_of_places).toBe(1);
    expect(order.date_order).toBeTruthy();
  });

  it('should instantiate Ticket instances correctly when loading from JSON', () => {
    const json = {
      user_id: 7,
      price: 42,
      ticket_type: 'familial',
      date_time: '2024-09-01T12:00:00Z',
      tickets: [
        {
          ticket_id: 1,
          order_id: 999,
          is_single: false,
          is_duo: false,
          is_familial: true,
          number_of_places: 4
        }
      ]
    };
  
    const order = new Order();
    order.loadfromJson(json);
  
    expect(order.tickets.length).toBe(1);
  
    const ticket = order.tickets[0];
    expect(ticket instanceof Object).toBeTrue(); // typage dynamique
    expect(ticket.ticket_id).toBe(1);
    expect(ticket.is_familial).toBeTrue();
    expect(ticket.number_of_places).toBe(4);
  });
  
});