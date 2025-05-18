import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClient } from '@angular/common/http';
import { HeaderComponent } from './header.component';  // Importer directement le HeaderComponent
import { AuthService } from '../../services/authenticate/auth.service';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';
import { environment } from '../../../environments/environment';

// Créer un mock de HttpClient
class MockHttpClient {
  get() {
    return of({}); // Retourner un Observable vide (ou simuler les données que l'on veut)
  }
}

// Mock du Router
class MockRouter {
  navigate = jasmine.createSpy('navigate');
}

// Créer un mock de AuthService
class MockAuthService {
  getIsAuthenticated() {
    return true;  // L'utilisateur est authentifié
  }

  getIsAdmin() {
    return false;  // L'utilisateur n'est pas admin
  }

  getStatusAuthListener = of(true);  // L'utilisateur est authentifié
  getAdminAuthListener = of(false);  // L'utilisateur n'est pas admin
}

// Mock de ActivatedRoute
const activatedRouteMock = {
  snapshot: {
    paramMap: {
      get: (key: string) => 'test' // Simuler les paramètres de l'URL
    }
  },
  queryParams: of({}) // Simuler les queryParams si nécessaire
};

describe('HeaderComponent', () => {
  let component: HeaderComponent;
  let fixture: ComponentFixture<HeaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        RouterTestingModule,  // Ajouter RouterTestingModule
        HeaderComponent       // Ajouter HeaderComponent directement dans "imports" pour un composant standalone
      ],
      providers: [
        { provide: HttpClient, useClass: MockHttpClient },
        { provide: AuthService, useClass: MockAuthService },
        { provide: ActivatedRoute, useValue: activatedRouteMock }
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should toggle menu open state', () => {
    expect(component.isMenuOpen).toBeFalse();
    component.toggleMenu();
    expect(component.isMenuOpen).toBeTrue();
    component.toggleMenu();
    expect(component.isMenuOpen).toBeFalse();
  });
});