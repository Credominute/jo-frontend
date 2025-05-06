import { ComponentFixture, TestBed } from '@angular/core/testing';
import { OrderComponent } from './order.component';
import { provideHttpClient } from '@angular/common/http';
import { TicketingService } from '../../services/ticketing/ticketing.service';
import { AuthService } from '../../services/authenticate/auth.service';
import { of } from 'rxjs';

// Interface explicite pour AuthService mocké
interface AuthServiceMock {
  getToken: jasmine.Spy;
}

describe('OrderComponent', () => {
  let component: OrderComponent;
  let fixture: ComponentFixture<OrderComponent>;
  let ticketingService: jasmine.SpyObj<TicketingService>;
  let authService: AuthServiceMock;

  beforeEach(async () => {
    // Mock de AuthService
    authService = jasmine.createSpyObj<AuthServiceMock>('AuthService', ['getToken']);

    // Correction : noms des méthodes mockées doivent correspondre à celles de TicketingService
    ticketingService = jasmine.createSpyObj<TicketingService>('TicketingService', ['createOrder', 'getUserOrders']);

    // Configuration des valeurs de retour
    authService.getToken.and.returnValue('mockedToken');
    ticketingService.getUserOrders.and.returnValue(of([]));

    await TestBed.configureTestingModule({
      imports: [OrderComponent],
      providers: [
        { provide: AuthService, useValue: authService },
        { provide: TicketingService, useValue: ticketingService },
        provideHttpClient()
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(OrderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize showDetailsOrder and showTicketOrder as false', () => {
    expect(component.showDetailsOrder).toBeFalse();
    expect(component.showTicketOrder).toBeFalse();
  });

  it('should toggle showDetailsOrder when showDetails is called', () => {
    component.showDetails();
    expect(component.showDetailsOrder).toBeTrue();

    component.showDetails();
    expect(component.showDetailsOrder).toBeFalse();
  });

  it('should toggle showTicketOrder when showTicket is called', () => {
    component.showTicket();
    expect(component.showTicketOrder).toBeTrue();

    component.showTicket();
    expect(component.showTicketOrder).toBeFalse();
  });
});