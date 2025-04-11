import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SportCardComponent } from '../../component/sport-card/sport-card.component';

@Component({
  selector: 'app-events',
  standalone: true,
  imports: [CommonModule, SportCardComponent],
  templateUrl: './events.component.html',
  styleUrls: ['../../../scss/components/event.scss']
})
export class EventsPageComponent {
  sports = [
    {
      name: "Skateboard",
      description: "L’élite du skateboard mondial s’affrontera aux Jeux Olympiques dans deux des disciplines les plus populaires et spectaculaires du skateboard, le Park et le Street, où les athlètes devront réaliser les plus beaux tricks, répondant à des critères de technique, de vitesse ou encore d’amplitude de leurs figures.",
      color: "blue",
      image: "assets/images/sports/skate.jpg"
    },
    {
      name: "Escalade Sportive",
      description: "Au programme olympique de l’escalade sportive, les épreuves regroupent trois disciplines, le bloc, la vitesse et la difficulté. Le « bloc » consiste à escalader des structures de 4,5m de hauteur, sans corde mais avec des tapis de réception, dans un temps contraint et avec le moins de tentatives possibles.",
      color: "red",
      image: "assets/images/sports/escalade.jpg"
    },
    {
      name: "Surf",
      description: "Les surfeurs effectuent des manœuvres et des figures sur une vague, et sont ensuite notés par cinq juges en fonction de la variété de leur enchaînement, du type de figures réalisées et de leur difficulté. La vitesse, la puissance et le flow des surfeurs entrent également en ligne de compte dans les notes délivrées par les juges.",
      color: "green",
      image: "assets/images/sports/surf.jpg"
    }
  ];
}