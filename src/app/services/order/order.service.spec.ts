import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';  // ✅ Import de provideHttpClient
import { OrderService } from './order.service';  // Import du service à tester
import { AuthService } from '../authenticate/auth.service';  // AuthService que tu utilises

// Mocker AuthService
class MockAuthService {
  getToken = 'fake-token';  // Simule le token renvoyé par le service AuthService
}

describe('OrderService', () => {
  let service: OrderService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        OrderService,  // Fournir l'OrderService à tester
        { provide: AuthService, useClass: MockAuthService },  // Mock de AuthService
        provideHttpClient()  // Fournir HttpClient sans module obsolète
      ]
    });
    service = TestBed.inject(OrderService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
