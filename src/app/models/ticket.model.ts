import { SafeUrl } from '@angular/platform-browser';

export class Ticket {
    ticket_id: number;
    order_id: number;
    is_single: boolean;
    is_duo: boolean;
    is_familial: boolean;
    number_of_places: number;
    qrcode: string;
    safeQrcodeUrl?: SafeUrl;
  
    constructor() {
      this.ticket_id = 0;
      this.order_id = 0;
      this.is_single = false;
      this.is_duo = false;
      this.is_familial = false;
      this.number_of_places = 1;
      this.qrcode = '';
    }
  
    loadfromJson(json: any) {
      Object.assign(this, json);
    }
  }