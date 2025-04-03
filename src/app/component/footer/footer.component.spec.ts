import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClient } from '@angular/common/http';
import { FooterComponent } from './footer.component';
import { of } from 'rxjs';

// Créer un mock de HttpClient
class MockHttpClient {
  get() {
    // Simuler des données réalistes que mon composant peut utiliser
    return of([{ name: 'Footer Item 1' }, 
              { name: 'Footer Item 2' } // Chaque élément est un objet avec une propriété 'name'
            ]); 
  }
}

describe('FooterComponent', () => {
  let component: FooterComponent;
  let fixture: ComponentFixture<FooterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FooterComponent],
      providers: [
        { provide: HttpClient, useClass: MockHttpClient }  // Injection du mock de HttpClient
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
