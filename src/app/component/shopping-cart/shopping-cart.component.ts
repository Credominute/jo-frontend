import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule, CurrencyPipe } from '@angular/common';

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
  @Input() itemsArray: any[] = [];

  @Output() removeItemEvent = new EventEmitter<any>(); 

  // Propriété items pour gérer les éléments du panier
  items = [
    { offer: { price: 10, nb_people: 1, title: 'Offer 1' }, quantity: 2 },
    { offer: { price: 20, nb_people: 2, title: 'Offer 2' }, quantity: 1 }
  ];

  // Mode d'affichage (par exemple : 'read', 'edit')
  mode: string = 'read';

  // Calcul du total des prix
  get totalPrice(): number {
    return this.items.reduce((total, item) => total + item.offer.price * item.quantity, 0);
  }

  // Calcul du nombre total de places
  get totalPlaces(): number {
    return this.items.reduce((total, item) => total + item.quantity * item.offer.nb_people, 0);
  }

  // Méthode pour supprimer un item du panier
  removeItem(itemToRemove: any): void {
    this.items = this.items.filter(item => item !== itemToRemove);
    this.removeItemEvent.emit(itemToRemove);
  }
}