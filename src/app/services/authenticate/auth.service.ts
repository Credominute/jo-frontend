import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, Subject, of } from 'rxjs';
import { Router } from '@angular/router';
import { tap, switchMap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private isAuthenticated = (localStorage.getItem('access_token') != null);   
  private accessToken: string | null = null;
  private readonly statusAuthListener = new Subject<boolean>();
  private roles: string[] = [];
  private isAdmin = false;
  private readonly adminAuthListener = new Subject<boolean>();

  endpointURL = environment.api;

  constructor(private readonly httpClient: HttpClient, private readonly router: Router) {
    console.log('[AuthService] ENV:', environment); 
  }

  // Constantes pour la gestion des rôles
  public readonly ADMIN_ROLE = 'admin';
  private readonly USER_ROLE = 'user';

  // Methode POST centralisée HTTP
  private httpPost(url: string, body: any, headers: HttpHeaders): Observable<any> {
    return this.httpClient.post<any>(`${this.endpointURL}${url}`, body, { headers });
  }

  // Login mock pour l'utilisateur et l'admin
  public loginMock(role: string): Observable<boolean> {
    console.log(`[MOCK] loginUser() called as ${role}`);
    localStorage.setItem('access_token', 'fake-token');
    this.isAuthenticated = true;
    this.statusAuthListener.next(true);
    this.roles = [role];
    localStorage.setItem('roles', JSON.stringify(this.roles));
    this.isAdmin = (role === this.ADMIN_ROLE);
    this.adminAuthListener.next(this.isAdmin);
    return of(true);
  }

  // Méthode centralisée d'actualisation des rôles
  private updateRoles(): void {
    let roles_local = localStorage.getItem('roles');
    if (roles_local) {
      this.roles = JSON.parse(roles_local);
      this.isAdmin = this.roles.includes(this.ADMIN_ROLE);
      this.adminAuthListener.next(this.isAdmin);
    }
  }

  // Getters du statut de l'authentification
  get getToken() {
    return localStorage.getItem('access_token');
  }
  get getIsAuthenticated() {
    return this.isAuthenticated;
  }
  get getStatusAuthListener() {
    return this.statusAuthListener.asObservable();
  }
  get getAdminAuthListener() {
    return this.adminAuthListener.asObservable();
  }
  get getIsAdmin() {
    this.updateRoles(); 
    return this.isAdmin;
  }
  get getRoles() {
    return this.roles;
  }

  private mapLoginData(email: string, password: string): any {
  return {
    mail: email,
    mot_de_passe: password
  };
}

  // Login utilisateur
  loginUser(email: string, password: string): Observable<boolean> {
    if (environment.mock) {
      return this.loginMock(this.USER_ROLE);
    }

    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });

    const body = this.mapLoginData(email, password);

    return this.httpPost('auth/login', body, headers).pipe(
      tap((data) => {
        // Authentification
        localStorage.setItem('access_token', data.access_token);
        this.accessToken = data.access_token;
        this.isAuthenticated = true;
        this.statusAuthListener.next(true);

       // Gestion des rôles à partir de la réponse
        this.roles = [data.role]; // par exemple: 'admin' ou 'user'
        localStorage.setItem('roles', JSON.stringify(this.roles));
        this.isAdmin = data.role === this.ADMIN_ROLE;
        this.adminAuthListener.next(this.isAdmin);
      }),
      switchMap(() => of(true))
    );
  }

  // Login mock admin
  loginAsAdmin(): Observable<boolean> {
    if (environment.mock) {
      return this.loginMock(this.ADMIN_ROLE);
    }
    return of(false);
  }

  // Logout utilisateur
  logoutUser() {
    this.accessToken = null;
    this.isAuthenticated = false;
    this.roles = [];
    this.isAdmin = false;
    this.statusAuthListener.next(false);
    this.adminAuthListener.next(false);
    localStorage.removeItem('access_token');
    localStorage.removeItem('roles');
    this.router.navigate(['']);
  }

  // Vérifie si le mail existe via l'API (mode réel, GET)
checkEmail(email: string): Observable<boolean> {
  if (environment.mock) {
    return this.checkEmailMock(email);
  }

  const encodedEmail = encodeURIComponent(email); // Sécurise les caractères spéciaux dans l’URL
  const url = `${this.endpointURL}auth/verify?mail=${encodedEmail}`;

  return new Observable<boolean>((observer) => {
    this.httpClient.get<{ exists: boolean }>(url).subscribe({
      next: (data) => {
        observer.next(data.exists);
        observer.complete();
      },
      error: (error) => {
        console.error("Erreur lors de la vérification d'email via l'API :", error);
        observer.error(error);
        observer.complete();
      }
    });
  });
}

  // Vérifie si l'adresse mail existe dans un contexte mocké
  checkEmailMock(email: string): Observable<boolean> {
    const existingEmail = 'test@gmail.com'; // Mail qui existe déjà
    if (email === existingEmail) {
      return of(true); // Utilisateur qui existe déjà
    }
    return of(false); // Utilisateur inexistant
  }

  // Map l'utilisateur frontend au format backend
  private mapFrontendToBackend(user: any): any {
    return {
      mail: user.email,
      mot_de_passe: user.password,
      prenom: user.firstName,
      nom: user.lastName,
      telephone: user.phone,
    };
  }

  // Enregistrement de l'utilisateur
  signupUser(user: any): Observable<boolean> {
    if (environment.mock) {
      return this.loginMock(this.USER_ROLE);
    }

    const registerUser = this.mapFrontendToBackend(user);

    return this.httpPost('auth/register', registerUser, new HttpHeaders({ 'Content-Type': 'application/json' })).pipe(
      tap(() => {
        this.isAuthenticated = true;
        this.statusAuthListener.next(true);
        this.roles = [this.USER_ROLE];
        localStorage.setItem('roles', JSON.stringify(this.roles));
        this.isAdmin = false;
        this.adminAuthListener.next(false);
      }),
      switchMap(() => of(true))
    );
  }
}