import { Offer } from './offer.model';

describe('Offer model', () => {
  it('should create an Offer with default values', () => {
    const offer = new Offer();
    expect(offer.offer_id).toBeNull();
    expect(offer.title).toBe('');
    expect(offer.description).toBe('');
    expect(offer.nb_people).toBe(0);
    expect(offer.price).toBe(0);
    expect(offer.image_url).toBe('');
    expect(offer.visible).toBe(false);
  });

  it('should assign values from JSON correctly', () => {
    const json = {
      offer_id: 1,
      title: 'Pack Duo',
      description: 'Entrées pour deux',
      nb_people: 2,
      price: 29.99,
      image_url: 'https://img.com/img.png',
      visible: true
    };
    const offer = new Offer();
    offer.loadfromJson(json);
    expect(offer.offer_id).toBe(1);
    expect(offer.title).toBe('Pack Duo');
    expect(offer.visible).toBe(true);
  });

  it('should preserve default values if JSON is partial', () => {
    const json = { title: 'Titre partiel' };
    const offer = new Offer();
    offer.loadfromJson(json);
    expect(offer.title).toBe('Titre partiel');
    expect(offer.nb_people).toBe(0); // reste par défaut
  });
});
