export class Offer {
    offer_id: number | null = null;
    title: string;
    description: string;
    nb_people: number;
    price: number;
    image_url: string;
    visible: boolean = false;

    constructor(title = '', description = '', nb_people = 0, price = 0, image_url = '') {
        this.offer_id = null;
        this.title = title;
        this.description = description;
        this.nb_people = nb_people;
        this.price = price;
        this.image_url = image_url;
        this.visible = false;
    }

    loadfromJson(json: any) {
        Object.assign(this, json);
    }
}

export class OfferInCart {
    title: string;
    nb_people: number;
    price: number;

    constructor(offer : Offer) {
        this.title = offer.title;
        this.nb_people = offer.nb_people;
        this.price = offer.price;
    }
}