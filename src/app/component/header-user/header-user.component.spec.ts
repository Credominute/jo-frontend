import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { HeaderUserComponent } from './header-user.component';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs'; // Pour simuler les observables

describe('HeaderUserComponent', () => {
  let component: HeaderUserComponent;
  let fixture: ComponentFixture<HeaderUserComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HeaderUserComponent, HttpClientTestingModule],
      providers: [
        { 
          provide: ActivatedRoute, 
          useValue: { snapshot: { paramMap: of({}) } } // Simule un ActivatedRoute avec un paramMap vide
        }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(HeaderUserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

