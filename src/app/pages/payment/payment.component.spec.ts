import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PaymentComponent } from './payment.component';
import { TicketingService } from '../../services/ticketing/ticketing.service';
import { AuthService } from '../../services/authenticate/auth.service';
import { ModalService } from '../../services/modal/modal.service';
import { Router } from '@angular/router';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ShoppingCartComponent } from '../../component/shopping-cart/shopping-cart.component';
import { of } from 'rxjs';
import { Offer, OfferInCart } from '../../models/offer.model';

const mockTicketingService = {
  createOrder: jasmine.createSpy('createOrder').and.returnValue(of(true))
};

const mockAuthService = {
  get getIsAuthenticated() {
    return true;
  }
};

const mockRouter = {
  navigate: jasmine.createSpy('navigate')
};

const mockModalService = {
  open: jasmine.createSpy('open')
};

describe('PaymentComponent', () => {
  let component: PaymentComponent;
  let fixture: ComponentFixture<PaymentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PaymentComponent, ShoppingCartComponent, HttpClientTestingModule],
      providers: [
        { provide: TicketingService, useValue: mockTicketingService },
        { provide: AuthService, useValue: mockAuthService },
        { provide: Router, useValue: mockRouter },
        { provide: ModalService, useValue: mockModalService }
      ],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();

    fixture = TestBed.createComponent(PaymentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the PaymentComponent', () => {
    expect(component).toBeTruthy();
  });

  it('should have a valid form when all fields are filled', () => {
    // Remplir le formulaire avec des données valides
    component.paymentForm.setValue({
      cardNumber: '1234567812345678',
      expiryDate: '12/25',
      cvv: '123',
      name: 'John Doe'
    });

    // Vérifie que le formulaire est valide
    expect(component.paymentForm.valid).toBeTruthy();
  });

  it('should call createOrder when the form is valid', () => {
    // Remplir le formulaire avec des données valides
    component.paymentForm.setValue({
      cardNumber: '1234567812345678',
      expiryDate: '12/25',
      cvv: '123',
      name: 'John Doe'
    });
  
    // Création explicite d'une instance valide de OfferInCart
    const offer = new Offer();
    offer.offer_id = 1;
    offer.title = 'Offre 1';
    offer.description = 'Description de l\'offre 1';
    offer.image_url = 'url_de_limage';
    offer.price = 100;
    offer.nb_people = 1;
    offer.visible = true;
  
    // Création de l'instance OfferInCart avec offer et quantity
    const offerInCart = new OfferInCart(offer, 2);  // Passer l'offre et la quantité
    component.itemsArray = [offerInCart];
  
    // Appeler la méthode pay()
    component.pay();
  
    // Vérifier que createOrder a été appelé avec les bonnes données
    expect(mockTicketingService.createOrder).toHaveBeenCalledWith({
      cart: jasmine.any(Array),
      payment: {
        card_number: '1234567812345678',
        card_expiry: '12/25',
        card_cvc: '123',
        mount: 200
      },
      nbPeople: 2
    });
  
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/orders']);
  });
});