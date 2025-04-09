import { ShoppingCartItem } from './shoppingCartItem.model';
import { Offer } from './offer.model';
import { OfferInCart } from './offer.model';

describe('ShoppingCartItem model', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('should create a ShoppingCartItem with provided offer and quantity', () => {
    const offer = new Offer('Titre', 'Desc', 3, 45, 'url');
    const item = new ShoppingCartItem(new OfferInCart(offer), 2);
    expect(item.offer.title).toBe('Titre');
    expect(item.quantity).toBe(2);
  });

  it('should add item to localStorage correctly', () => {
    const offer = new Offer('Offre test', 'Desc', 1, 10, 'url');
    const item = new ShoppingCartItem(new OfferInCart(offer), 1);
    item.addItemQtyStorage(1);

    const stored = JSON.parse(localStorage.getItem('cart')!);
    expect(stored.length).toBe(1);
    expect(stored[0].offer.title).toBe('Offre test');
    expect(stored[0].quantity).toBe(1);
  });

  it('should increment quantity in localStorage if item exists', () => {
    const offer = new Offer('Offre existante', 'Desc', 1, 10, 'url');
    const item = new ShoppingCartItem(new OfferInCart(offer), 1);
    item.addItemQtyStorage(1);
    item.addItemQtyStorage(2);

    const stored = JSON.parse(localStorage.getItem('cart')!);
    expect(stored[0].quantity).toBe(3);
  });

  it('should remove quantity from localStorage or delete item if zero', () => {
    const offer = new Offer('Offre à supprimer', 'Desc', 1, 10, 'url');
    const item = new ShoppingCartItem(new OfferInCart(offer), 1);
    item.addItemQtyStorage(3);  // total = 3
    item.removeItemQtyStorage(2); // reste 1

    let stored = JSON.parse(localStorage.getItem('cart')!);
    expect(stored[0].quantity).toBe(1);

    item.removeItemQtyStorage(1); // supprime entièrement
    stored = JSON.parse(localStorage.getItem('cart')!);
    expect(stored.length).toBe(0);
  });
});
