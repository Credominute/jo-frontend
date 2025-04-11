import { Component, EventEmitter, Input, Output } from '@angular/core';
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

  @Input() offer: Offer = new Offer();
  @Input() quantity: number = 1;
  @Output() choiceEvent = new EventEmitter<ShoppingCartItem>();
  @Input() selected: boolean = false; 

  // Admin management
  @Input() isAdmin: boolean = false;
  @Input() mode = 'view';       // view, edit, add
  
  changeOffer(valueStr: string) {
    const value = parseInt(valueStr, 10);
    if (!isNaN(value) && value > 0) {
      this.quantity = value;
    }
  }

  downOffer() {
    if(this.quantity > 1) {
      this.quantity -= 1;
    }
  }

  upOffer() {
    this.quantity += 1;
  }

  choiceOffer() {
    this.choiceEvent.emit(new ShoppingCartItem(new OfferInCart(this.offer), this.quantity));
    this.quantity = 1;
  }

  scroll(){
    document.getElementById("shoppingcart")?.scrollIntoView({behavior: "smooth"});
  }

  // Admin TODO: implémenter l'édition d'une offre
  editOffer() {
    return; }
  saveOffer() {
    return; }
  updateOffer() {
    return; }
  addOffer() {
    return; }
  hideOffer() {
    return; }
  visibleOffer() {
    return; }
}
