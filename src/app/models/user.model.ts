export class User {
    user_id: number | null = null;
    email: string;
    firstName: string;
    lastName: string;
    phone: string;
    role_names: string[];

    constructor(email = '', firstName = '', lastName = '', phone = '', role_names = ['user']) {
        this.user_id = null;   
        this.email = email;
        this.firstName = firstName;
        this.lastName = lastName;
        this.phone = phone;
        this.role_names = role_names;
    }

    loadfromJson(json: any) {
        Object.assign(this, json);
    }
}