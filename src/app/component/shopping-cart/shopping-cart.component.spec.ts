import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ShoppingCartComponent } from './shopping-cart.component';

describe('ShoppingCartComponent', () => {
  let component: ShoppingCartComponent;
  let fixture: ComponentFixture<ShoppingCartComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ShoppingCartComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(ShoppingCartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should calculate the total price correctly', () => {
    component.itemsArray = [
      {
        offer_id: 1,
        price: 15,
        nb_people: 1,
        title: 'Offer A',
        quantity: 2,
        description: 'Description for Offer A',
        image_url: 'https://example.com/image1.jpg',
        visible: true,
        ticket_type: 'single',
        loadfromJson: () => {}
      },
      {
        offer_id: 2,
        price: 25,
        nb_people: 3,
        title: 'Offer B',
        quantity: 1,
        description: 'Description for Offer B',
        image_url: 'https://example.com/image2.jpg',
        visible: true,
        ticket_type: 'familial',
        loadfromJson: () => {}
      }
    ];
    fixture.detectChanges();
    expect(component.totalPrice).toBe(55); // 30 + 25
  });

  it('should calculate the total places correctly for single, duo, and familial offers', () => {
    component.itemsArray = [
      {
        offer_id: 1,
        price: 15,
        nb_people: 1,
        title: 'Offer A',
        quantity: 2,
        description: 'Description for Offer A',
        image_url: 'https://example.com/image1.jpg',
        visible: true,
        ticket_type: 'single',
        loadfromJson: () => {}
      },
      {
        offer_id: 2,
        price: 25,
        nb_people: 3,
        title: 'Offer B',
        quantity: 1,
        description: 'Description for Offer B',
        image_url: 'https://example.com/image2.jpg',
        visible: true,
        ticket_type: 'familial',
        loadfromJson: () => {}
      }
    ];
    fixture.detectChanges();
    expect(component.totalPlaces).toBe(5); // 2 + 3
  });
});

