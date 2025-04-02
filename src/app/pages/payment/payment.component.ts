import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, ReactiveFormsModule, ValidationErrors, Validators } from '@angular/forms';
import { ShoppingCartItem } from '../../models/shoppingCartItem.model';
import { ShoppingCartComponent } from "../../component/shopping-cart/shopping-cart.component";
import { OrderService } from '../../services/order/order.service';
import { Router } from '@angular/router';
import { AuthService } from '../../services/authenticate/auth.service';
import { ModalService } from '../../services/modal/modal.service';

@Component({
  selector: 'app-payment',
  standalone: true,
  templateUrl: './payment.component.html',
  styleUrls: ['../../../scss/pages/payment.scss'],
  imports: [ReactiveFormsModule, CommonModule, ShoppingCartComponent]
})
export class PaymentComponent {
  paymentForm: FormGroup;

  itemsArray: ShoppingCartItem[] = [];
  modeCart = 'read';

  constructor(private formBuilder: FormBuilder,
              private orderService: OrderService,
              private router: Router,
              private authService: AuthService,
              protected modalService: ModalService
            )
  {
    // create the form
    this.paymentForm = this.formBuilder.group({
      cardNumber: ['', [Validators.required, Validators.pattern('^[0-9]{16}$')]],
      expiryDate: ['', [Validators.required, this.expiryDateValidator, Validators.pattern('^[0-9]{2}/[0-9]{2}$')]],
      cvv: ['', [Validators.required, Validators.pattern('^[0-9]{3}$')]],
      name: ['', [Validators.required, Validators.pattern('^[a-zA-Z ]{2,}$')]],
    });

    let cart = localStorage.getItem('cart');
    this.itemsArray = (cart !== null) ? JSON.parse(cart) : [];

    // when the user is redirected from the login page, we redirect him to the payment page
    if (localStorage.getItem('redirect') === '/payment') {
      localStorage.removeItem('redirect');
    }
  }

  ngOnInit(): void {
    // If the user is not authenticated, we redirect him to the login modal
    if (!this.authService.getIsAuthenticated) {
      alert("You are not authenticated");
      this.router.navigate(['/']);
      this.modalService.open('login');
    // If the cart is empty, we redirect him to the offers page
    } else if (this.itemsArray.length === 0) {
      alert("Votre panier est vide. Vous allez être redirigé vars la page des offres.");
      this.router.navigate(['/offers']);
    }
  }

  get cardNumberFC() {
    return this.paymentForm.get('cardNumber') as FormControl<string>;
  }

  get expiryDateFC() {
    return this.paymentForm.get('expiryDate') as FormControl<string>;;
  }

  get cvvFC() {
    return this.paymentForm.get('cvv') as FormControl<string>;
  }

  get nameFC() {
    return this.paymentForm.get('name') as FormControl<string>;
  }

  expiryDateValidator(control: AbstractControl): ValidationErrors | null {
    const monthExp = parseInt(control.value.split('/')[0]);
    const yearExp = parseInt(control.value.split('/')[1]);
    const currentMonth = new Date().getMonth() + 1;
    const currentYear = new Date().getFullYear() % 100;
    return (yearExp > currentYear || (yearExp === currentYear && monthExp >= currentMonth)) ? null : { expiryDate: true };
  }

  pay() {
    if (this.paymentForm.valid) {
      // prepare the datas to send to the server
      // for the moment, I send the datas about the card in the server in clear, but it's not secure
      const mountOrder = this.itemsArray.reduce((total, item) => total + (item.offer.price * item.quantity), 0);
      const nbPeopleOrder = this.itemsArray.reduce((places, item) => places + (item.offer.nb_people * item.quantity), 0);
      const payment = {
        "card_number": this.cardNumberFC.value,
        "card_expiry": this.expiryDateFC.value,
        "card_cvc": this.cvvFC.value,
        "mount": mountOrder
      };

      const cartOrder = this.itemsArray.map(item => {
        return {
          offer_name: item.offer.title,
          quantity: item.quantity
        }
      });

      // send the datas to the server
      this.orderService.create({ cart: cartOrder, payment: payment, nbPeople: nbPeopleOrder }).subscribe({
        next: (data: any) => {
          // empty the cart
          localStorage.removeItem('cart');

          alert('Le paiment a bien été effectué. Vous allez être redirigé vers votre espace pour accéder à votre billet.');
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
