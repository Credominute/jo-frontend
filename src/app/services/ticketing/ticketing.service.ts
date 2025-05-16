import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, map, catchError, throwError, of, delay } from 'rxjs';
import { environment } from '../../../environments/environment';
import { AuthService } from '../authenticate/auth.service';
import { Order } from '../../models/order.model';
import { Offer, OfferInCart } from '../../models/offer.model';

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

  // ===================
  // Méthodes de commande
  // ===================

  createOrder(order: { cart: OfferInCart[], payment: any, nbPeople: number }): Observable<boolean> {
    return environment.mock ? this.createOrderMock(order) : this.createOrderReal(order);
  }

  private createOrderMock(order: { cart: OfferInCart[], payment: any, nbPeople: number }): Observable<boolean> {
    console.log('[MOCK] Commande simulée avec payload :', order);
    return of(true).pipe(delay(1000)); // Simulation d'un succès avec délai
  }

  private createOrderReal(order: { cart: OfferInCart[], payment: any, nbPeople: number }): Observable<boolean> {
    const payload = {
      cart: this.mapOfferInCartToOffer(order.cart),
      payment: order.payment,
      nb_people: order.nbPeople,
    };
    return this.http.post<void>(this.endpointURL, payload, { headers: this.authHeaders }).pipe(
      map(() => true),
      catchError(error => {
        console.error('Erreur lors de la création de la commande', error);
        return throwError(() => error);
      })
    );
  }

  // =======================
  // Méthodes de récupération
  // =======================

  getAllVisible(): Observable<Offer[]> {
    return environment.mock ? this.getAllVisibleMock() : this.getAllVisibleReal();
  }

  private getAllVisibleMock(): Observable<Offer[]> {
    console.log('[MOCK] Chargement des offres simulées');
    const offers = [
      { offer_id: 1, title: 'Solo', description: 'Une place', nb_people: 1, price: 50, image_url: 'assets/solo.png', visible: true, ticket_type: 'single' },
      { offer_id: 2, title: 'Duo', description: 'Deux places', nb_people: 2, price: 90, image_url: 'assets/duo.png', visible: true, ticket_type: 'duo' },
      { offer_id: 3, title: 'Familial', description: 'Quatre places', nb_people: 4, price: 149.99, image_url: 'assets/familial.png', visible: true, ticket_type: 'familial' },
    ];
    const mappedOffers = offers.map(json => {
    const offer = new Offer();
    offer.loadfromJson(json);
    return offer;
  });

  return of(mappedOffers).pipe(delay(500));
  }

  private getAllVisibleReal(): Observable<Offer[]> {
    return this.http.get<Offer[]>(`${this.endpointURL}/offers`, { headers: this.authHeaders }).pipe(
      catchError(error => {
        console.error('Erreur lors du chargement des offres', error);
        return throwError(() => error);
      })
    );
  }

  // ================
  // Gestion des mocks
  // ================

  private mapOfferInCartToOffer(cart: OfferInCart[]): Offer[] {
    return cart.map(item => {
      return {
        offer_id: item.offer_id, 
        title: item.title,
        description: item.description,
        nb_people: item.nb_people,
        price: item.price,
        image_url: item.image_url,  
        visible: item.visible,  
        loadfromJson: item.loadfromJson,  
        ticket_type: item.ticket_type
      };
    });
  }


  // Récupère toutes les commandes de l'utilisateur.

  getUserOrders(): Observable<Order[]> {
    return this.http.get<any[]>(this.endpointURL, { headers: this.authHeaders }).pipe(
      map(data =>
        data.map(json => {
          const order = new Order();
          order.loadfromJson(json);
          return order;
        })
      ),
      catchError(error => {
        console.error('Erreur lors du chargement des commandes utilisateur', error);
        return throwError(() => error);
      })
    );
  }

  // Récupère une commande spécifique.

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