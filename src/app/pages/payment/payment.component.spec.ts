import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { PaymentComponent } from './payment.component';
import { AuthService } from '../../services/authenticate/auth.service'; 
import { OrderService } from '../../services/order/order.service'; 
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ModalService } from '../../services/modal/modal.service';

const mockModalService = {
  open: jasmine.createSpy('open')
};

describe('PaymentComponent', () => {
  let component: PaymentComponent;
  let fixture: ComponentFixture<PaymentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, PaymentComponent], 
      providers: [
        { provide: ModalService, useValue: mockModalService }, // 👈 Mock
        OrderService,
        AuthService
      ],
      schemas: [NO_ERRORS_SCHEMA], // Pour éviter les erreurs sur les composants inconnus
    })
    .compileComponents();

    fixture = TestBed.createComponent(PaymentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
