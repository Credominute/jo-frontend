import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Offer, OfferInCart } from '../../models/offer.model';
import { TicketingService } from '../../services/ticketing/ticketing.service';
import { ModalService } from '../../services/modal/modal.service';
import { Router } from '@angular/router';
import { OfferComponent } from '../../component/offer/offer.component';
import { ShoppingCartComponent } from '../../component/shopping-cart/shopping-cart.component';

@Component({
  selector: 'app-offers',
  standalone: true,
  templateUrl: './offers.component.html',
  styleUrls: ['../../../scss/pages/offers.scss'],
  imports: [CommonModule, OfferComponent, ShoppingCartComponent],
})
export class OffersPageComponent implements OnInit {
  selectedOfferTitle: string | null = null;

  offers: Offer[] = [];
  itemsArray: OfferInCart[] = []; 

  constructor(
    private readonly ticketingService: TicketingService,
    protected modalService: ModalService,
    protected router: Router
  ) {}

  get cartItems(): OfferInCart[] { 
    return this.itemsArray;
  }

  get modalServiceGetter() {
    return this.modalService;
  }

  ngOnInit(): void {
    this.ticketingService.getAllVisible().subscribe({
      next: (offers: Offer[]) => {
        this.offers = offers;
      },
      error: (error) => {
        console.error(error);
      }
    });

    this.loadCart();
  }

    /*Test for bugfix(offers)
    ngOnInit(): void {
      // Créer les offres de manière dynamique et les charger avec loadfromJson
      this.offers = [{
        offer_id: 999,
        title: 'Offre de test',
        description: 'Ceci est une offre de test pour vérifier l’affichage',
        price: 42.0,
        nb_people: 2,
        visible: false,
        image_url: 'assets/images/test.jpg',
        ticket_type: 'single'
      }].map(json => {
        const offer = new Offer();  // Créer une nouvelle instance de l'Offer
        offer.loadfromJson(json);  // Charger les données JSON dans l'instance
        return offer;
      });
      this.loadCart(); 
    }*/

  addChoice(choice: OfferInCart): void {
    this.selectedOfferTitle = choice.title;  

    let index = this.itemsArray.findIndex(item => item.title === choice.title);  
    if (index !== -1) {
      this.itemsArray[index].quantity += choice.quantity;
    } else {
      this.itemsArray.push(choice);
    }
    localStorage.setItem('cart', JSON.stringify(this.itemsArray));
  }

  removeItem(item: OfferInCart): void {
    this.itemsArray = this.itemsArray.filter(i => i.title !== item.title);  
    localStorage.setItem('cart', JSON.stringify(this.itemsArray));
  }

  emptyCart(): void {
    this.itemsArray = [];
    localStorage.setItem('cart', JSON.stringify(this.itemsArray));
  }

  checkout(): void {
    if (localStorage.getItem('access_token') === null) {
      localStorage.setItem('redirect', '/payment');
      this.modalService.open('login');
    } else {
      this.router.navigate(['/payment']);
    }
  }

  loadCart(): void {
    const cart = localStorage.getItem('cart');
    this.itemsArray = cart ? JSON.parse(cart) : [];
  }
}
