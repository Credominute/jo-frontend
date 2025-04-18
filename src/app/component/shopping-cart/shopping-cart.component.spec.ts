import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ShoppingCartComponent } from './shopping-cart.component';

describe('ShoppingCartComponent', () => {
  let component: ShoppingCartComponent;
  let fixture: ComponentFixture<ShoppingCartComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ShoppingCartComponent]  // Importer le composant ShoppingCart
    })
    .compileComponents();

    fixture = TestBed.createComponent(ShoppingCartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should calculate the total price correctly', () => {
    component.items = [
      { offer: { price: 15, nb_people: 1, title: 'Offer A' }, quantity: 2 },  // 30
      { offer: { price: 25, nb_people: 3, title: 'Offer B' }, quantity: 1 }   // 25
    ];
    fixture.detectChanges();
    expect(component.totalPrice).toBe(55); // 30 + 25
  });

  it('should calculate the total places correctly for single, duo, and familial offers', () => {
    component.items = [
      { offer: { price: 15, nb_people: 1, title: 'Offer A' }, quantity: 2 },  // 2 places
      { offer: { price: 25, nb_people: 3, title: 'Offer B' }, quantity: 1 }   // 3 places
    ];
    fixture.detectChanges();
    expect(component.totalPlaces).toBe(5); // 2 + 3
  });
});
