import { TestBed } from '@angular/core/testing';
import { HttpClient } from '@angular/common/http';
import { OffersService } from './offers.service';
import { of } from 'rxjs';

// Mock du HttpClient
class MockHttpClient {
  get() {
    // Retourne un observable simulé d'offres
    return of([{ id: 1, title: 'Offre 1' }, { id: 2, title: 'Offre 2' }]);
  }
}

describe('OffersService', () => {
  let service: OffersService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      
      providers: [
        OffersService,  // Fournir le service
        { provide: HttpClient, useClass: MockHttpClient }, // Mock du HttpClient
      ],
    });
    service = TestBed.inject(OffersService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
