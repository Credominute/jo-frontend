import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SignLogInComponent } from './sign-log-in.component';

describe('SignLogInComponent', () => {
  let component: SignLogInComponent;
  let fixture: ComponentFixture<SignLogInComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SignLogInComponent]
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
