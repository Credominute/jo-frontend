import { Component } from '@angular/core';
import { CommonModule, NgOptimizedImage } from '@angular/common';

@Component({
  selector: 'app-page-non-found',
  standalone: true,
  imports: [CommonModule, NgOptimizedImage],
  templateUrl: './page-non-found.component.html',
  styleUrls: ['../../../scss/pages/page-non-found.scss'],
})
export class PageNonFoundComponent {
}
