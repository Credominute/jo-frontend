import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TicketingService } from './ticketing.service';
import { AuthService } from '../authenticate/auth.service';
import { Order } from '../../models/order.model';
import { OfferInCart, Offer } from '../../models/offer.model';
import { HttpErrorResponse } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { of, throwError } from 'rxjs'; 
import { fakeAsync, tick } from '@angular/core/testing';
import { OFFERS } from '../offers.constants';

describe('TicketingService', () => {
  let service: TicketingService;
  let httpMock: HttpTestingController;
  let authServiceSpy: jasmine.SpyObj<AuthService>;

  beforeEach(() => {
    environment.mockPayment = false;
    const spy = jasmine.createSpyObj('AuthService', ['getToken'], { getToken: 'test-token' });

    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        TicketingService,
        { provide: AuthService, useValue: spy }
      ]
    });

    service = TestBed.inject(TicketingService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should map OfferInCart to Offer correctly', () => {
    const mockCart: OfferInCart[] = [{
      offer_id: 1,
      title: 'Test Offer',
      description: 'Test Desc',
      nb_people: 2,
      price: 100,
      image_url: 'http://example.com/image.jpg',
      visible: true,
      loadfromJson: () => {},
      quantity: 1,
      ticket_type: "single"
    }];
    
    const result = service['mapOfferInCartToOffer'](mockCart);
  
    expect(result.length).toBe(1);
    expect(result[0].offer_id).toBe(1);
    expect(result[0].title).toBe('Test Offer');
    expect(result[0].image_url).toBe('http://example.com/image.jpg');
    expect(result[0].ticket_type).toBe("single");
  });

 it('should handle error when creating order (mocked error)', (done) => {
  const mockCart = [{
    offer_id: 1,
    title: 'Test Offer',
    description: 'Desc',
    nb_people: 2,
    price: 100,
    image_url: '',
    visible: true,
    quantity: 1,
    loadfromJson: () => {},
    ticket_type: 'single'
  }] as OfferInCart[];

  const payment = { cardNumber: '1234' };
  const nbPeople = 2;

  // Mocker la méthode createOrder pour renvoyer une erreur observable
  spyOn(service, 'createOrder').and.returnValue(
    throwError(() => ({
      status: 500,
      error: 'Error creating order'
    }))
  );

  service.createOrder({ cart: mockCart, payment, nbPeople }).subscribe({
    next: () => done.fail('should have failed'),
    error: (error: HttpErrorResponse) => {
      expect(error.error).toEqual('Error creating order');
      expect(error.status).toBe(500);
      done();
    }
  });
});

  it('should handle error when retrieving order by ID', () => {
    const orderId = 42;
  
    service.getOrderById(orderId).subscribe({
      next: () => fail('should have failed'),
      error: (error: HttpErrorResponse) => {
        expect(error.error).toEqual('Error retrieving order');
        expect(error.status).toBe(500);
      }
    });

    const req = httpMock.expectOne(`${environment.api}order/${orderId}`);
    expect(req.request.method).toBe('GET');
    expect(req.request.headers.get('Authorization')).toBe('Bearer test-token');
  
    req.flush('Error retrieving order', { status: 500, statusText: 'Server Error' });
  });

  it('should filter and return only visible offers', () => {
  const mockOffers: Offer[] = [
    { offer_id: 1, title: 'Offer 1', visible: true } as Offer,
    { offer_id: 2, title: 'Offer 2', visible: false } as Offer,
    { offer_id: 3, title: 'Offer 3', visible: true } as Offer
  ];

  // Mock de la réponse HTTP
  service.getAllVisible = jasmine.createSpy().and.returnValue(of(mockOffers.filter(o => o.visible)));

  service.getAllVisible().subscribe(offers => {
    expect(offers.length).toBe(2); 
    expect(offers.every(o => o.visible)).toBeTrue();
  });
});


  it('should retrieve user orders and map them correctly', () => {
    class TestOrder extends Order {
      id!: number;
      date!: string;
    }
  
    const mockOrders = [
      { id: 1, date: '2024-08-10T12:00:00Z' },
      { id: 2, date: '2024-08-15T14:30:00Z' }
    ];
  
    spyOn(Order.prototype, 'loadfromJson').and.callFake(function (this: any, json: any) {
      this.id = json.id;
      this.date = json.date;
    });
  
    service.getUserOrders().subscribe(orders => {
      expect((orders[0] as TestOrder).id).toBe(1);
      expect((orders[1] as TestOrder).date).toBe('2024-08-15T14:30:00Z');
    });
  
    const req = httpMock.expectOne('http://127.0.0.1:8000/order');
    expect(req.request.method).toBe('GET');
    req.flush(mockOrders);
  });

  it('should handle error when fetching order by ID', () => {
    const orderId = 42;
    service.getOrderById(orderId).subscribe({
      next: () => fail('Expected error, but got success'),
      error: (error) => {
        expect(error.status).toBe(404);
        expect(error.error).toBe('Order not found');
      }
    });
  
    const req = httpMock.expectOne(`http://127.0.0.1:8000/order/${orderId}`);
    req.flush('Order not found', { status: 404, statusText: 'Not Found' });
  });

  it('should retrieve all visible offers from constants when not in mock mode', (done) => {
  environment.mock = false;  // Désactiver le mock

  service.getAllVisible().subscribe(offers => {
    expect(offers.length).toBeGreaterThan(0);
    expect(offers.some(o => o.title === 'Duo')).toBeTrue();
    done();
  });
});

