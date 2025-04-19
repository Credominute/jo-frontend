export class User {
    user_id: number | null = null;
    mail: string;
    prenom: string;
    nom: string;
    telephone: string;
    role_names: string[];

    constructor(
        mail = '', 
        prenom = '', 
        nom = '', 
        telephone = '', 
        role_names = ['user']
    ) {
        this.user_id = null;   
        this.mail = mail;
        this.prenom = prenom;
        this.nom = nom;
        this.telephone = telephone;
        this.role_names = role_names;
    }

    loadfromJson(json: any) {
        Object.assign(this, json);
    }
}