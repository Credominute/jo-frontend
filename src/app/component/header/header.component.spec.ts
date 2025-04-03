import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClient } from '@angular/common/http';
import { HeaderComponent } from './header.component';
import { AuthService } from '../../services/authenticate/auth.service';
import { of } from 'rxjs';

// Créer un mock de HttpClient
class MockHttpClient {
  get() {
    return of({}); // Retourner un Observable vide (ou simuler les données que l'on veut)
  }
}

// Créer un mock de AuthService
class MockAuthService {
  // Simuler la méthode getIsAuthenticated qui renvoie une valeur de type boolean
  getIsAuthenticated() {
    return true;  // Par exemple, l'utilisateur est authentifié
  }

  // Simuler la méthode getIsAdmin qui renvoie une valeur de type boolean
  getIsAdmin() {
    return false;  // Par exemple, l'utilisateur n'est pas admin
  }

  // Simuler les Observables pour l'authentification et le rôle admin
  getStatusAuthListener = of(true);  // L'utilisateur est authentifié
  getAdminAuthListener = of(false);  // L'utilisateur n'est pas admin
}

describe('HeaderComponent', () => {
  let component: HeaderComponent;
  let fixture: ComponentFixture<HeaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HeaderComponent],
      providers: [
        { provide: HttpClient, useClass: MockHttpClient },  // Fournir le mock de HttpClient
        { provide: AuthService, useClass: MockAuthService },  // Fournir le mock de AuthService
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
});
