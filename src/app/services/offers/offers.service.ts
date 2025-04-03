import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Offer } from '../../models/offer.model';
import { AuthService } from '../authenticate/auth.service';

@Injectable({
  providedIn: 'root'
})
export class OffersService {

  endpointURL = environment.api + 'offers';

  constructor(private readonly httpClient: HttpClient, private readonly authService: AuthService) {
  }

  getAll() {
    return new Observable<Offer[]>(observer => {
      this.httpClient.get(this.endpointURL).subscribe({
        next: (data: any) => {
          const offers = [];
          for (const jsonOffer of data) {
            const offer = new Offer();
            offer.loadfromJson(jsonOffer);
            offers.push(offer);
          }
          observer.next(offers);
          observer.complete();
        },
        error: error => {
          observer.error(error);
          observer.complete();
        }
      });
    });
  }

  getAllVisible() {
    return new Observable<Offer[]>(observer => {
      let visible_order_by = this.endpointURL + "/visible?c=nb_people&order=asc";
      this.httpClient.get(visible_order_by).subscribe({
        next: (data: any) => {
          const offers = [];

          for (const jsonOffer of data) {
            const offer = new Offer();
            offer.loadfromJson(jsonOffer);
            offers.push(offer);
          }

          observer.next(offers);
          observer.complete();
        },
        error: error => {
          console.log(error);
          observer.error(error);
          observer.complete();
        }
      });
    });
  }

  get(id: number) {
    return new Observable<Offer>(observer => {
      this.httpClient.get(this.endpointURL + '/' + id).subscribe({
        next: (data: any) => {
          const offer = new Offer();
          offer.loadfromJson(data);
          observer.next(offer);
          observer.complete();
        },
        error: (error) => {
          observer.error(error);
          observer.complete();
        }
      });
    });
  }

  // Check if the offer title already exists
  getByTitle(title: string) {
    return new Observable<boolean>(observer => {
      this.httpClient.get(this.endpointURL + '/title/' + title).subscribe({
        next: (data: any) => {
          observer.next(data.exist);
          observer.complete();
        },
        error: (error) => {
          observer.error(error);
          observer.complete();
        }
      });
    });
  }

  // patch the visibility of an offer
  toggleVisible(id: number, visible: boolean) {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + this.authService.getToken
    });

    return new Observable<Offer>(observer => {
      this.httpClient.patch(this.endpointURL + '/' + id + '/visible', { visible: visible }, { headers }).subscribe({
        next: (data: any) => {
          const offer = new Offer();
          offer.loadfromJson(data);
          observer.next(offer);
          observer.complete();
        },
        error: (error) => {
          console.error(error);
          observer.error(error);
          observer.complete();
        }
      });
    });
  }

  // update an offer
  update(offer: Offer) {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + this.authService.getToken
    });

    return new Observable<Offer>(observer => {
      this.httpClient.put(this.endpointURL + '/' + offer.offer_id, offer, { headers }).subscribe({
        next: (data: any) => {
          const offer = new Offer();
          offer.loadfromJson(data);
          observer.next(offer);
          observer.complete();
        },
        error: (error) => {
          observer.error(error);
          observer.complete();
        }
      });
    });
  }

  // add an offer
  add(offer: Offer) {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + this.authService.getToken
    });

    return new Observable<Offer>(observer => {
      this.httpClient.post(this.endpointURL, offer, { headers }).subscribe({
        next: (data: any) => {
          const offer = new Offer();
          offer.loadfromJson(data);
          observer.next(offer);
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