import { Offer } from '../models/offer.model';

export const OFFERS: Offer[] = [
  {
    offer_id: 1,
    title: 'Solo',
    description: 'Une place pour un spectateur unique',
    nb_people: 1,
    price: 50,
    image_url: 'assets/solo.png',
    visible: true,
    ticket_type: 'single',
    loadfromJson: (json: any) => Object.assign(new Offer(), json),
  },
  {
    offer_id: 2,
    title: 'Duo',
    description: 'Deux places pour un couple ou des amis',
    nb_people: 2,
    price: 90,
    image_url: 'assets/duo.png',
    visible: true,
    ticket_type: 'duo',
    loadfromJson: (json: any) => Object.assign(new Offer(), json),
  },
  {
    offer_id: 3,
    title: 'Familial',
    description: 'Quatre places pour une famille ou un groupe',
    nb_people: 4,
    price: 149.99,
    image_url: 'assets/familial.png',
    visible: true,
    ticket_type: 'familial',
    loadfromJson: (json: any) => Object.assign(new Offer(), json),
  }
];
