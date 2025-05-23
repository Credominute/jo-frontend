import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { AuthService } from '../authenticate/auth.service';
import { Order } from '../../models/order.model';
import { Offer, OfferInCart } from '../../models/offer.model';
import { OFFERS } from '../offers.constants';

@Injectable({
  providedIn: 'root'
})
export class TicketingService {
  private readonly endpointURL = environment.api + 'order';

  constructor(
    private readonly http: HttpClient,
    private readonly authService: AuthService
  ) {}

  private get authHeaders(): HttpHeaders {
    return new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + this.authService.getToken
    });
  }

// Création de commande (mockée ou réelle selon les flags d’environnement)
//
// NB : Dans ce projet éducatif, le paiement reste volontairement simulé même en production.
// La logique réelle (`createOrderReal`) est incluse à des fins de démonstration/extension,
// mais ne sera jamais exécutée tant que `environment.mockPayment` est true.
  createOrder(order: { cart: OfferInCart[], payment: any, nbPeople: number }): Observable<boolean> {
    const payload = {
      cart: this.mapOfferInCartToOffer(order.cart),
      payment: order.payment,
      nb_people: order.nbPeople,
    };

    return (environment.mock || environment.mockPayment) ? of(true) : this.createOrderReal(payload);
    }

    private createOrderReal(payload: any): Observable<boolean> {
      return this.http.post<void>(this.endpointURL, payload, { headers: this.authHeaders }).pipe(
        map(() => true),
        catchError(error => {
          console.error('Erreur lors de la création de la commande', error);
          return throwError(() => error);
      })
    );
  }

  // Récupération des offres visibles
  getAllVisible(): Observable<Offer[]> {
    console.log('[INFO] Chargement des offres depuis la constante OFFERS');
    return of(OFFERS);
  }

  // Mapping des articles du panier vers des offres
  private mapOfferInCartToOffer(cart: OfferInCart[]): Offer[] {
    return cart.map(item => ({
      offer_id: item.offer_id,
      title: item.title,
      description: item.description,
      nb_people: item.nb_people,
      price: item.price,
      image_url: item.image_url,
      visible: item.visible,
      loadfromJson: item.loadfromJson,
      ticket_type: item.ticket_type
    }));
  }

  // Récupération des commandes utilisateur
  getUserOrders(): Observable<Order[]> {
    return this.http.get<any[]>(this.endpointURL, { headers: this.authHeaders }).pipe(
      map(data => data.map(json => {
        const order = new Order();
        order.loadfromJson(json);
        return order;
      })),
      catchError(error => {
        console.error('Erreur lors du chargement des commandes utilisateur', error);
        return throwError(() => error);
      })
    );
  }

  // Récupération d'une commande spécifique
  getOrderById(orderId: number): Observable<Order> {
    return this.http.get<any>(`${this.endpointURL}/${orderId}`, { headers: this.authHeaders }).pipe(
      map(json => {
        const order = new Order();
        order.loadfromJson(json);
        return order;
      }),
      catchError(error => {
        console.error('Erreur lors de la récupération de la commande', error);
        return throwError(() => error);
      })
    );
  }
}