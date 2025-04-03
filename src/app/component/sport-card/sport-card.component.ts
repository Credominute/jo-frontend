import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-sport-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './sport-card.component.html',
  styleUrls: ['../../../scss/components/sport-card.scss']
})
export class SportCardComponent {
  @Input() invert: boolean = false;
  @Input() color: string = '';
  @Input() image: string = '';
  @Input() name: string = '';
  @Input() description: string = '';
}