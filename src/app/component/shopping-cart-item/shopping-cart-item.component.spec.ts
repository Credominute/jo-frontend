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

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
