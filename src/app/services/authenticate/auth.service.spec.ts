import { TestBed } from '@angular/core/testing';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { AuthService } from './auth.service';
import { of, throwError } from 'rxjs';  // Ajout de throwError


describe('AuthenticateService', () => {
  let service: AuthService;
  let httpClientMock: jasmine.SpyObj<HttpClient>; // Utilisation d'un spy pour HttpClient

  beforeEach(() => {
    // Créer un mock de HttpClient
    httpClientMock = jasmine.createSpyObj('HttpClient', ['post', 'get']);

    // Configure le test
    TestBed.configureTestingModule({
      providers: [
        AuthService, 
        { provide: HttpClient, useValue: httpClientMock }  // On remplace HttpClient par notre mock
      ]
    });
    service = TestBed.inject(AuthService);
  });

  it('should handle login error', (done) => {
    const mockError = new HttpErrorResponse({ status: 401, statusText: 'Unauthorized' });
    httpClientMock.post.and.returnValue(throwError(() => mockError));  // Simule une erreur 401
  
    service.loginUser('test@example.com', 'wrongpassword').subscribe({
      next: () => done.fail('Expected error, but got success'),
      error: (error) => {
        expect(error.status).toBe(401);  // Vérifie que l'erreur a bien été gérée
        done();
      }
    });
  });

  it('should sign up user successfully', (done) => {
    const mockResponse = {};  // Simule une réponse vide mais réussie
    httpClientMock.post.and.returnValue(of(mockResponse));
  
    const user = { email: 'newuser@example.com', password: 'password', firstName: 'John', lastName: 'Doe', phone: '1234567890' };
    service.signupUser(user).subscribe({
      next: (result) => {
        expect(result).toBeTrue();  // Vérifie que l'inscription a réussi
        done();
      },
      error: done.fail
    });
  });

  it('should logout user', () => {
    // Simuler un token existant
    localStorage.setItem('access_token', 'fake_token');
    service.logoutUser();  // Appel de la méthode logout
  
    expect(localStorage.getItem('access_token')).toBeNull();  // Vérifie que le token a été supprimé
    expect(service.getIsAuthenticated).toBeFalse();  // Vérifie que l'authentification est maintenant à false
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should login user successfully', (done) => {
    const mockLoginResponse = { access_token: 'fake_token' };  // Simule une réponse avec un token
    const mockRolesResponse = ['user', 'admin'];  // Simule une réponse avec des rôles
  
    // Simuler les réponses des méthodes HTTP
    httpClientMock.post.and.returnValue(of(mockLoginResponse));  // Mock de la réponse du login
    httpClientMock.get.and.returnValue(of(mockRolesResponse));  // Mock de la réponse des rôles
  
    const email = 'user@example.com';
    const password = 'password';
    
    service.loginUser(email, password).subscribe({
      next: (result) => {
        // Vérifie que le token est bien sauvegardé dans le localStorage
        expect(localStorage.getItem('access_token')).toBe('fake_token');
        expect(service.getIsAuthenticated).toBeTrue();  // L'utilisateur doit être authentifié
        done();
      },
      error: done.fail
    });
  });
});
