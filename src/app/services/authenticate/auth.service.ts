import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, Subject, of} from 'rxjs';
import { Router } from '@angular/router';
import { tap, switchMap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private isAuthenticated = (localStorage.getItem('access_token')!=null);   
  private accessToken: string | null = null;
  private readonly statusAuthListener = new Subject<boolean>();
  private roles: string[] = [];
  private isAdmin = false;
  private readonly adminAuthListener = new Subject<boolean>();

  endpointURL = environment.api;

  constructor(private readonly httpClient: HttpClient, private readonly router: Router){
  }

   // Le servive d'authentification mocké :
  checkEmailMock(email: string): Observable<boolean> {
    const existingEmail = 'test@gmail.com'; // Email qui existe déjà
    if (email === existingEmail) {
      return of(true); // Utilisateur qui existe déjà
    }
    return of(false); // Utilisateur inexistant
  }

    // La simulation d'un compte admin (mock aussi) :
  mockLoginAsAdmin(): Observable<boolean> {
    if (environment.mock) {
      console.log('[MOCK] mockLoginAsAdmin() appelé');
      localStorage.setItem('access_token', 'fake-token');
      this.isAuthenticated = true;
      this.statusAuthListener.next(true);
      this.roles = ['admin'];
      localStorage.setItem('roles', JSON.stringify(this.roles));
      this.isAdmin = true;
      this.adminAuthListener.next(true);
      this.router.navigate(['/admin']);
  
      return of(true);
    }
    return of(false);
  }

  get getToken(){
    return localStorage.getItem('access_token');
  }
  get getIsAuthenticated(){
    return this.isAuthenticated;
  }
  get getStatusAuthListener(){
    return this.statusAuthListener.asObservable();
  }
  get getAdminAuthListener(){
    return this.adminAuthListener.asObservable();
  }
  get getIsAdmin(){
    let roles_local = localStorage.getItem('roles');
    if(roles_local){
      this.isAdmin = JSON.parse(roles_local).includes('admin');
    }
    return this.isAdmin;
  }
  get getRoles(){
    return this.roles;
  }

  // Vérifie si l'adresse mail existe bien dans la base de données
  checkEmail(email: string){
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

  // Ajout d'une fonction de mappage
  private mapFrontendToBackend(user: any): any {
    return {
      mail: user.email,
      mot_de_passe: user.password,
      prenom: user.firstName,
      nom: user.lastName,
      telephone: user.phone,
    };
  }

  signupUser(user: any){
    if (environment.mock) {
      console.log('[MOCK] signupUser() appelé');
      localStorage.setItem('access_token', 'fake-token');
      this.isAuthenticated = true;
      this.statusAuthListener.next(true);
      this.roles = ['user'];
      localStorage.setItem('roles', JSON.stringify(this.roles));
      this.isAdmin = false;
      this.adminAuthListener.next(false);
      return of(true);
    }

    // Crée l'objet 'user' pour l'envoyer au serveur avec un mappage
    const registerUser = this.mapFrontendToBackend(user);

    return new Observable<boolean>(observer => {
      this.httpClient.post(this.endpointURL + 'signup', registerUser).subscribe({
        next: (data: any) => {
          observer.next(true);
          observer.complete();
        },
        error: (error) => {
          observer.error(error);
          observer.complete();
        }
      });
    });
  }

  // Login de l'utilisateur
  loginUser(email: string, password: string): Observable<boolean> {
    if (environment.mock) {
      console.log('[MOCK] loginUser() appelé');
      localStorage.setItem('access_token', 'fake-token');
      this.isAuthenticated = true;
      this.statusAuthListener.next(true);
      this.roles = ['user'];
      localStorage.setItem('roles', JSON.stringify(this.roles));
      this.isAdmin = false;
      this.adminAuthListener.next(false);
      return of(true);
    }

    // Version réelle (non mockée) :
    const headers = new HttpHeaders({
      'Content-Type': 'application/x-www-form-urlencoded'
    });
  
    const body = new URLSearchParams();
    body.set('username', email);
    body.set('password', password);
    body.set('grant_type', 'password');
  
    return this.httpClient.post<any>(this.endpointURL + 'login', body, { headers }).pipe(
      // Étape 1 : effet de bord → sauvegarder token et mettre à jour le state local
      tap((data) => {
        localStorage.setItem('access_token', data.access_token);
        this.accessToken = data.access_token;
        this.isAuthenticated = true;
        this.statusAuthListener.next(true);
      }),
  
      // Étape 2 : appeler getUserRoles() après login
      switchMap(() => this.getUserRoles()),
  
      // Étape 3 : on mappe la réponse des rôles à true car login + rôles = succès
      switchMap(() => new Observable<boolean>((observer) => {
        observer.next(true);
        observer.complete();
      }))
    );
  }

  // logout de l'utilisateur
  logoutUser(){
    // reset token et statut de l'authentification
    this.accessToken = null;
    this.isAuthenticated = false;
    this.roles = [];
    this.isAdmin = false;

    // notifie aux listeners
    this.statusAuthListener.next(false);
    this.adminAuthListener.next(false);

    // retire le token du Localstorage
    localStorage.removeItem('access_token');
    localStorage.removeItem('roles');

    // redirige l'utilisateur vers l'accueil
    this.router.navigate(['']);
  }

// Obtient les rôles de l'utilisateur connecté
getUserRoles() {
  const headers = new HttpHeaders({
    'Content-Type': 'application/json',
    'Authorization': 'Bearer ' + this.getToken
  });

  return new Observable<string[]>(observer => {
    this.httpClient.get(this.endpointURL + 'users/me/roles', { headers }).subscribe({
      next: (data: any) => {
        // Vérifie si le backend renvoie bien un rôle
        if (Array.isArray(data) && data.length > 0) {
          this.roles = data;
        } else {
          // Si aucun rôle n'est renvoyé, on attribue le rôle "user" par défaut
          this.roles = ['user'];
          console.warn('[WARN] Aucun rôle reçu du backend. Rôle "user" attribué par défaut.');
        }
        
        localStorage.setItem('roles', JSON.stringify(this.roles));

        this.isAdmin = this.roles.includes('admin');
        this.adminAuthListener.next(this.isAdmin);

        observer.next(this.roles);
        observer.complete();
      },
      error: (error) => {
        observer.error(error);
        observer.complete();
      }
    });
  });
}}