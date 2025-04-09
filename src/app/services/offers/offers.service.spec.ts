import { TestBed } from '@angular/core/testing';
import { HttpClient } from '@angular/common/http';
import { OffersService } from './offers.service';
import { AuthService } from '../authenticate/auth.service';
import { of, throwError } from 'rxjs';
import { Offer } from '../../models/offer.model';

// Mock de l'Offer avec un spy sur loadfromJson
class MockOffer {
  offer_id = 1;
  loadfromJson(json: any) {}
}

// Mock du HttpClient
class MockHttpClient {
  get = jasmine.createSpy().and.returnValue(of([{ id: 1 }, { id: 2 }]));
  patch = jasmine.createSpy().and.returnValue(of({ id: 1 }));
  post = jasmine.createSpy().and.returnValue(of({ id: 1 }));
  put = jasmine.createSpy().and.returnValue(of({ id: 1 }));
}

// Mock de AuthService
class MockAuthService {
  get getToken() {
    return 'fake-jwt-token';
  }
}

describe('OffersService', () => {
  let service: OffersService;
  let httpClient: MockHttpClient;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        OffersService,
        { provide: HttpClient, useClass: MockHttpClient },
        { provide: AuthService, useClass: MockAuthService }
      ]
    });
    service = TestBed.inject(OffersService);
    httpClient = TestBed.inject(HttpClient) as any;
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should fetch all offers', (done) => {
    service.getAll().subscribe(offers => {
      expect(offers.length).toBe(2);
      done();
    });
  });

  it('should fetch visible offers', (done) => {
    service.getAllVisible().subscribe(offers => {
      expect(offers.length).toBe(2);
      done();
    });
  });

  it('should get offer by id', (done) => {
    httpClient.get.and.returnValue(of({ id: 1 }));
    service.get(1).subscribe(offer => {
      expect(offer).toBeTruthy();
      done();
    });
  });

  it('should return true if offer title exists', (done) => {
    httpClient.get.and.returnValue(of({ exist: true }));
    service.getByTitle('Offre 1').subscribe(exists => {
      expect(exists).toBeTrue();
      done();
    });
  });

  it('should toggle visibility', (done) => {
    service.toggleVisible(1, true).subscribe(response => {
      expect(response).toBeTruthy();
      done();
    });
  });

  it('should update an offer', (done) => {
    const offer = new MockOffer() as Offer;
    service.update(offer).subscribe(response => {
      expect(response).toBeTruthy();
      done();
    });
  });

  it('should add a new offer', (done) => {
    const offer = new MockOffer() as Offer;
    service.add(offer).subscribe(response => {
      expect(response).toBeTruthy();
      done();
    });
  });

  it('should handle error in getAll gracefully', (done) => {
    httpClient.get.and.returnValue(throwError(() => new Error('API failure')));
    service.getAll().subscribe({
      error: (err) => {
        expect(err).toBeTruthy();
        done();
      }
    });
  });
});