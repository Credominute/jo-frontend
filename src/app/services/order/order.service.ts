import { AuthService } from './../authenticate/auth.service';
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Order } from '../../models/order.model';

@Injectable({
  providedIn: 'root'
})
export class OrderService {

  endpointURL = environment.api + 'orders';

  constructor(private readonly authService: AuthService, private readonly httpClient: HttpClient) { }

  create(order: any) {
    // Create the order object to send to the server
    const newOrder = {
      cart: order.cart,
      payment: order.payment,
      nb_people: order.nbPeople,
    };

    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + this.authService.getToken
    });


    return new Observable<boolean>(observer => {
      this.httpClient.post(this.endpointURL, newOrder, { headers }).subscribe({
        next: (data: any) => {
          observer.next(true);
          observer.complete();
        },
        error: (error) => {
          observer.error(error);
          observer.complete();
        }
      });
    });
  }

  // Get the orders of the user connected
  getOrdersUser() {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + this.authService.getToken
    });

    return new Observable<Order[]>(observer => {
      this.httpClient.get(this.endpointURL, { headers }).subscribe({
        next: (data: any) => {
          const orders = [];

          for(const jsonOrder of data){
            const order = new Order();
            order.loadfromJson(jsonOrder);
            orders.push(order);
          }

          observer.next(orders);
          observer.complete();
        },
        error: (error) => {
          observer.error(error);
          observer.complete();
        }
      });
    });
  }
}
