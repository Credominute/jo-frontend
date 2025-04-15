# Projet Angular - Jeux Olympiques 2024

Ce projet des JO est une application Angular pour un Front (WebJO24). Ce manuel va vous aider à configurer et à exécuter cette application en local.

## 🛠️ Technologies utilisées

- Angular (mode standalone)
- TypeScript
- SCSS
- Karma / Jasmine (tests)
- Netlify (déploiement front-end)
- Alwaysdata (hébergement de l'API Python / FastAPI)

## 📦 Prérequis

Avant de commencer, assurez-vous d'avoir installé les éléments suivants sur votre machine :

- [Node.js](https://nodejs.org/)
- [npm](https://www.npmjs.com/)
- [Angular CLI](https://github.com/angular/angular-cli)

## 🚀 Installation du projet en local

1. Clonez le dépôt :
    ```bash
    git clone https://github.com/Credominute/jo-frontend.git
    cd votre-repository
    ```

2. Installez les dépendances :
    ```bash
    npm install
    ```
    
## 🧪 Exécution en développement

Lancez le serveur local :
    ```bash
    ng serve
    ```
L'application sera disponible à l'adresse suivante : http://localhost:4200


## 🌐 Exécution en production

Pour exécuter Angular avec l’API hébergée sur Alwaysdata, lancez :
    ```bash
    ng serve --configuration=production
    ```

## ✅ Exécuter les tests unitaires

Pour lancer les tests unitaires avec Karma, avec la couverture :

```bash
ng test --code-coverage
```

## 📁 Structure du projet

L'arborescence principale du projet est organisée comme suit :
src/
├── app/
│   ├── component/             # Composants réutilisables (ex: offer, shopping-cart-item, etc.)
│   ├── pages/                  # Pages principales (ex: offers, sign-log-in, events, etc.)
│   ├── services/               # Services Angular pour communication API (auth, offers, orders, etc.)
│   ├── models/                 # Modèles de données TypeScript (User, Offer, Order, etc.)
│   └── app.config.ts           # Configuration du routeur Angular en standalone (pas de modules)
├── assets/                     # Ressources statiques (images, styles globaux, etc.)
├── environments/               # Fichiers de configuration dev/prod (pas de preprod)
├── styles.scss                 # Feuille de style globale (on aurait pu rassembler les tests également)

## ☁️ Déploiement sur Netlify

Branche dev : pour le livrable intermédiaire (rendu du 24 avril)
Branche main : pour le déploiement final stable (rendu du 24 mai)

## 📚 Resources supplémentaires

Il peut être utile aussi d'avoir un rapport de couverture global avec l'instruction :

```bash
coverage/jo-frontend/index.html
```
Enfin, une aide documentatire sur Angular CLI à :
   Utilisez `ng help` ou visiter la page (en anglais) [Angular CLI Overview and Command Reference](https://angular.io/cli)