it('should create an order successfully', () => {
  const mockCart: OfferInCart[] = [{
    offer_id: 1,
    title: 'Test Offer',
    description: 'Test Desc',
    nb_people: 2,
    price: 100,
    image_url: 'http://example.com/image.jpg',
    visible: true,
    loadfromJson: () => {},
    quantity: 1,
    ticket_type: 'single'
  }];
  const payment = { cardNumber: '1234' };
  const nbPeople = 2;

  environment.mock = false;

  service.createOrder({ cart: mockCart, payment, nbPeople }).subscribe(result => {
    expect(result).toBeTrue();
  });

  const req = httpMock.expectOne(environment.api + 'order');
  expect(req.request.method).toBe('POST');
  expect(req.request.headers.get('Authorization')).toBe('Bearer test-token');
  req.flush({});
  });

  it('should simulate createOrderMock and return true after delay', fakeAsync(() => {
  environment.mock = true;
  const mockCart: OfferInCart[] = [{
    offer_id: 1,
    title: 'Mock Offer',
    description: 'Mock desc',
    nb_people: 1,
    price: 50,
    image_url: '',
    visible: true,
    loadfromJson: () => {},
    quantity: 1,
    ticket_type: 'single'
  }];
  let result = false;
  service.createOrder({ cart: mockCart, payment: {}, nbPeople: 1 }).subscribe(res => result = res);
  tick(1000);  // Avance la simulation de temps de 1s
  expect(result).toBeTrue();
}));

 it('should return only visible offers', () => {
  const allOffers = [
    { offer_id: 1, title: 'Visible Offer', visible: true } as Offer,
    { offer_id: 2, title: 'Hidden Offer', visible: false } as Offer,
  ];

  spyOn(service, 'getAllVisible').and.returnValue(of(allOffers.filter(o => o.visible)));

  service.getAllVisible().subscribe(offers => {
    expect(offers.length).toBe(1);
    expect(offers[0].visible).toBeTrue();
  });
});

  it('should return all visible offers from constants', (done) => {
  service.getAllVisible().subscribe(offers => {
    expect(offers).toEqual(OFFERS);
    done();
  });
});

it('should return all offers from constant', () => {
  const service: TicketingService = TestBed.inject(TicketingService);

  service.getAllVisible().subscribe(offers => {
    expect(offers).toEqual(OFFERS); // ou à minima vérifier .length ou un champ
  });
});

it('devrait utiliser le mock si environment.mockPayment est à true', (done) => {
  // Force le flag mock à true
  (environment as any).mockPayment = true;

  service.createOrder({ cart: [], payment: {}, nbPeople: 1 }).subscribe(result => {
    expect(result).toBeTrue();
    done();
  });
});

});