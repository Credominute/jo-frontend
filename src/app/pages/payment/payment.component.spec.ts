import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule,  HttpTestingController } from '@angular/common/http/testing';
import { PaymentComponent } from './payment.component';
import { AuthService } from '../../services/authenticate/auth.service'; 
import { OrderService } from '../../services/order/order.service'; 
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ModalService } from '../../services/modal/modal.service';
import { of } from 'rxjs';

const mockModalService = {
  open: jasmine.createSpy('open')
};

describe('PaymentComponent', () => {
  let component: PaymentComponent;
  let fixture: ComponentFixture<PaymentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, PaymentComponent], 
      providers: [
        { provide: ModalService, useValue: mockModalService }, // 👈 Mock
        OrderService,
        AuthService
      ],
      schemas: [NO_ERRORS_SCHEMA], // Pour éviter les erreurs sur les composants inconnus
    })
    .compileComponents();

    fixture = TestBed.createComponent(PaymentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should create payment form with valid inputs', () => {
    // Saisie des valeurs dans le formulaire
    component.cardNumberFC.setValue('1234567812345678');
    component.expiryDateFC.setValue('12/25');
    component.cvvFC.setValue('123');
    component.nameFC.setValue('John Doe');
  
    // Vérifie que le formulaire est valide
    expect(component.paymentForm.valid).toBeTrue();
  });

  it('should call OrderService.create with correct parameters when form is valid', () => {
    // Mock de la réponse du service
    const mockOrderService = TestBed.inject(OrderService);
    spyOn(mockOrderService, 'create').and.returnValue(of(true)); // Retourner un Observable<boolean> avec `true`
  
    // Configuration du formulaire avec des valeurs valides
    component.cardNumberFC.setValue('1234567812345678');
    component.expiryDateFC.setValue('12/25');
    component.cvvFC.setValue('123');
    component.nameFC.setValue('John Doe');
  
    // Simulation d'un élément de panier avec les propriétés manquantes
    const mockCartItem = {
      offer: { price: 10, nb_people: 2, title: 'Mock Offer' },
      quantity: 1,
      addItemQtyStorage: jasmine.createSpy('addItemQtyStorage'), // Ajout d'une méthode mockée
      removeItemQtyStorage: jasmine.createSpy('removeItemQtyStorage') // Ajout d'une méthode mockée
    };
  
    // Assigner l'élément mocké à `itemsArray` et le stocker dans localStorage
    component.itemsArray = [mockCartItem];
    localStorage.setItem('cart', JSON.stringify(component.itemsArray));
  
    // Appel de la méthode pay()
    component.pay();
  
    // Vérification que create() a bien été appelé avec les bons paramètres
    expect(mockOrderService.create).toHaveBeenCalledWith({
      cart: [{ offer_name: 'Mock Offer', quantity: 1 }],
      payment: {
        card_number: '1234567812345678',
        card_expiry: '12/25',
        card_cvc: '123',
        mount: 10
      },
      nbPeople: 2
    });
  });
});