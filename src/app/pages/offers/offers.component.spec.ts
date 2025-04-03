import { ComponentFixture, TestBed } from '@angular/core/testing';
import { OffersPageComponent } from './offers.component';
import { OffersService } from '../../services/offers/offers.service';
import { of } from 'rxjs';
import { Offer } from '../../models/offer.model';

describe('OffersPageComponent', () => {
  let component: OffersPageComponent;
  let fixture: ComponentFixture<OffersPageComponent>;
  let mockOffersService: jasmine.SpyObj<OffersService>;

  beforeEach(async () => {
    // Création du spy pour OffersService
    mockOffersService = jasmine.createSpyObj('OffersService', ['getAllVisible']);
    
    // Mocker la méthode getAllVisible pour qu'elle retourne un observable avec des objets Offer
    mockOffersService.getAllVisible.and.returnValue(of([
      new Offer('Offre 1', 'Description de l\'offre 1', 2, 100, 'image_url_1'),
      new Offer('Offre 2', 'Description de l\'offre 2', 4, 200, 'image_url_2')
    ]));

    await TestBed.configureTestingModule({
      imports: [OffersPageComponent],  // Assurer que la configuration du composant est simple et isolée
      providers: [
        { provide: OffersService, useValue: mockOffersService }  // Utiliser le mock pour OffersService
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OffersPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();  // Vérifie que le composant est créé avec succès
  });

  it('should fetch offers from the service and populate offersArray', () => {
    component.ngOnInit();  // Appel de la méthode ngOnInit
    expect(mockOffersService.getAllVisible).toHaveBeenCalled();  // Vérifie que la méthode a bien été appelée
    expect(component.offersArray.length).toBe(2);  // Vérifie qu'il y a bien 2 offres dans le tableau
    expect(component.offersArray[0].title).toBe('Offre 1');  // Vérifie que la première offre a le bon titre
  });
});