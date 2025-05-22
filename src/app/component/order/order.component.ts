import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Order } from '../../models/order.model';
import { DomSanitizer} from '@angular/platform-browser';

@Component({
  selector: 'app-order',
  standalone: true,
  templateUrl: './order.component.html',
  styleUrls: ['../../../scss/components/order.scss'],
  imports: [CommonModule]
})
export class OrderComponent {
  @Input() order!: Order; 
  showDetailsOrder = false;
  showTicketOrder = false;

  constructor(private readonly sanitizer: DomSanitizer) {}

  ngOnChanges(): void {
    if (this.order?.tickets) {
      this.order.tickets.forEach(ticket => {
        ticket.safeQrcodeUrl = this.sanitizer.bypassSecurityTrustUrl(
          'data:image/png;base64,' + ticket.qrcode
        );
      });
    }
  }

  showDetails(): void {
    this.showDetailsOrder = !this.showDetailsOrder;
  }
  showTicket(): void {
    this.showTicketOrder = !this.showTicketOrder;
  }
}