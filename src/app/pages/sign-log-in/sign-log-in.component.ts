import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormBuilder, Validators, ReactiveFormsModule, FormGroup, AbstractControl, ValidationErrors, FormControl } from '@angular/forms';
import { AuthService } from '../../services/authenticate/auth.service';
import { HttpErrorResponse } from '@angular/common/http';
import { ErrorTranslation } from '../../services/constantsError';
import { ConstantsInfo } from '../../constantsInfo';
import { Router } from '@angular/router';
import { debounceTime } from 'rxjs/internal/operators/debounceTime';
import { distinctUntilChanged } from 'rxjs/internal/operators/distinctUntilChanged';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-sign-log-in',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, RouterModule],
  templateUrl: './sign-log-in.component.html',
  styleUrls: ['../../../scss/components/sign-log-in.scss']
})

export class SignLogInComponent {
  @Input() idModal: string = '';
  @Output() close = new EventEmitter<void>();
  loginForm: FormGroup;
  step = 'checkEmail';                  // step of the form - checkEmail, login, signup, badpassword, success

  infoTitle = '';                       // title of the div.info
  infoMessage = '';                     // message of the div.info

  errorMessage = '';
  errorMessageValidators = ErrorTranslation.errorMessageValidators;


  constructor(private formBuilder: FormBuilder, private authService: AuthService, private router: Router) {
    // create the form
    this.loginForm = this.formBuilder.group({
      email: ['', [Validators.required, this.emailValidator]],
      password: [''],
      firstName: [''],
      lastName: [''],
      phone: ['']
    });

    // if the email is modified, reset the form because the email must be verified again
    this.loginForm.get('email')?.valueChanges.pipe(debounceTime(350), distinctUntilChanged()).subscribe(value => {
      if (['login','signup'].includes(this.step)) {
        this.resetForm();
      }
    });

    // display the div.info according to the state of the form (email verified, user exists, auth success)
    this.setInfos(ConstantsInfo.infoMessageLogin.checkEmail);
  }

  handleEmailVerification() {
    const emailControl = this.loginForm.get('email');
  
    if (!emailControl || emailControl.invalid) {
      emailControl?.markAsTouched();
      emailControl?.updateValueAndValidity();
      console.warn('Email vide ou invalide, vérification annulée.');
      return;
    }
  
    this.authService.checkEmailMock(emailControl.value).subscribe({
      next: result => {
        if (result) {
          this.step = 'login';
          this.setInfos(ConstantsInfo.infoMessageLogin.login);
        } else {
          this.step = 'signup';
          this.setInfos(ConstantsInfo.infoMessageLogin.signup);
        }
        this.displayForm();
      },
      error: (error) => {
        console.error(error);
      }
    });
  }
  get emailFC() {
    return this.loginForm.controls['email'] as FormControl<string>;
  }

  get passwordFC() {
    return this.loginForm.get('password') as FormControl<string>;
  }

  get firstNameFC() {
    return this.loginForm.get('firstName') as FormControl<string>;
  }

  get lastNameFC() {
    return this.loginForm.get('lastName') as FormControl<string>;
  }

  get phoneFC() {
    return this.loginForm.get('phone') as FormControl<string>;
  }

  setInfos(infos: {title: string, message: string}) {
    this.infoTitle = infos.title;
    this.infoMessage = infos.message;
  }


  emailValidator(control: AbstractControl): ValidationErrors | null {
    const emailRegexp = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailRegexp.test(control.value) ? null : { email: true };
  }

  /*passwordValidator(control: AbstractControl): ValidationErrors | null {
    const emailRegexp = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailRegexp.test(control.value) ? null : { email: true };
  }*/

  passwordValidator(control: AbstractControl): ValidationErrors | null {
      const passwordRegexp = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
      return passwordRegexp.test(control.value) ? null : { passwordStrength: true };
    }


  // check if the email exists before displaying the form
  checkEmail()
  {
    this.authService.checkEmail(this.loginForm.get('email')?.value).subscribe({
      next: result => {
        if (result) {
          this.step = 'login';
          this.setInfos(ConstantsInfo.infoMessageLogin.login);
        }
        else {
          this.step = 'signup';
          this.setInfos(ConstantsInfo.infoMessageLogin.signup);
        }

        this.displayForm();
      },
      error: (error) => {
        console.error(error);
      }
    });
  }

  // display the form according to the state of the user
  displayForm()
  {
    if (this.step === 'login') {
      // if the user exists, only the password is required
      this.passwordFC.setValidators([Validators.required]);
    } else {
      // if the user doesn't exist, all fields are required
      this.passwordFC.setValidators([Validators.required, Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/)]);
      this.firstNameFC.setValidators([Validators.required]);
      this.lastNameFC.setValidators([Validators.required]);
      this.phoneFC.setValidators([Validators.required, Validators.pattern(/^\+?[1-9]\d{0,2}(\s?\d\s?){4,14}$/)]);
    }

    this.loginForm.updateValueAndValidity();
  }


  // reset the form to its initial state if the email is modified
  resetForm() {
    this.step = 'checkEmail';
    this.setInfos(ConstantsInfo.infoMessageLogin.checkEmail);
    this.errorMessage = '';

    this.loginForm.reset({email: this.emailFC.value});

    this.passwordFC.clearValidators();
    this.firstNameFC.clearValidators();
    this.lastNameFC.clearValidators();
    this.phoneFC.clearValidators();
  }

  resetPassword() {
    this.passwordFC.reset();
  }


  // submit the form
  onSubmit() {
    // Authentification (Login)
    if (this.step === 'login') {
      this.authService.loginUser(this.loginForm.value.email, this.loginForm.value.password).subscribe({
        next: result => {
          if (result) {
            // if the user is authenticated, display the success message
            this.step = 'success';
            this.setInfos(ConstantsInfo.infoMessageLogin.success);
            let redirect = localStorage.getItem('redirect');
            if(redirect !== null) {
              this.router.navigate([redirect]);
            }

            this.authService.getAdminAuthListener.subscribe((isAdmin: boolean) => {
              if(isAdmin) {
                this.router.navigate(['/admin']);
              }
            });
          }
        },
        error: (error: HttpErrorResponse) => {
          if (error.status === 401) {
            this.errorMessage = ErrorTranslation.errorMessageServer.get(error.error.detail) + " - ";
            this.errorMessage += error.error.detail;
            this.resetPassword();
          }
          console.error(error);
        }
      });
    } else {
      // Inscription (Signup)
      this.authService.signupUser(this.loginForm.value).subscribe({
        next: result => {
          if (result) {
            // if the user is registered, display the success message
            this.step = 'login';
            this.setInfos(ConstantsInfo.infoMessageLogin.registered);
            this.displayForm();
          } else {
            console.error('Erreur lors de l\'inscription');
          }
        },
        error: (error) => {
          console.error(error);
        }
      });
    }
  }

  // close the modal
  onClose() {
    this.step = 'checkEmail';
    this.setInfos(ConstantsInfo.infoMessageLogin.checkEmail);
    this.errorMessage = '';

    this.loginForm.reset();

    this.close.emit();
  }
}
