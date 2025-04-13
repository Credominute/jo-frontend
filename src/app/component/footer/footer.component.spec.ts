import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FooterComponent } from './footer.component';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing'; // Import du RouterTestingModule
import { of } from 'rxjs';
import { HttpClient } from '@angular/common/http';

// Créer un mock de HttpClient
class MockHttpClient {
  get() {
    // Simuler des données réalistes que le composant peut utiliser
    return of([{ name: 'Footer Item 1' }, 
              { name: 'Footer Item 2' } // Chaque élément est un objet avec une propriété 'name'
            ]); 
  }
}

// Créer un mock de ActivatedRoute
const activatedRouteMock = {
  snapshot: {
    paramMap: {
      get: (key: string) => 'test'
    }
  },
  queryParams: of({})
};

describe('FooterComponent', () => {
  let component: FooterComponent;
  let fixture: ComponentFixture<FooterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        FooterComponent,  // Importer le composant standalone ici
        RouterTestingModule  // Ajout du RouterTestingModule pour gérer les routes
      ],
      providers: [
        { provide: HttpClient, useClass: MockHttpClient },  // Injection du mock de HttpClient
        { provide: ActivatedRoute, useValue: activatedRouteMock }  // Injection du mock de ActivatedRoute
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FooterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});