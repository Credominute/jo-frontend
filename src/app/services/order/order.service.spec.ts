import { TestBed } from '@angular/core/testing';
import { OrderService } from './order.service';
import { AuthService } from '../authenticate/auth.service';
import { HttpClient } from '@angular/common/http';
import { of, throwError } from 'rxjs';
import { Order } from '../../models/order.model';

// ✅ Mock d'Order avec une méthode spyable
class MockOrder {
  order_id = 1;
  loadfromJson(json: any) {}
}

// ✅ Mock du HttpClient avec spy sur post/get
class MockHttpClient {
  post = jasmine.createSpy().and.returnValue(of({}));
  get = jasmine.createSpy().and.returnValue(of([{ id: 1 }, { id: 2 }]));
}

// ✅ Mock de AuthService
class MockAuthService {
  get getToken() {
    return 'fake-token';
  }
}

describe('OrderService', () => {
  let service: OrderService;
  let httpClient: MockHttpClient;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        OrderService,
        { provide: HttpClient, useClass: MockHttpClient },
        { provide: AuthService, useClass: MockAuthService }
      ]
    });

    service = TestBed.inject(OrderService);
    httpClient = TestBed.inject(HttpClient) as any;
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should create a new order', (done) => {
    const orderData = {
      cart: [{ id: 1 }],
      payment: 'card',
      nbPeople: 2
    };

    service.create(orderData).subscribe(response => {
      expect(httpClient.post).toHaveBeenCalled();
      expect(response).toBeTrue();
      done();
    });
  });

  it('should handle error when creating an order', (done) => {
    httpClient.post.and.returnValue(throwError(() => new Error('Creation failed')));

    service.create({ cart: [], payment: '', nbPeople: 1 }).subscribe({
      error: (err) => {
        expect(err).toBeTruthy();
        done();
      }
    });
  });

  it('should get user orders', (done) => {
    service.getOrdersUser().subscribe(orders => {
      expect(httpClient.get).toHaveBeenCalled();
      expect(orders.length).toBe(2);
      done();
    });
  });

  it('should handle error when getting user orders', (done) => {
    httpClient.get.and.returnValue(throwError(() => new Error('Server error')));

    service.getOrdersUser().subscribe({
      error: (err) => {
        expect(err).toBeTruthy();
        done();
      }
    });
  });
});
