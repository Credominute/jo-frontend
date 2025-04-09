import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShoppingCartComponent } from './shopping-cart.component';

describe('ShoppingCartComponent', () => {
  let component: ShoppingCartComponent;
  let fixture: ComponentFixture<ShoppingCartComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ShoppingCartComponent]
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
    // Préparer des données d'entrée en incluant les propriétés manquantes
    const mockItems = [
      { 
        offer: { price: 10, nb_people: 1, title: 'Offer 1' }, 
        quantity: 2, 
        addItemQtyStorage: jasmine.createSpy(),
        removeItemQtyStorage: jasmine.createSpy()
      },
      { 
        offer: { price: 20, nb_people: 2, title: 'Offer 2' }, 
        quantity: 1, 
        addItemQtyStorage: jasmine.createSpy(),
        removeItemQtyStorage: jasmine.createSpy()
      }
    ];
  
    // Assigner les données à l'Input du composant
    component.itemsArray = mockItems;
  
    // Détecter les changements
    fixture.detectChanges();
  
    // Vérifier que le total est bien calculé
    expect(component.total()).toBe(40);  // (10*2) + (20*1) = 40
  });
  
});
