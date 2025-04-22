import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, ReactiveFormsModule, ValidationErrors, Validators } from '@angular/forms';
import { ShoppingCartComponent } from "../../component/shopping-cart/shopping-cart.component";
import { TicketingService } from '../../services/ticketing/ticketing.service';
import { Router } from '@angular/router';
import { AuthService } from '../../services/authenticate/auth.service';
import { ModalService } from '../../services/modal/modal.service';
import { OfferInCart } from '../../models/offer.model';  // Assurez-vous d'importer OfferInCart

@Component({
  selector: 'app-payment',
  standalone: true,
  templateUrl: './payment.component.html',
  styleUrls: ['../../../scss/pages/payment.scss'],
  imports: [ReactiveFormsModule, CommonModule, ShoppingCartComponent]
})
export class PaymentComponent implements OnInit {
  paymentForm: FormGroup;
  itemsArray: OfferInCart[] = [];  // Remplacer ShoppingCartItem par OfferInCart
  modeCart = 'read';

  constructor(
    private readonly formBuilder: FormBuilder,
    private readonly ticketingService: TicketingService,
    private readonly router: Router,
    private readonly authService: AuthService,
    protected modalService: ModalService
  ) {
    // create the form
    this.paymentForm = this.formBuilder.group({
      cardNumber: ['', [Validators.required, Validators.pattern('^[0-9]{16}$')]],
      expiryDate: ['', [Validators.required, this.expiryDateValidator, Validators.pattern('^[0-9]{2}/[0-9]{2}$')]],
      cvv: ['', [Validators.required, Validators.pattern('^[0-9]{3}$')]],
      name: ['', [Validators.required, Validators.pattern('^[a-zA-Z ]{2,}$')]],
    });
  }

  ngOnInit(): void {
    // Charger le panier depuis localStorage si présent
    const cart = localStorage.getItem('cart');
    this.itemsArray = (cart !== null) ? JSON.parse(cart) : [];

    // Si l'utilisateur n'est pas authentifié, redirection vers la page de connexion
    if (!this.authService.getIsAuthenticated) {
      alert("Vous n'êtes pas authentifié");
      this.router.navigate(['/']);
      this.modalService.open('login');
    } else if (this.itemsArray.length === 0) {
      // Si le panier est vide, redirection vers la page des offres
      alert("Votre panier est vide. Vous allez être redirigé vers la page des offres.");
      this.router.navigate(['/offers']);
    }
  }

  get cardNumberFC() {
    return this.paymentForm.get('cardNumber') as FormControl<string>;
  }

  get expiryDateFC() {
    return this.paymentForm.get('expiryDate') as FormControl<string>;
  }

  get cvvFC() {
    return this.paymentForm.get('cvv') as FormControl<string>;
  }

  get nameFC() {
    return this.paymentForm.get('name') as FormControl<string>;
  }

  // Validation pour la date d'expiration
  expiryDateValidator(control: AbstractControl): ValidationErrors | null {
    const monthExp = parseInt(control.value.split('/')[0]);
    const yearExp = parseInt(control.value.split('/')[1]);
    const currentMonth = new Date().getMonth() + 1;
    const currentYear = new Date().getFullYear() % 100;
    return (yearExp > currentYear || (yearExp === currentYear && monthExp >= currentMonth)) ? null : { expiryDate: true };
  }

  // Fonction de paiement
  pay() {
    if (this.paymentForm.valid) {
      // Calcul du montant total et du nombre de personnes
      const mountOrder = this.itemsArray.reduce((total, item) => total + (item.price * item.quantity), 0);
      const nbPeopleOrder = this.itemsArray.reduce((places, item) => places + (item.nb_people * item.quantity), 0);

      // Préparation des informations de paiement
      const payment = {
        "card_number": this.cardNumberFC.value,
        "card_expiry": this.expiryDateFC.value,
        "card_cvc": this.cvvFC.value,
        "mount": mountOrder
      };

      // Mappage des éléments du panier avec toutes les informations nécessaires
      const cartOrder = this.itemsArray.map(item => {
        return new OfferInCart(item, item.quantity); // Crée un nouvel OfferInCart avec les informations de l'Offer
      });

      // Envoi des données au backend
      this.ticketingService.createOrder({ cart: cartOrder, payment: payment, nbPeople: nbPeopleOrder }).subscribe({
        next: (data: any) => {
          // Vider le panier après la commande
          localStorage.removeItem('cart');

          alert('Le paiement a bien été effectué. Vous allez être redirigé vers votre espace pour accéder à votre billet.');
          this.router.navigate(['/orders']);
        },
        error: (error) => {
          console.log('Payment failed');
          console.error(error);
        }
      });
    }
  }
}
