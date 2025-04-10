import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { OrdersComponent } from './orders.component';
import { AuthService } from '../../services/authenticate/auth.service'; 
import { OrderService } from '../../services/order/order.service'; 
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ModalService } from '../../services/modal/modal.service';
import { Router } from '@angular/router';

const mockModalService = {
  open: jasmine.createSpy('open')
};

describe('OrdersComponent', () => {
  let component: OrdersComponent;
  let fixture: ComponentFixture<OrdersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, OrdersComponent], 
      providers: [
        { provide: ModalService, useValue: mockModalService }, // 👈 Mock
        OrderService,
        AuthService
      ], 
      schemas: [NO_ERRORS_SCHEMA], // Pour éviter les erreurs sur les composants inconnus
    })
    .compileComponents();

    fixture = TestBed.createComponent(OrdersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should fetch orders if user is authenticated', () => {
    const mockOrders = [{ order_id: 1 }, { order_id: 2 }] as any;
  
    // Mock AuthService pour simuler un utilisateur connecté
    const authService = TestBed.inject(AuthService);
    spyOnProperty(authService, 'getIsAuthenticated', 'get').and.returnValue(true);
  
    // Mock OrderService
    const ordersService = TestBed.inject(OrderService);
    spyOn(ordersService, 'getOrdersUser').and.returnValue({
      subscribe: (observer: any) => observer.next(mockOrders)
    } as any);
  
    component.ngOnInit();
  
    expect(component.ordersArray).toEqual(mockOrders);
  });

  it('should redirect and open login modal if user is not authenticated', () => {
    const authService = TestBed.inject(AuthService);
    spyOnProperty(authService, 'getIsAuthenticated', 'get').and.returnValue(false);
  
    const router = TestBed.inject(Router);
    const navigateSpy = spyOn(router, 'navigate');
  
    component.ngOnInit();
  
    expect(navigateSpy).toHaveBeenCalledWith(['/']);
    expect(mockModalService.open).toHaveBeenCalledWith('login');
  });
});
