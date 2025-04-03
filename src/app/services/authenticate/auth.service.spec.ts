import { TestBed } from '@angular/core/testing';
import { HttpClient } from '@angular/common/http';
import { AuthService } from './auth.service';


describe('AuthenticateService', () => {
  let service: AuthService;
  let httpClientMock: jasmine.SpyObj<HttpClient>; // Utilisation d'un spy pour HttpClient

  beforeEach(() => {
    // Créer un mock de HttpClient
    httpClientMock = jasmine.createSpyObj('HttpClient', ['post']);

    // Configure le test
    TestBed.configureTestingModule({
      providers: [
        AuthService, 
        { provide: HttpClient, useValue: httpClientMock }  // On remplace HttpClient par notre mock
      ]
    });
    service = TestBed.inject(AuthService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
