import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Offer, OfferInCart } from '../../models/offer.model';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-offer',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './offer.component.html',
  styleUrls: ['../../../scss/components/offer.scss'],
})

export class OfferComponent {
  @Input() offer!: Offer;
  @Output() selected = new EventEmitter<OfferInCart>();

  // Méthode pour choisir l'offre et l'ajouter au panier
  choose() {
    const item = new OfferInCart(this.offer, 1);
    item.quantity = 1; // Par défaut, la quantité est 1
    this.selected.emit(item); // Émet l'objet OfferInCart avec la quantité
  }

  constructor() {
    console.warn('🔥 OfferComponent constructor called');
  }

  ngOnInit() {
    console.warn('🧪 OfferComponent ngOnInit triggered');
  }
}