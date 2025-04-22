import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { OfferInCart } from '../../models/offer.model';

@Component({
  selector: 'app-shopping-cart',
  standalone: true,
  templateUrl: './shopping-cart.component.html',
  styleUrls: ['../../../scss/components/shopping-cart.scss'],
  imports: [CommonModule, CurrencyPipe]
})
export class ShoppingCartComponent {
  @Input() offerType: 'single' | 'duo' | 'familial' = 'single';
  @Input() quantity: number = 1;
  @Input() pricePerOffer: number = 10;
  @Input() itemsArray: OfferInCart[] = [];

  @Output() removeItemEvent = new EventEmitter<any>(); 

  // Mode d'affichage (par exemple : 'read', 'edit')
  mode: string = 'read';

  get totalPrice(): number {
    return this.itemsArray.reduce((total, item) => total + item.price * item.quantity, 0);
  }

  get totalPlaces(): number {
    return this.itemsArray.reduce((total, item) => total + item.nb_people * item.quantity, 0);
  }

  removeItem(itemToRemove: OfferInCart): void {
    this.removeItemEvent.emit(itemToRemove);
  }
}