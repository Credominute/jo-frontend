import { ComponentFixture, TestBed } from '@angular/core/testing';
import { OfferComponent } from './offer.component';
import { Offer, OfferInCart } from '../../models/offer.model';
import { ShoppingCartItem } from '../../models/shoppingCartItem.model';
import { By } from '@angular/platform-browser';

describe('OfferComponent', () => {
  let component: OfferComponent;
  let fixture: ComponentFixture<OfferComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OfferComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(OfferComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with default offer and quantity', () => {
    expect(component.offer).toEqual(new Offer());
    expect(component.quantity).toBe(1);
  });

  it('should emit choiceEvent when choiceOffer is called', () => {
    const spy = spyOn(component.choiceEvent, 'emit');
  
    // Configuration initiale de l'offre et de la quantité
    component.offer = new Offer();
    component.quantity = 1;
  
    // Appel de la méthode choiceOffer
    component.choiceOffer();
  
    // Vérification que l'événement a bien été émis avec la bonne quantité
    expect(spy).toHaveBeenCalledWith(
      new ShoppingCartItem(new OfferInCart(component.offer), 1)
    );
  });

  it('should increment quantity when upOffer is called', () => {
    component.quantity = 1;
    component.upOffer();
    expect(component.quantity).toBe(2);
  });

  it('should decrement quantity when downOffer is called', () => {
    component.quantity = 2;
    component.downOffer();
    expect(component.quantity).toBe(1);
  });

  it('should not decrement quantity below 1 when downOffer is called', () => {
    component.quantity = 1;
    component.downOffer();
    expect(component.quantity).toBe(1); // Prevent going below 1
  });

  it('should update quantity when changeOffer is called with a valid number', () => {
    const newQuantity = '5';
    component.changeOffer(newQuantity);
    expect(component.quantity).toBe(5);
  });

  it('should not update quantity when changeOffer is called with an invalid number', () => {
    // Configuration initiale de l'offre et de la quantité
    component.quantity = 1;
  
    // Appel de la méthode avec une valeur invalide
    component.changeOffer('invalid');
  
    // Vérification que la quantité n'a pas changé
    expect(component.quantity).toBe(1);
  });

  it('should call scroll() method and scroll to shopping cart element', () => {
    // Création d'un objet mock avec la méthode `scrollIntoView`
    const mockElement = {
      scrollIntoView: jasmine.createSpy('scrollIntoView')
    };
  
    // Espionner `getElementById` pour retourner l'élément mock
    spyOn(document, 'getElementById').and.returnValue(mockElement as unknown as HTMLElement);
  
    // Appel de la méthode scroll
    component.scroll();
  
    // Vérification que `scrollIntoView` a bien été appelé avec les bons arguments
    expect(mockElement.scrollIntoView).toHaveBeenCalledWith({ behavior: 'smooth' });
  });

  it('should call admin methods (editOffer, saveOffer, updateOffer, addOffer, hideOffer, visibleOffer)', () => {
    spyOn(component, 'editOffer');
    spyOn(component, 'saveOffer');
    spyOn(component, 'updateOffer');
    spyOn(component, 'addOffer');
    spyOn(component, 'hideOffer');
    spyOn(component, 'visibleOffer');

    component.editOffer();
    component.saveOffer();
    component.updateOffer();
    component.addOffer();
    component.hideOffer();
    component.visibleOffer();

    expect(component.editOffer).toHaveBeenCalled();
    expect(component.saveOffer).toHaveBeenCalled();
    expect(component.updateOffer).toHaveBeenCalled();
    expect(component.addOffer).toHaveBeenCalled();
    expect(component.hideOffer).toHaveBeenCalled();
    expect(component.visibleOffer).toHaveBeenCalled();
  });

  it('should emit choiceEvent with updated quantity', () => {
    const spy = spyOn(component.choiceEvent, 'emit');
  
    component.offer = new Offer(); // ou un mock plus riche si utile
    component.quantity = 3;
    component.choiceOffer();
  
    expect(spy).toHaveBeenCalledWith(
      new ShoppingCartItem(new OfferInCart(component.offer), 3)
    );
    expect(component.quantity).toBe(1); // Vérifie aussi que le reset se fait bien
  });

  it('should allow switching between admin modes', () => {
    component.mode = 'view';
    expect(component.mode).toBe('view');
  
    component.mode = 'edit';
    expect(component.mode).toBe('edit');
  
    component.mode = 'add';
    expect(component.mode).toBe('add');
  });
});
