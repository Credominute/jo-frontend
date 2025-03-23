import { Component, Input } from '@angular/core';
import { Order } from '../../models/order.model';
import { ShoppingCartComponent } from "../shopping-cart/shopping-cart.component";
import { CommonModule } from '@angular/common';
import { TicketComponent } from '../ticket/ticket.component';

@Component({
    selector: 'app-order',
    standalone: true,
    templateUrl: './order.component.html',
    styleUrl: '/src/scss/components/order.scss',
    imports: [ShoppingCartComponent, CommonModule, TicketComponent]
})
export class OrderComponent {
  @Input() order: Order = new Order();
  showDetailsOrder: boolean = false;
  showTicketOrder: boolean = false;

  showDetails() {
    this.showDetailsOrder = !this.showDetailsOrder;
  }

  showTicket() {
    this.showTicketOrder = !this.showTicketOrder;
  }

}
