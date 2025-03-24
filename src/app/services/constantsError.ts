export class ErrorTranslation {
    static readonly errorMessageValidators = {
        email: {
        required: "L'email est requis",
        email: "L'email n'est pas alide",
        },
        password: {
        required: 'Mot de passe requis',
        pattern: "Le mot de passe doit contenir au moins 8 caractères alphanumériques, dont au moins une lettre majuscule, une lettre minuscule, un chiffre et un caractère spécial.",
        },
        firstName: {
        required: 'Le prénom est requis'
        },
        lastName: {
        required: 'Le nom est requis'
        },
        phone: {
        required: 'Le numéro de éléphone est requis',
        pattern: "Le numéto de téléphone n'est pas valide",
        }
    };

    static readonly errorMessageServer = new Map([
        ["Invalid password for this email", "Mot de passe incorrect pour cet email"],
    ]);

}