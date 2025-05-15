import { ComponentFixture, TestBed } from '@angular/core/testing';
import { OrderComponent } from './order.component';
import { provideHttpClient } from '@angular/common/http';
import { TicketingService } from '../../services/ticketing/ticketing.service';
import { AuthService } from '../../services/authenticate/auth.service';
import { of } from 'rxjs';
import { DomSanitizer } from '@angular/platform-browser';
import { Order } from '../../models/order.model';
import { Ticket } from '../../models/ticket.model';

// Interface explicite pour AuthService mocké
interface AuthServiceMock {
  getToken: jasmine.Spy;
}

describe('OrderComponent', () => {
  let component: OrderComponent;
  let fixture: ComponentFixture<OrderComponent>;
  let ticketingService: jasmine.SpyObj<TicketingService>;
  let authService: AuthServiceMock;
  let sanitizer: DomSanitizer;

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
    sanitizer = TestBed.inject(DomSanitizer);
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

  it('should sanitize QR code URLs in ngOnChanges', () => {
    
    const mockTicket = new Ticket();
    mockTicket.ticket_id = 1;
    mockTicket.order_id = 123;
    mockTicket.is_single = true;
    mockTicket.is_duo = false;
    mockTicket.is_familial = false;
    mockTicket.number_of_places = 1;
    mockTicket.qrcode = 'mockedBase64QRCode'; 
  
    const mockOrder = new Order();
    mockOrder.order_id = 123;
    mockOrder.user_id = 456;
    mockOrder.date_order = new Date().toUTCString();
    mockOrder.price = 50;
    mockOrder.ticket_type = 'single';
    mockOrder.tickets = [mockTicket];
  
    spyOn(sanitizer, 'bypassSecurityTrustUrl').and.callThrough();

    component.order = mockOrder;
    component.ngOnChanges();
    expect(sanitizer.bypassSecurityTrustUrl).toHaveBeenCalledWith('data:image/png;base64,' + mockTicket.qrcode);
    expect(mockTicket.safeQrcodeUrl).toBeDefined();
  });
});