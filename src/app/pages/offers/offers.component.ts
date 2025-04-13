import { Component, OnInit } from '@angular/core';
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
export class OffersPageComponent implements OnInit {
  selectedOfferTitle: string | null = null;

  offers: Offer[] = [];
  itemsArray: ShoppingCartItem[] = [];

  constructor(
    private readonly offersService: OffersService,
    protected modalService: ModalService,
    protected router: Router
  ) {}

  // 🔄 Getter public pour usage dans le HTML
  get cartItems(): ShoppingCartItem[] {
    return this.itemsArray;
  }

  get modalServiceGetter() {
    return this.modalService;
  }

  ngOnInit(): void {
    this.offersService.getAllVisible().subscribe({
      next: (offers: Offer[]) => {
        this.offers = offers;
      },
      error: (error) => {
        console.error(error);
      }
    });

    this.loadCart();
  }

  addChoice(choice: ShoppingCartItem): void {
    this.selectedOfferTitle = choice.offer.title;

    let index = this.itemsArray.findIndex(item => item.offer.title === choice.offer.title);
    if (index !== -1) {
      this.itemsArray[index].quantity += choice.quantity;
    } else {
      this.itemsArray.push(choice);
    }
    localStorage.setItem('cart', JSON.stringify(this.itemsArray));
  }

  removeItem(item: ShoppingCartItem): void {
    this.itemsArray = this.itemsArray.filter(i => i.offer.title !== item.offer.title);
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