import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Offer, OfferInCart } from '../../models/offer.model';
import { ShoppingCartItem } from '../../models/shoppingCartItem.model';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-offer',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './offer.component.html',
  styleUrls: ['../../../scss/components/offer.scss']
})
export class OfferComponent {
  @Input() offer!: Offer;
  @Output() selected = new EventEmitter<ShoppingCartItem>();

  choose() {
    const item = new ShoppingCartItem(new OfferInCart(this.offer), 1);
    this.selected.emit(item);
  }
}

  /* Optionnel, si on veut l’invoquer après l’ajout au panier (dans choose()).
  scroll(){
    document.getElementById("shoppingcart")?.scrollIntoView({behavior: "smooth"});
  }*/