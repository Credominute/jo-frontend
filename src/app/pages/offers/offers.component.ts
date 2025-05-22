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

  addChoice(choice: OfferInCart): void {
    // Vérifier si l'offre est déjà dans le panier
    let index = this.itemsArray.findIndex(item => item.title === choice.title);
  
    if (index === -1) {
      // Si l'offre n'est pas déjà dans le panier, on l'ajoute
      this.itemsArray = [choice];  // Remplacer tout le panier avec la nouvelle offre
    } else {
      // Si l'offre est déjà dans le panier, on la remplace avec la nouvelle (ou rien à faire si c'est déjà la même)
      this.itemsArray[index] = choice;  // Remplacer l'offre existante par la nouvelle
    }
  
    // Mettre à jour le localStorage
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
