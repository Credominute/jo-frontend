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
      description: "L’élite du skateboard mondial...",
      color: "blue",
      image: "assets/images/sports/skate.jpg"
    },
    {
      name: "Escalade Sportive",
      description: "Les épreuves regroupent trois disciplines...",
      color: "red",
      image: "assets/images/sports/escalade.jpg"
    },
    {
      name: "Surf",
      description: "Les surfeurs effectuent des manœuvres...",
      color: "green",
      image: "assets/images/sports/surf.jpg"
    }
  ];
}