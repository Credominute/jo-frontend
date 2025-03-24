export class Order {
    name: string;
    date_time: string;
    ticket: { qrcode: string, last_name: string, first_name: string, nb_places: number };
    details: any[];

    constructor(name = '', date_time = new Date().toUTCString(), ticket = {qrcode:'',last_name:'',first_name:'',nb_places:0}, details = []) {
        this.name = name;
        this.date_time = date_time;
        this.ticket = ticket;
        this.details = details;
    }

    loadfromJson(json: any) {
        Object.assign(this, json);
    }
}