import { Component, OnInit} from '@angular/core';
import { CommonModule } from '@angular/common';
import { Offer } from '../../models/offer.model';
import { OffersService } from '../../services/offers/offers.service';
import { ShoppingCartItem } from '../../models/shoppingCartItem.model';
import { ModalService } from '../../services/modal/modal.service';
import { Router } from '@angular/router';
import { OfferComponent } from '../../component/offer/offer.component';
import { ShoppingCartComponent } from '../../component/shopping-cart/shopping-cart.component';

@Component({
  selector: 'app-offers-page',
  standalone: true,
  templateUrl: './offers.component.html',
  styleUrls: ['../../../scss/pages/offers.scss'],
  imports: [CommonModule, OfferComponent, ShoppingCartComponent]
})

export class OffersPageComponent implements OnInit{
  offersArray: Offer[] = [];
  itemsArray: ShoppingCartItem[] = [];
  
  constructor(private offersService: OffersService, 
              protected modalService: ModalService, 
              protected router: Router) {
  }

  get modalServiceGetter() {
    return this.modalService;
  }

  ngOnInit(): void {
    this.offersService.getAllVisible().subscribe({
      next: (offers: Offer[]) => {
        this.offersArray = offers;
      },
      error: (error) => {
        console.error(error);
      }
    });

    this.loadCart();
  }


  addChoice(choice: ShoppingCartItem) {
    let index = this.itemsArray.findIndex(item => item.offer.title === choice.offer.title);
    if(index !== -1) {
      // If the choice is already in the cart, increment its quantity
      this.itemsArray[index].quantity += choice.quantity;
    } else {
      this.itemsArray.push(choice);
    }
    localStorage.setItem('cart', JSON.stringify(this.itemsArray));
  }

  removeItem($event: ShoppingCartItem) {
    this.itemsArray = this.itemsArray.filter(i => i.offer.title !== $event.offer.title);  // Comparaison par titre de l'offre
    localStorage.setItem('cart', JSON.stringify(this.itemsArray));
  }
  /*removeItem($event: ShoppingCartItem) {
    this.itemsArray = this.itemsArray.filter(i => i !== $event);
    localStorage.setItem('cart', JSON.stringify(this.itemsArray));
  }*/

  emptyCart() {
    this.itemsArray = [];
  }

  checkout() {
    // waitingto manage a good authentification, for now I just check if the token is present
    if(localStorage.getItem('access_token') === null) {
      // Save a variable to redirect to the payment page after login
      // not the best practice but it's just to continue the project
      localStorage.setItem('redirect', '/payment');
      
      this.modalService.open('login');
    }
    else {
      // Redirect to the payment page
      this.router.navigate(['/payment']) ;
    }
  }

  loadCart() {
    let cart = localStorage.getItem('cart');
    if(cart !== null) {
      this.itemsArray = JSON.parse(cart);
    }
    else {
      this.itemsArray = [];
    }
  }
}
