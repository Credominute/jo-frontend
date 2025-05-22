import { Component } from '@angular/core';
import { TicketingService } from '../../services/ticketing/ticketing.service';
import { OrderComponent } from "../../component/order/order.component";
import { Order } from '../../models/order.model';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/authenticate/auth.service';
import { Router } from '@angular/router';
import { ModalService } from '../../services/modal/modal.service';

@Component({
  selector: 'app-orders',
  standalone: true,
  templateUrl: './orders.component.html',
  styleUrl: '../../../scss/pages/orders.scss',
  imports: [CommonModule, OrderComponent]
})
export class OrdersComponent {

  ordersArray: Order[] = [];

  constructor(private readonly ticketingService: TicketingService, private readonly authService: AuthService, private readonly router:Router, protected modalService: ModalService) { }

  ngOnInit(): void {
    // Si l'utilisateur est authentifié, la commande peut être récupérée
    if (this.authService.getIsAuthenticated) {
      this.ticketingService.getUserOrders().subscribe({
        next:
          (orders: Order[]) => {
            this.ordersArray = orders;
          },
        error: (error) => {
          console.error(error);
        }
      });
    }
    // Si l'utilisateur n'est pas authentifié, il est redirigé vers le modal du login
    else {
      alert("You are not authenticated");
      this.router.navigate(['/']);
      this.modalService.open('login');
    }
  }
}
