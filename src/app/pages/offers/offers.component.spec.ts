import { ComponentFixture, TestBed } from '@angular/core/testing';
import { OffersPageComponent } from './offers.component';
import { OffersService } from '../../services/offers/offers.service';
import { of } from 'rxjs';
import { Offer } from '../../models/offer.model';

import { ModalService } from '../../services/modal/modal.service';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { OfferComponent } from '../../component/offer/offer.component';
import { ShoppingCartComponent } from '../../component/shopping-cart/shopping-cart.component';
import { throwError } from 'rxjs';
import { ShoppingCartItem } from '../../models/shoppingCartItem.model';

describe('OffersPageComponent', () => {
  let component: OffersPageComponent;
  let fixture: ComponentFixture<OffersPageComponent>;
  let mockOffersService: jasmine.SpyObj<OffersService>;

  beforeEach(async () => {
    localStorage.clear();
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

  it('should handle error when fetching offers', () => {
    const errorResponse = new Error('Erreur de récupération des offres');
    mockOffersService.getAllVisible.and.returnValue(throwError(() => errorResponse));  // Simuler une erreur observable
    
    spyOn(console, 'error');  // Espionner la méthode console.error pour vérifier qu'elle est appelée
    
    component.ngOnInit();  // Appel de la méthode ngOnInit
    
    expect(console.error).toHaveBeenCalledWith(errorResponse);  // Vérifie que l'erreur a bien été loggée
  });

  it('should remove an item from the itemsArray', () => {
    // Ajout d'un élément dans le panier
    const choice = new ShoppingCartItem(
      new Offer('Offre 1', 'Description', 2, 100, 'url'), 
      1
    );
    component.addChoice(choice);
  
    // Vérifie qu'il y a bien un élément dans le panier avant suppression
    expect(component.itemsArray.length).toBe(1);
  
    // Suppression de l'élément
    component.removeItem(choice);
  
    // Vérifie qu'il n'y a plus d'éléments après suppression
    expect(component.itemsArray.length).toBe(0);
  });

  it('should increment the quantity of an item if it already exists in the cart', () => {
    const choice = new ShoppingCartItem(
      new Offer('Offre 1', 'Description', 2, 100, 'url'),
      1
    );
    component.addChoice(choice);  // Ajout initial
    
    expect(component.itemsArray.length).toBe(1);
    expect(component.itemsArray[0].quantity).toBe(1);  // Vérifier la quantité
    
    component.addChoice(choice);  // Ajout à nouveau
    
    expect(component.itemsArray[0].quantity).toBe(2);  // La quantité devrait être incrémentée
  });

  it('should empty the cart when emptyCart is called', () => {
    const choice = new ShoppingCartItem(
      new Offer('Offre 1', 'Description', 2, 100, 'url'),
      1
    );
    component.addChoice(choice);  // Ajout d'un élément
    
    expect(component.itemsArray.length).toBe(1);  // Vérifier l'élément ajouté
    
    component.emptyCart();  // Vider le panier
    
    expect(component.itemsArray.length).toBe(0);  // Le panier devrait être vide
  });

  it('should open the login modal if no access_token is present during checkout', () => {
    localStorage.removeItem('access_token');  // Simuler l'absence du token
    
    spyOn(component.modalServiceGetter, 'open');  // Utilisation du getter pour espionner la méthode open
    
    component.checkout();
    
    expect(component.modalServiceGetter.open).toHaveBeenCalledWith('login');  // Vérifie que le modal a bien été ouvert
  });

});