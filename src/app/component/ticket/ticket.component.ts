import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-ticket',
  standalone: true,
  imports: [],
  templateUrl: './ticket.component.html',
  styleUrls: ['/src/scss/component/ticket.scss']
})
export class TicketComponent {
  @Input() ticket: any = {};
  @Input() orderName!: string;

  constructor() {
  }

  ngAfterViewInit() {
    let qrcode = this.ticket.qrcode;
    let id = 'img-qrcode'+this.orderName;
    let div = document.getElementById(id);

    if (div) {
      div.appendChild(new DOMParser().parseFromString(qrcode, 'image/svg+xml').documentElement);
    }
  }
  
}
