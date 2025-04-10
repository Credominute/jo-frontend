import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { ApiService } from './api.service';
import { Offer, OfferInCart } from '../../models/offer.model';

describe('ApiService', () => {
  let service: ApiService;
  let httpMock: HttpTestingController;

  const apiUrlTicket = 'http://127.0.0.1:8000/ticket'; // URL de l'API à vérifier

  const mockOffers: Offer[] = [
    new Offer('Simple', 'Offre solo', 1, 30, 'simple.jpg'),
    new Offer('Familial', 'Offre pour toute la famille', 4, 100, 'familial.jpg')
  ];

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [ApiService]
    });

    service = TestBed.inject(ApiService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify(); // Vérifie qu’aucune requête HTTP n’est restée en attente
    localStorage.clear(); // Important pour éviter les effets de bord
  });

  it('should get offers (getOffers)', () => {
    service.getOffers().subscribe(response => {
      expect(response).toEqual(mockOffers);
      expect(response.length).toBe(2);
    });

    const req = httpMock.expectOne(`${apiUrlTicket}/`); // L'URL doit être exactement la même
    expect(req.request.method).toBe('GET'); // Vérifie que la méthode est bien GET
    req.flush(mockOffers); // Répond avec mockOffers
  });

  it('should handle 404 error when getting offers (getOffers)', () => {
    const errorMessage = 'Not Found';
  
    service.getOffers().subscribe(
      () => fail('expected an error, not offers'),
      (error) => {
        expect(error.status).toBe(404);
        expect(error.error).toBe(errorMessage);
      }
    );
  
    const req = httpMock.expectOne(`${apiUrlTicket}/`);
    expect(req.request.method).toBe('GET');
    req.flush(errorMessage, { status: 404, statusText: 'Not Found' });
  });

  it('should create an offer (createOffer)', () => {
    const newOffer: Offer = new Offer('Promo', 'Offre spéciale', 2, 50, 'promo.jpg');
    const mockResponseData = { ...newOffer, offer_id: 1 };  // Données mockées avec offer_id ajouté
  
    const mockResponse = new Offer('', '', 0, 0, '');  // Crée une instance vide de Offer
    mockResponse.loadfromJson(mockResponseData);  // Charge les données dans l'instance de Offer
  
    service.createOffer(newOffer).subscribe(response => {
      expect(response).toEqual(mockResponse);  // Vérifie que la réponse est conforme
      expect(response.offer_id).toBe(1);  // Vérifie que l'offer_id est bien attribué
    });
  
    const req = httpMock.expectOne(`${apiUrlTicket}/`);  // Vérifie l'URL de la requête
    expect(req.request.method).toBe('POST');  // Vérifie que la méthode est POST
    expect(req.request.body).toEqual(newOffer);  // Vérifie que les données envoyées sont correctes
    req.flush(mockResponse);  // Répond avec mockResponse
  });

  it('should return offers from localStorage (getOffersFromCart)', () => {
    const mockCart = [
      { title: 'Solo', nb_people: 1, price: 20 },
      { title: 'Duo', nb_people: 2, price: 35 }
    ];
  
    localStorage.setItem('cart', JSON.stringify(mockCart));
  
    const offersInCart = service.getOffersFromCart();
  
    expect(offersInCart.length).toBe(2);
    expect(offersInCart[0].title).toBe('Solo');
    expect(offersInCart[0].nb_people).toBe(1);
    expect(offersInCart[0].price).toBe(20);
    expect(offersInCart).toEqual([
      jasmine.objectContaining({ title: 'Solo', nb_people: 1, price: 20 }),
      jasmine.objectContaining({ title: 'Duo', nb_people: 2, price: 35 })
    ]);
  });
});