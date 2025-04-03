import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { OrdersComponent } from './orders.component';
import { AuthService } from '../../services/authenticate/auth.service'; 
import { OrderService } from '../../services/order/order.service'; 
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ModalService } from '../../services/modal/modal.service';

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
});
