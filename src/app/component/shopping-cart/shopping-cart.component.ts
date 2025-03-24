import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ShoppingCartItemComponent } from "../shopping-cart-item/shopping-cart-item.component";
import { CurrencyPipe, CommonModule } from '@angular/common';
import { ShoppingCartItem } from '../../models/shoppingCartItem.model';

@Component({
    selector: 'app-shopping-cart',
    standalone: true,
    templateUrl: './shopping-cart.component.html',
    styleUrl: '/src/scss/components/shopping-cart.scss',
    imports: [ShoppingCartItemComponent, CurrencyPipe, CommonModule]
})
export class ShoppingCartComponent {

  @Input() itemsArray: ShoppingCartItem[] = [];
  @Input() mode: string = 'write';
  @Output() removeItemEvent = new EventEmitter<ShoppingCartItem>();

  removeItem(item: ShoppingCartItem) {
    this.removeItemEvent.emit(item);
  }

  total() {
    return this.itemsArray.reduce((total, item) => total + (item.offer.price * item.quantity), 0);
  }

  places() {
    return this.itemsArray.reduce((places, item) => places + (item.offer.nb_people * item.quantity), 0);
  }
}

