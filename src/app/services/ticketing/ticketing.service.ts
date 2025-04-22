import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, map, catchError, throwError, of } from 'rxjs';
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

  /**
   * Crée une commande basée sur les éléments du panier.
   * Attente de { cart: OfferInCart[], payment: any, nbPeople: number }
   */
  createOrder(order: { cart: OfferInCart[], payment: any, nbPeople: number }): Observable<boolean> {
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

  /**
   * Transforme un tableau d'OfferInCart en tableau d'Offer.
   */
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
  
  getAllVisible(): Observable<Offer[]> {
    const offers = [
      {
        offer_id: 1,
        title: 'Offre Solo',
        description: 'Une place pour une personne',
        nb_people: 1,
        price: 50,
        image_url: 'assets/solo.png',
        visible: true,
        ticket_type: 'single',
      },
      {
        offer_id: 2,
        title: 'Offre Duo',
        description: 'Deux places côte à côte',
        nb_people: 2,
        price: 90,
        image_url: 'assets/duo.png',
        visible: true,
        ticket_type: 'duo',
      }, 
      {
        offer_id: 3,
        title: 'Offre Familiale',
        description: 'Quatre personnes pour partager un moment unique',
        nb_people: 4,
        price: 149.99,
        image_url: 'assets/familial.png',
        visible: true,
        ticket_type: 'familial',
      }
    ];

    return new Observable<Offer[]>(observer => {
      observer.next(offers.map(json => {
        const offer = new Offer();
        offer.loadfromJson(json);
        return offer;
      }));
      observer.complete();
    });
  }
  /**
   * Récupère toutes les commandes de l'utilisateur.
   */
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

  /**
   * Récupère une commande spécifique.
   */
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