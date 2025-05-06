export class Ticket {
    ticket_id: number;
    order_id: number;
  
    is_single: boolean;
    is_duo: boolean;
    is_familial: boolean;
  
    number_of_places: number;
  
    constructor() {
      this.ticket_id = 0;
      this.order_id = 0;
  
      this.is_single = false;
      this.is_duo = false;
      this.is_familial = false;
  
      this.number_of_places = 1;
    }
  
    loadfromJson(json: any) {
      Object.assign(this, json);
    }
  }
  