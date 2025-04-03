import { ComponentFixture, TestBed } from '@angular/core/testing';
import { OrderComponent } from './order.component';
import { provideHttpClient } from '@angular/common/http'; // ✅ Ajout de provideHttpClient
import { OrderService } from '../../services/order/order.service';
import { AuthService } from '../../services/authenticate/auth.service';
import { of } from 'rxjs';

// Interface explicite pour AuthService mocké
interface AuthServiceMock {
  getToken: jasmine.Spy;
}

describe('OrderComponent', () => {
  let component: OrderComponent;
  let fixture: ComponentFixture<OrderComponent>;
  let orderService: jasmine.SpyObj<OrderService>;
  let authService: AuthServiceMock;

  beforeEach(async () => {
    // Mock de AuthService
    authService = jasmine.createSpyObj<AuthServiceMock>('AuthService', ['getToken']);
    
    // Mock de OrderService
    orderService = jasmine.createSpyObj<OrderService>('OrderService', ['create', 'getOrdersUser']);

    // Simuler le retour des méthodes mockées
    authService.getToken.and.returnValue('mockedToken');
    orderService.getOrdersUser.and.returnValue(of([]));

    await TestBed.configureTestingModule({
      imports: [OrderComponent], // ✅ Composant en mode standalone
      providers: [
        { provide: AuthService, useValue: authService }, // ✅ Mock de AuthService
        { provide: OrderService, useValue: orderService }, // ✅ Mock de OrderService
        provideHttpClient(), // ✅ Ajout du provider officiel pour HttpClient
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OrderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});