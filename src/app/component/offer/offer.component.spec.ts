import { ComponentFixture, TestBed } from '@angular/core/testing';
import { OfferComponent } from './offer.component';
import { Offer, OfferInCart } from '../../models/offer.model';
import { By } from '@angular/platform-browser';

describe('OfferComponent', () => {
  let component: OfferComponent;
  let fixture: ComponentFixture<OfferComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OfferComponent],  // Assurez-vous que l'import est correctement configuré pour un composant standalone
    }).compileComponents();

    fixture = TestBed.createComponent(OfferComponent);
    component = fixture.componentInstance;

    // Initialisation d'un mock d'Offer pour simuler un objet de test
    const mockOffer = new Offer();
    mockOffer.title = 'Offre Duo';
    mockOffer.price = 50;
    mockOffer.image_url = 'test.jpg';
    mockOffer.nb_people = 2;
    mockOffer.visible = true; // Assurez-vous que 'visible' est défini

    // Assigner l'offer mocké au composant
    component.offer = mockOffer;

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should emit an OfferInCart instance when choose() is called', () => {
    const spy = spyOn(component.selected, 'emit');
  
    const mockOffer = new Offer('Offre Duo', 'Desc', 2, 50, 'test.jpg');
    mockOffer.offer_id = 1;
    mockOffer.visible = true;
  
    component.offer = mockOffer;
    fixture.detectChanges();
  
    component.choose();
  
    expect(spy).toHaveBeenCalledWith(jasmine.any(OfferInCart));
  });

  it('should display offer title and price', () => {
    const mockOffer = new Offer();
    mockOffer.title = 'Offre Duo';
    mockOffer.price = 50;
    mockOffer.image_url = 'test.jpg';
    mockOffer.nb_people = 2;
    mockOffer.visible = true; // Toujours définir 'visible'
    component.offer = mockOffer;
    fixture.detectChanges();

    const title = fixture.debugElement.query(By.css('h4')).nativeElement;
    const price = fixture.debugElement.query(By.css('.price')).nativeElement;
    const img = fixture.debugElement.query(By.css('img')).nativeElement;

    expect(title.textContent).toContain('Offre Duo');
    expect(price.textContent).toContain('50');
    expect(img.src).toContain('test.jpg');
  });
});