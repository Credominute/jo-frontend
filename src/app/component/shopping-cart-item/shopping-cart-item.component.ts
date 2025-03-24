import { FormsModule } from '@angular/forms';
import { Component, EventEmitter, Input, Output} from '@angular/core';
import { ShoppingCartItem } from '../../models/shoppingCartItem.model';
import { CommonModule, CurrencyPipe } from '@angular/common';

@Component({
  selector: 'app-shopping-cart-item',
  standalone: true,
  imports: [CurrencyPipe, FormsModule, CommonModule],
  templateUrl: './shopping-cart-item.component.html',
  styleUrl: '/src/scss/components/shopping-cart-item.scss'
})

export class ShoppingCartItemComponent {

  @Input() item!: ShoppingCartItem;
  @Input() mode: string = 'write';
  @Output() removeItemClicked = new EventEmitter();

  increaseQuantity() {
    this.item.quantity++;
    this.item.addItemQtyStorage(1);
  }

  decreaseQuantity() {
    this.item.quantity--;
    
    if(this.item.quantity == 0) {
      this.removeItem();
    }

    this.item.removeItemQtyStorage(1);
  }

  removeItem() {
    this.removeItemClicked.emit();
  }
  
}
