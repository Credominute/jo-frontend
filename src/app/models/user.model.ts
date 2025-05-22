export class User {
    user_id: number | null = null;
    mail: string;
    prenom: string;
    nom: string;
    telephone: string;
    role: string[] = ['user'];

    constructor(
        mail = '', 
        prenom = '', 
        nom = '', 
        telephone = '', 
        role = 'user'
    ) {
        this.user_id = null;   
        this.mail = mail;
        this.prenom = prenom;
        this.nom = nom;
        this.telephone = telephone;
    }

    loadfromJson(json: any) {
        this.role = json.role ?? ['user'];
        Object.assign(this, json);
    }
}