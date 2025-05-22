import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Offer, OfferInCart } from '../../models/offer.model'; 
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  private readonly apiUrlOrder: string = `${environment.api}order`;
  private readonly apiUrlTicket: string = `${environment.api}ticket`;  

  constructor(private readonly http: HttpClient) { }

// Méthode pour créer un ticket après la commande
createOffer(offerData: Offer): Observable<Offer> {
  return this.http.post<Offer>(`${this.apiUrlTicket}/`, offerData);
}

// Méthode pour récupérer les informations du ticket (par exemple pour afficher un récapitulatif)
getOffers(): Observable<Offer[]> {
  return this.http.get<Offer[]>(`${this.apiUrlTicket}/`);
}

// Méthode pour obtenir les tickets dans le panier
getOffersFromCart(): OfferInCart[] {
  const cartData = localStorage.getItem('cart');
  return cartData ? JSON.parse(cartData) : [];
}}