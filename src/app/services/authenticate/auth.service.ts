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

  constructor(private readonly httpClient: HttpClient, private readonly router: Router) {}

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

  // Authentification status getters
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
    this.updateRoles();  // Refresh roles from storage
    return this.isAdmin;
  }

  get getRoles() {
    return this.roles;
  }

  // Login utilisateur
  loginUser(email: string, password: string): Observable<boolean> {
    if (environment.mock) {
      return this.loginMock(this.USER_ROLE);
    }

    const headers = new HttpHeaders({
      'Content-Type': 'application/x-www-form-urlencoded'
    });

    const body = new URLSearchParams();
    body.set('username', email);
    body.set('password', password);
    body.set('grant_type', 'password');

    return this.httpPost('login', body, headers).pipe(
      tap((data) => {
        localStorage.setItem('access_token', data.access_token);
        this.accessToken = data.access_token;
        this.isAuthenticated = true;
        this.statusAuthListener.next(true);
      }),
      switchMap(() => this.getUserRoles()),
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

  // Obtient le rôle de l'utilisateur du backend
  getUserRoles(): Observable<string[]> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + this.getToken
    });

    return this.httpClient.get<string[]>(`${this.endpointURL}users/me/roles`, { headers }).pipe(
      tap((data) => {
        this.roles = data;
        localStorage.setItem('roles', JSON.stringify(data));
        this.isAdmin = data.includes(this.ADMIN_ROLE);
        this.adminAuthListener.next(this.isAdmin);
      })
    );
  }

  // Vérifie si le mail existe dans la BDD
  checkEmail(email: string): Observable<boolean> {
    if (environment.mock) {
      return this.checkEmailMock(email); 
    }

    // Vérifier si le mail est l'admin prédéfini
    const adminEmail = 'admin@hotmail.com';  // Mail administrateur fictif
    if (email === adminEmail) {
    // Met à jour les rôles et l'authentification pour l'admin
      this.roles = [this.ADMIN_ROLE];
      localStorage.setItem('roles', JSON.stringify(this.roles));
      this.isAdmin = true;
      this.adminAuthListener.next(true);
      return of(true);  // Admin reconnu
    }
  
    return new Observable<boolean>(observer => {
      this.httpClient.get(this.endpointURL + 'login/' + email).subscribe({
        next: (data: any) => {
          observer.next(data.exist);
          observer.complete();
        },
        error: (error) => {
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
      role: [this.USER_ROLE],
    };
  }

  // Enregistrement de l'utilisateur
  signupUser(user: any): Observable<boolean> {
    if (environment.mock) {
      return this.loginMock(this.USER_ROLE);
    }

    const registerUser = this.mapFrontendToBackend(user);

    return this.httpPost('signup', registerUser, new HttpHeaders({ 'Content-Type': 'application/json' })).pipe(
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