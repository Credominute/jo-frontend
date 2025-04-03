import { HttpClientTestingModule } from '@angular/common/http/testing';
import { AppComponent } from './app.component';
import { AuthService } from './services/authenticate/auth.service'; 
import { OrderService } from './services/order/order.service';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ModalService } from './services/modal/modal.service';
import { ComponentFixture, TestBed } from '@angular/core/testing';

const authServiceMock = {
  isAuthenticated: jasmine.createSpy('isAuthenticated').and.returnValue(true),
};

const orderServiceMock = {
  getOrders: jasmine.createSpy('getOrders').and.returnValue([]), // Simule une réponse vide
};

const mockModalService = {
  open: jasmine.createSpy('open')
};

describe('AppComponent', () => {
  let fixture: ComponentFixture<AppComponent>;
  let component: AppComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, AppComponent],  
      providers: [
        { provide: ModalService, useValue: mockModalService }, // 👈 Mock
        OrderService,
        AuthService
      ],
      schemas: [NO_ERRORS_SCHEMA], // Ignore les erreurs des composants inconnus
    }).compileComponents();

    fixture = TestBed.createComponent(AppComponent);
    component = fixture.componentInstance;
  });


  it('should create the app', () => {
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  it(`should have the 'jo-frontend' title`, () => {
    fixture.detectChanges(); // S'assure de déclencher la détection de changements
    expect(component.title).toEqual('jo-frontend');
  });

  it('should render title', () => {
    const fixture = TestBed.createComponent(AppComponent);
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('h1')?.textContent).toContain('Hello, jo-frontend');
  });
  
     // Nettoyage après chaque test
  afterEach(() => {
    if (fixture) {
      fixture.destroy(); // S'assure que le composant est détruit après chaque test
      }
    });
});
