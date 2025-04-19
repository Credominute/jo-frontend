export class Order {
    user_id: number;
    date_time: string;
    price: number;
    ticket_type: string;
    ticket: {
      qrcode: string;
      last_name: string;
      first_name: string;
      nb_places: number;
    };
  
    constructor(
      user_id: number = 0,
      price: number = 0,
      ticket_type: string = '',
      ticket = {
        qrcode: '',
        last_name: '',
        first_name: '',
        nb_places: 0
      },
      date_time = new Date().toUTCString()
    ) {
      this.user_id = user_id;
      this.price = price;
      this.ticket_type = ticket_type;
      this.ticket = ticket;
      this.date_time = date_time;
    }
  
    loadfromJson(json: any) {
      Object.assign(this, json);
    }
  }
  