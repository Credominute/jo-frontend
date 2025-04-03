import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { SignLogInComponent } from './sign-log-in.component';

describe('SignLogInComponent', () => {
  let component: SignLogInComponent;
  let fixture: ComponentFixture<SignLogInComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SignLogInComponent],
      providers: [
        provideHttpClient(), // Fournit HttpClient pour les tests
      ],
    })
    .compileComponents();

    fixture = TestBed.createComponent(SignLogInComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
