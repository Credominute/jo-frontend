import { OfferInCart } from './offer.model';


export class ShoppingCartItem {
    offer!: OfferInCart;
    quantity: number = 0;

    constructor(offer: OfferInCart, quantity: number) {
        this.offer = offer;
        this.quantity = quantity;
    }

    addItemQtyStorage(quantity: number) {
        let itemsArray = localStorage.getItem('cart') ? JSON.parse(localStorage.getItem('cart')!) : [];
        let itemCart = itemsArray.find((item: { offer: { title: string; }; }) => item.offer.title === this.offer.title);
        if (itemCart) {
            itemCart.quantity += quantity;
        } else {
            itemsArray.push({ offer: this.offer, quantity: quantity });
        }

        localStorage.setItem('cart', JSON.stringify(itemsArray));
    }

    removeItemQtyStorage(quantity: number) {
        let itemsArray = localStorage.getItem('cart') ? JSON.parse(localStorage.getItem('cart')!) : [];
        let itemCart = itemsArray.find((item: { offer: { title: string; }; }) => item.offer.title === this.offer.title);
        if (itemCart) {
            let newQuantity = itemCart.quantity - quantity;
            if(newQuantity > 0) {
                itemCart.quantity = newQuantity;
            } else {
                itemsArray = itemsArray.filter((item: { offer: { title: string; }; }) => item.offer.title !== this.offer.title);
            }
        }

        localStorage.setItem('cart', JSON.stringify(itemsArray));
    }

}