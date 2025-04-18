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
  
    // Simuler un panier avec un élément de type OfferInCart
    component.itemsArray = [{
      offer_id: 1,  // ID de l'offre
      title: 'Offre 1',
      description: 'Description de l\'offre 1',
      image_url: 'url_de_limage',
      price: 100,
      quantity: 2,
      nb_people: 1,
      visible: true,  // Ajout de la propriété 'visible'
      loadfromJson: function(json: any) {  // Ajout de la méthode 'loadfromJson'
        this.offer_id = json.offer_id;
        this.title = json.title;
        this.description = json.description;
        this.image_url = json.image_url;
        this.price = json.price;
        this.quantity = json.quantity;
        this.nb_people = json.nb_people;
        this.visible = json.visible;
      }
    }];  // Exemple d'offre dans le panier
  
    // Appeler la méthode pay()
    component.pay();
  
    // Vérifier que createOrder a été appelé avec les bonnes données
    expect(mockTicketingService.createOrder).toHaveBeenCalledWith({
      cart: jasmine.any(Array),  // Vérifie que le panier est passé comme tableau
      payment: {
        card_number: '1234567812345678',
        card_expiry: '12/25',
        card_cvc: '123',
        mount: 200  // Montant total : 100 * 2
      },
      nbPeople: 2  // Nombre de personnes : 1 * 2 (car il y a 2 éléments dans le panier)
    });
  
    // Vérifier que la redirection a eu lieu après la commande
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/orders']);
  });
});