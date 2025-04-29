import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HeaderAdminComponent } from './header-admin.component'; // Assurez-vous d'importer le composant
import { AuthService } from '../../services/authenticate/auth.service';
import { BehaviorSubject } from 'rxjs';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing'; // Ajout du RouterTestingModule

describe('HeaderAdminComponent', () => {
  let component: HeaderAdminComponent;
  let fixture: ComponentFixture<HeaderAdminComponent>;
  let authServiceSpy: jasmine.SpyObj<AuthService>;
  let statusAuthSubject: BehaviorSubject<boolean>;
  let adminAuthSubject: BehaviorSubject<boolean>;

  beforeEach(async () => {
    // Initialisation des BehaviorSubject
    statusAuthSubject = new BehaviorSubject<boolean>(false);  // Valeur initiale false
    adminAuthSubject = new BehaviorSubject<boolean>(false);   // Valeur initiale false

    // Création d'un mock pour AuthService
    authServiceSpy = jasmine.createSpyObj('AuthService', ['logoutUser'], {
      getStatusAuthListener: statusAuthSubject.asObservable(),
      getAdminAuthListener: adminAuthSubject.asObservable()
    });

    await TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        RouterTestingModule,  // Ajout du RouterTestingModule pour activer le routage
        HeaderAdminComponent  // Importation du composant
      ],
      providers: [
        { provide: AuthService, useValue: authServiceSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(HeaderAdminComponent);
    component = fixture.componentInstance;

    // Déclenche la détection des changements pour appliquer les valeurs initiales
    fixture.detectChanges();

    // Attendre que les valeurs asynchrones se propagent
    await fixture.whenStable();
  });

  it('should initialize userIsAuthenticated and isAdmin properties to false', () => {
    // Vérifie que les propriétés sont initialisées à false au début
    expect(component.userIsAuthenticated).toBeFalse();
    expect(component.isAdmin).toBeFalse();
  });

  it('should update userIsAuthenticated and isAdmin properties when auth status changes', async () => {
    // Simule des changements dans les valeurs des BehaviorSubject
    statusAuthSubject.next(true);  // Simule l'authentification
    adminAuthSubject.next(true);   // Simule les droits d'admin

    // Attendre que les modifications se propagent
    await fixture.whenStable();
    fixture.detectChanges();

    // Vérifier que les propriétés ont bien été mises à jour
    expect(component.userIsAuthenticated).toBeTrue();
    expect(component.isAdmin).toBeTrue();
  });

  it('should initialize userIsAuthenticated and isAdmin to false if no user is authenticated', () => {
    component.ngOnInit();
    expect(component.userIsAuthenticated).toBe(false);
    expect(component.isAdmin).toBe(false);
  });

  it('should call logoutUser when logout is invoked', () => {
    component.logout();
    expect(authServiceSpy.logoutUser).toHaveBeenCalled();
  });
});








