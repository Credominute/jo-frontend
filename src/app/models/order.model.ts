import { Ticket } from './ticket.model';

export class Order {
  order_id: number;
  user_id: number;
  date_order: string;
  price: number;
  ticket_type: string;
  tickets: Ticket[];

  constructor(
    user_id: number = 0,
    price: number = 0,
    ticket_type: string = '',
    tickets: Ticket[] = [],
    date_order: string = new Date().toUTCString(),
    order_id: number = 0
  ) {
    this.order_id = order_id;
    this.user_id = user_id;
    this.price = price;
    this.ticket_type = ticket_type;
    this.tickets = tickets;
    this.date_order = date_order;
  }

  loadfromJson(json: any) {
    Object.assign(this, json);
    if (json.tickets) {
      this.tickets = json.tickets.map((t: any) => {
        const ticket = new Ticket();
        ticket.loadfromJson(t);
        return ticket;
      });
    } else {
      this.tickets = [];
    }
  }
}

  