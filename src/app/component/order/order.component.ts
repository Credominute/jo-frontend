import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Order } from '../../models/order.model';
import { TicketComponent } from '../ticket/ticket.component';

@Component({
  selector: 'app-order',
  standalone: true,
  templateUrl: './order.component.html',
  styleUrls: ['../../../scss/components/order.scss'], // ✅ corrigé (styleUrls au pluriel)
  imports: [CommonModule, TicketComponent]
})
export class OrderComponent {
  @Input() order!: Order; // j'évite `new Order()` (les interfaces ne sont pas des classes)
  showDetailsOrder = false;
  showTicketOrder = false;

  showDetails(): void {
    this.showDetailsOrder = !this.showDetailsOrder;
  }

  showTicket(): void {
    this.showTicketOrder = !this.showTicketOrder;
  }
}
