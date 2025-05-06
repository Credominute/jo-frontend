import { Ticket } from './ticket.model';

describe('Ticket model', () => {
  it('should create a Ticket with default values', () => {
    const ticket = new Ticket();

    expect(ticket.ticket_id).toBe(0);
    expect(ticket.order_id).toBe(0);
    expect(ticket.is_single).toBeFalse();
    expect(ticket.is_duo).toBeFalse();
    expect(ticket.is_familial).toBeFalse();
    expect(ticket.number_of_places).toBe(1);
  });

  it('should load values correctly from JSON', () => {
    const json = {
      ticket_id: 5,
      order_id: 2,
      is_single: false,
      is_duo: true,
      is_familial: false,
      number_of_places: 2
    };

    const ticket = new Ticket();
    ticket.loadfromJson(json);

    expect(ticket.ticket_id).toBe(5);
    expect(ticket.order_id).toBe(2);
    expect(ticket.is_single).toBeFalse();
    expect(ticket.is_duo).toBeTrue();
    expect(ticket.is_familial).toBeFalse();
    expect(ticket.number_of_places).toBe(2);
  });

  it('should handle partial JSON input gracefully', () => {
    const json = {
      number_of_places: 4,
      is_familial: true
    };

    const ticket = new Ticket();
    ticket.loadfromJson(json);

    expect(ticket.ticket_id).toBe(0); // valeur par défaut conservée
    expect(ticket.is_familial).toBeTrue();
    expect(ticket.number_of_places).toBe(4);
  });

  it('should not crash with empty or malformed JSON', () => {
    const ticket = new Ticket();

    ticket.loadfromJson({});
    expect(ticket.number_of_places).toBe(1); // reste inchangé

    ticket.loadfromJson(null as any); // test de robustesse
    expect(ticket.number_of_places).toBe(1); // pas d'effet
  });
});
