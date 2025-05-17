import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormBuilder, Validators, ReactiveFormsModule, FormGroup, AbstractControl, ValidationErrors, FormControl } from '@angular/forms';
import { AuthService } from '../../services/authenticate/auth.service';
import { HttpErrorResponse } from '@angular/common/http';
import { ErrorTranslation } from '../../services/constantsError';
import { ConstantsInfo } from '../../constantsInfo';
import { Router, RouterModule } from '@angular/router';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { environment } from '../../../environments/environment';

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
  step = 'checkEmail';                  // étapes (step) du formulaire - checkEmail, login, signup, badpassword, success
  infoTitle = '';                       // titre de la div.info
  infoMessage = '';                     // message de la div.info
  errorMessage = '';
  errorMessageValidators = ErrorTranslation.errorMessageValidators;


  constructor(
    private readonly formBuilder: FormBuilder, 
    private readonly authService: AuthService, 
    private readonly router: Router
  ) {
    // création du formulaire
    this.loginForm = this.formBuilder.group({
      email: ['', [Validators.required, this.emailValidator]],
      password: [''],
      firstName: [''],
      lastName: [''],
      phone: ['']
    });

    // Réinitialisation du formulaire si l'email change
    this.loginForm.get('email')?.valueChanges.pipe(debounceTime(350), distinctUntilChanged()).subscribe(value => {
      if (['login','signup'].includes(this.step)) {
        this.resetForm();
      }
    });

    this.setInfos(ConstantsInfo.infoMessageLogin.checkEmail);
  }

  ngOnInit(): void {
    this.resizeModal();
  }

  resizeModal() {
    const modalElement = document.querySelector('.container') as HTMLElement;
    if (modalElement) {
      Object.assign(modalElement.style, {
        maxHeight: '75vh',
        height: 'auto',
        width: 'auto',
        margin: '0 auto',
        padding: '20px',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
      });
    }
  }

  handleEmailVerification() {
    const emailControl = this.loginForm.get('email');
  
    if (!emailControl || emailControl.invalid) {
      emailControl?.markAsTouched();
      emailControl?.updateValueAndValidity();
      console.warn('Email vide ou invalide, vérification annulée.');
      return;
    }

     const email = emailControl.value;

    // Vérification spécifique pour l'email admin 
    if (email === 'admin@hotmail.com') {
      console.log('[INFO] Admin login détecté');
      this.step = 'login';  // Forcer l'étape "login"
      this.authService.loginMock(this.authService.ADMIN_ROLE).subscribe(() => {
        this.setInfos(ConstantsInfo.infoMessageLogin.login);
        this.displayForm();
      });
      return;
     }

    // Appel à la méthode appropriée selon l'environnement
  if (environment.production) {
    this.checkEmail();  // Appel direct à la méthode existante pour les tests
  } else {
    this.authService.checkEmailMock(email).subscribe({
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
        console.error('Erreur lors de la vérification de l\'email :', error);
      }
    });
  }
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

  passwordValidator(control: AbstractControl): ValidationErrors | null {
      const passwordRegexp = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
      return passwordRegexp.test(control.value) ? null : { passwordStrength: true };
    }

  // vérification de l'existence du mail avant d'afficher le formulaire
  checkEmail()
  {
    this.authService.checkEmail(this.loginForm.get('mail')?.value).subscribe({
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

  // affichage du formulaire en fonction du status de l'utilisateur :
  displayForm()
  {
    if (this.step === 'login') {
      // si l'utilisateur existe, seul le mot de passe est requis
      this.passwordFC.setValidators([Validators.required]);
    } else {
      // si l'utilisateur n'existe pas, tous les champs sont requis
      this.passwordFC.setValidators([Validators.required, Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/)]);
      this.firstNameFC.setValidators([Validators.required]);
      this.lastNameFC.setValidators([Validators.required]);
      this.phoneFC.setValidators([Validators.required, Validators.pattern(/^\+?[1-9]\d{0,2}(\s?\d\s?){4,14}$/)]);
    }

    this.loginForm.updateValueAndValidity();
  }

  // reset du formulaire à son état initial si le mail est modifié
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

  // soumission du formulaire
  onSubmit() {
    // Authentification (Login)
    if (this.step === 'login') {
      this.authService.loginUser(this.loginForm.value.email, this.loginForm.value.password).subscribe({
        next: result => {
          if (result) {
            // si l'utilisateur est authentifié, affichage du message de success
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
      // Inscription (Sign-Up)
      this.authService.signupUser(this.loginForm.value).subscribe({
        next: result => {
          if (result) {
            // si l'utilisateur est enregistré, affichage du message de success
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

  // fermeture du modal
  onClose() {
    this.step = 'checkEmail';
    this.setInfos(ConstantsInfo.infoMessageLogin.checkEmail);
    this.errorMessage = '';
    this.loginForm.reset();
    this.close.emit();
  }
}