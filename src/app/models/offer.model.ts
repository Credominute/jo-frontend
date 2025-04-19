export class Offer {
    offer_id: number | null = null;
    title: string;
    description: string;
    nb_people: number;
    price: number;
    image_url: string;
    visible: boolean = false;
    ticket_type: string;

    constructor(
        title = '', 
        description = '', 
        nb_people = 0, 
        price = 0, 
        image_url = '', 
        ticket_type: 'single' | 'duo' | 'familial' = 'single'
    ) {
        this.offer_id = null;
        this.title = title;
        this.description = description;
        this.nb_people = nb_people;
        this.price = price;
        this.image_url = image_url;
        this.visible = false;
        this.ticket_type = ticket_type;
    }

    loadfromJson(json: any) {
        Object.assign(this, json);
    }
}

export class OfferInCart {
    offer_id: number | null;
    title: string;
    description: string;
    nb_people: number;
    price: number;
    quantity: number;
    image_url: string;  
    visible: boolean;   
    ticket_type: 'single' | 'duo' | 'familial';

    constructor(offer: Offer, quantity: number) {
        this.offer_id = offer.offer_id; // Ajout de l'ID de l'offre
        this.title = offer.title;
        this.description = offer.description; // Ajout de la description
        this.nb_people = offer.nb_people;
        this.price = offer.price;
        this.quantity = quantity;
        this.image_url = offer.image_url; // Assurer que l'image est bien prise de l'Offer
        this.visible = offer.visible;     // Assurer que la visibilité est bien prise de l'Offer
        const allowedTypes = ['single', 'duo', 'familial'] as const;
        if (allowedTypes.includes(offer.ticket_type as any)) {
        this.ticket_type = offer.ticket_type as 'single' | 'duo' | 'familial';
        } else {
        this.ticket_type = 'single'; // fallback par défaut
        }
    }

    loadfromJson(json: any) {
        Object.assign(this, json); // Conserver la méthode loadfromJson
    }
}