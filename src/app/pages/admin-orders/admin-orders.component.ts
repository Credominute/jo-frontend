import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

interface Order {
  id: number;
  email: string;
  date: string;
  offerType: string;
  quantity: number;
  total: number;
}

@Component({
  selector: 'app-admin-orders',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './admin-orders.component.html',
  styleUrls: ['../../../scss/pages/admin-orders.scss']
})
export class AdminOrdersComponent {
  mockOrders: Order[] = [
    {
      id: 1,
      email: 'alice@example.com',
      date: '2024-07-20',
      offerType: 'Duo',
      quantity: 2,
      total: 120.0,
    },
    {
      id: 2,
      email: 'bob@example.com',
      date: '2024-08-05',
      offerType: 'Familial',
      quantity: 4,
      total: 240.0,
    },
    {
      id: 3,
      email: 'carol@example.com',
      date: '2024-08-12',
      offerType: 'Simple',
      quantity: 1,
      total: 60.0,
    }
  ];
}
