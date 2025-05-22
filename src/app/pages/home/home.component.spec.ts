import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClient } from '@angular/common/http';
import { HomeComponent } from './home.component';
import { ActivatedRoute } from '@angular/router'; 
import { of } from 'rxjs'; 


// Mock de HttpClient
class MockHttpClient {
  get() {
    return of([]);  // Renvoie un observable vide ou simulé
  }
}

describe('HomeComponent', () => {
  let component: HomeComponent;
  let fixture: ComponentFixture<HomeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HomeComponent],
      providers: [
        { 
          provide: HttpClient,  // Utilisation du mock de HttpClient
          useClass: MockHttpClient 
        },
        { 
          provide: ActivatedRoute,  // Mock de ActivatedRoute
          useValue: { snapshot: { paramMap: of({}) } }  // Mock de paramMap
        }
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
