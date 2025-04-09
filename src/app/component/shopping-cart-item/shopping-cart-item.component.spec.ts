import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ShoppingCartItemComponent } from './shopping-cart-item.component';
import { ShoppingCartItem } from '../../models/shoppingCartItem.model';

describe('ShoppingCartItemComponent', () => {
  let component: ShoppingCartItemComponent;
  let fixture: ComponentFixture<ShoppingCartItemComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ShoppingCartItemComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ShoppingCartItemComponent);
    component = fixture.componentInstance;

    
    // Ajout de données pour éviter l'erreur `undefined` selon modèle d'offre
    component.item = {
      offer: { id: 1, title: 'Test Offer', price: 99.99, nb_people: 2},
      quantity: 1,
      addItemQtyStorage: (qty: number) => {},
      removeItemQtyStorage: (qty: number) => {}
    } as ShoppingCartItem;

    fixture.detectChanges();
  });

  it('should increase the quantity', () => {
    // Spy sur les méthodes addItemQtyStorage et removeItemQtyStorage
    spyOn(component.item, 'addItemQtyStorage');
  
    const initialQuantity = component.item.quantity;
    component.increaseQuantity();
    
    // Vérifier que la quantité a été augmentée
    expect(component.item.quantity).toBe(initialQuantity + 1);
    // Vérifier que la méthode addItemQtyStorage a été appelée avec 1
    expect(component.item.addItemQtyStorage).toHaveBeenCalledWith(1);
  });
  
  it('should decrease the quantity', () => {
    // Spy sur les méthodes addItemQtyStorage et removeItemQtyStorage
    spyOn(component.item, 'removeItemQtyStorage');
  
    const initialQuantity = component.item.quantity;
    component.decreaseQuantity();
    
    // Vérifier que la quantité a été diminuée
    expect(component.item.quantity).toBe(initialQuantity - 1);
    // Vérifier que la méthode removeItemQtyStorage a été appelée avec 1
    expect(component.item.removeItemQtyStorage).toHaveBeenCalledWith(1);
  });
  
  it('should remove the item when quantity reaches 0', () => {
    // Spy sur la méthode removeItem
    spyOn(component, 'removeItem');
  
    // Réinitialiser la quantité à 1 avant la diminution
    component.item.quantity = 1;
    component.decreaseQuantity();
    
    // Vérifier que la méthode removeItem a été appelée lorsque la quantité atteint 0
    expect(component.removeItem).toHaveBeenCalled();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});