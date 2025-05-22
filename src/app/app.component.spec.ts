import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AppComponent } from './app.component';
import { ModalService } from './services/modal/modal.service'; // Mock du ModalService
import { RouterTestingModule } from '@angular/router/testing'; // Permet d’éviter l’erreur d’ActivatedRoute
import { HttpClientTestingModule } from '@angular/common/http/testing'; // Module pour simuler les requêtes HTTP

// Mock du ModalService
const mockModalService = {
  open: jasmine.createSpy('open'),
  close: jasmine.createSpy('close'),
  add: jasmine.createSpy('add'),
  remove: jasmine.createSpy('remove')
};

describe('AppComponent', () => {
  let fixture: ComponentFixture<AppComponent>;
  let component: AppComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        AppComponent,            // Import du composant standalone ici
        RouterTestingModule,     // On importe RouterTestingModule pour éviter l’erreur d’ActivatedRoute
        HttpClientTestingModule  // Ajout de HttpClientTestingModule pour simuler les appels HTTP
      ],
      providers: [
        { provide: ModalService, useValue: mockModalService } // Fournir le mock du ModalService
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(AppComponent);
    component = fixture.componentInstance;
  });

  // Test simple : Vérification que le composant est bien créé
  it('should create the app component', () => {
    fixture.detectChanges(); // Déclenche la détection des changements
    expect(component).toBeTruthy(); // Vérifie que le composant existe
  });

  afterEach(() => {
    if (fixture) {
      fixture.destroy();
    }
  });
});