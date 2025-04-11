import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SportCardComponent } from '../../component/sport-card/sport-card.component';

@Component({
  selector: 'app-events',
  standalone: true,
  imports: [CommonModule, SportCardComponent],
  templateUrl: './sports.component.html',
  styleUrls: ['../../../scss/components/event.scss']
})
export class SportsPageComponent {
  sports = [
    {
      name: "Natation",
      description: "Aux Jeux Olympiques, les épreuves de natation comptent quatre types de nage, en individuel ou en relais : brasse, papillon, dos et nage libre.La variété des distances ne demande pas les mêmes qualités pour une course de 50m que pour un 1500m, l’explosivité tout comme l’endurance, la puissance et la technique sont indispensables pour les nageurs.",
      color: "blue",
      image: "assets/images/sports/natation.jpg"
    },
    {
      name: "Badminton",
      description: "Le badminton arrive aux Jeux en 1972, en tant que sport de démonstration. 20 ans plus tard, ce sport de raquette pratiqué en intérieur est inscrit au programme des Jeux de Barcelone 1992. Dans le nouvel écrin de la Porte de La Chapelle, les meilleurs joueurs du monde s’affronteront dans les 5 tableaux : simple hommes, simple dames, double hommes, double dames et double mixte. La route vers les cinq titres olympiques débutera par une phase de poule et se terminera par des finales à élimination directe. Plus de 200 matchs sont au programme.",
      color: "red",
      image: "assets/images/sports/bad.jpg"
    },
    {
      name: "Athlétisme",
      description: "Avec 48 épreuves, l’athlétisme est le sport individuel qui comporte le plus d’épreuves et de participants aux Jeux du fait de la quantité et de la diversité de ses épreuves. Du sprint au demi-fond, en passant par les concours de sauts et lancers ou encore épreuves combinées… Les épreuves d’athlétisme enflamment les travées du Stade Olympique comme les rues de la ville hôte, qui accueillent traditionnellement les épreuves du marathon et de la marche athlétique. Les Jeux de Paris 2024 seront paritaires et l’athlétisme aussi.",
      color: "green",
      image: "assets/images/sports/athle.jpg"
    }
  ];
}