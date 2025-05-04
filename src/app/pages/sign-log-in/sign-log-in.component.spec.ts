import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { SignLogInComponent } from './sign-log-in.component';
import { Router } from '@angular/router';
import { AuthService } from '../../services/authenticate/auth.service';
import { of, throwError } from 'rxjs';
import { FormControl } from '@angular/forms';
import { ConstantsInfo } from '../../constantsInfo';

describe('SignLogInComponent', () => {
  let component: SignLogInComponent;
  let fixture: ComponentFixture<SignLogInComponent>;
  let authServiceSpy: jasmine.SpyObj<AuthService>;
  let routerSpy: jasmine.SpyObj<Router>;

  beforeEach(async () => {
    authServiceSpy = jasmine.createSpyObj('AuthService', [
      'checkEmail',
      'loginUser',
      'signupUser',
      'getAdminAuthListener'
    ]);
    routerSpy = jasmine.createSpyObj('Router', ['navigate']);

    await TestBed.configureTestingModule({
      imports: [SignLogInComponent],
      providers: [
        provideHttpClient(),
        { provide: AuthService, useValue: authServiceSpy },
        { provide: Router, useValue: routerSpy }
      ],
    })
    .compileComponents();

    fixture = TestBed.createComponent(SignLogInComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should return null for a valid email', () => {
    const emailControl = component.loginForm.controls['email'];
    emailControl.setValue('test@example.com');
    expect(component.emailValidator(emailControl)).toBeNull();
  });
  
  it('should return an error object for an invalid email', () => {
    const emailControl = component.loginForm.controls['email'];
    emailControl.setValue('invalid-email');
    expect(component.emailValidator(emailControl)).toEqual({ email: true });
  });

  it('should initialize the login form with email and password controls', () => {
    const emailControl = component.loginForm.controls['email'];
    const passwordControl = component.loginForm.controls['password'];
    expect(emailControl).toBeTruthy();
    expect(passwordControl).toBeTruthy();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should emit close event and reset modal on onClose()', () => {
    spyOn(component.close, 'emit');
    component.loginForm.patchValue({ email: 'test@example.com', password: '1234' });
    component.step = 'success';
    component.onClose();
    expect(component.step).toBe('checkEmail');
    expect(component.loginForm.value.email).toBeNull();
    expect(component.close.emit).toHaveBeenCalled();
  });

  it('should correctly update validators in displayForm() for login', () => {
    component.step = 'login';
    component.displayForm();
    expect(component.passwordFC.validator).toBeTruthy();
    expect(component.loginForm.get('firstName')?.validator).toBeFalsy();
  });

  it('should correctly update validators in displayForm() for signup', () => {
    component.step = 'signup';
    component.displayForm();
    expect(component.passwordFC.validator).toBeTruthy();
    expect(component.firstNameFC.validator).toBeTruthy();
  });

  it('should handle checkEmail returning true', () => {
    authServiceSpy.checkEmail.and.returnValue(of(true));
    component.loginForm.get('email')?.setValue('user@example.com');
    component.checkEmail();
    expect(component.step).toBe('login');
  });

  it('should handle checkEmail returning false', () => {
    authServiceSpy.checkEmail.and.returnValue(of(false));
    component.loginForm.get('email')?.setValue('user@example.com');
    component.checkEmail();
    expect(component.step).toBe('signup');
  });

  it('should handle checkEmail error case gracefully', () => {
    authServiceSpy.checkEmail.and.returnValue(throwError(() => new Error('Network error')));
    spyOn(console, 'error');
    component.checkEmail();
    expect(console.error).toHaveBeenCalled();
  });

  it('should expose FormControls via getters', () => {
    expect(component.emailFC instanceof FormControl).toBeTrue();
    expect(component.passwordFC instanceof FormControl).toBeTrue();
    expect(component.firstNameFC instanceof FormControl).toBeTrue();
    expect(component.lastNameFC instanceof FormControl).toBeTrue();
    expect(component.phoneFC instanceof FormControl).toBeTrue();
  });

  it('should reset password field correctly when empty', () => {
    component.passwordFC.setValue('');
    component.resetPassword();
    expect(component.passwordFC.value).toBeNull();
  });

  it('should apply login form validators when step is login', () => {
    component.step = 'login';
    component.displayForm();
    expect(component.passwordFC.validator).toBeTruthy();
    expect(component.firstNameFC.validator).toBeFalsy();
    expect(component.lastNameFC.validator).toBeFalsy();
    expect(component.phoneFC.validator).toBeFalsy();
  });
  
  it('should apply signup form validators when step is signup', () => {
    component.step = 'signup';
    component.displayForm();
    expect(component.passwordFC.validator).toBeTruthy();
    expect(component.firstNameFC.validator).toBeTruthy();
    expect(component.lastNameFC.validator).toBeTruthy();
    expect(component.phoneFC.validator).toBeTruthy();
  });

  it('should reset form values when onClose() is called', () => {
    component.loginForm.setValue({
      email: 'test@example.com',
      password: '1234',
      firstName: 'John',
      lastName: 'Doe',
      phone: '1234567890'
    });
  
    component.onClose();
    expect(component.step).toBe('checkEmail');
    expect(component.loginForm.value.email).toBeNull();
    expect(component.loginForm.value.password).toBeNull();
    expect(component.loginForm.value.firstName).toBeNull();
    expect(component.loginForm.value.lastName).toBeNull();
    expect(component.loginForm.value.phone).toBeNull();
  });

  it('should return null for a valid password', () => {
    const passwordControl = component.passwordFC;
    passwordControl.setValue('ValidPassword123!');
    expect(component.passwordValidator(passwordControl)).toBeNull(); // Devrait être null pour un mot de passe valide
  });
  
  it('should return an error object for a weak password', () => {
    const passwordControl = component.loginForm.controls['password'];
    passwordControl.setValue('weak');
    expect(component.passwordValidator(passwordControl)).toEqual({ passwordStrength: true });
  });

});



