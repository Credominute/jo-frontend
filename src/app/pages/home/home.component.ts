import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-home',
  standalone: true,
  templateUrl: './home.component.html',
  styleUrls: ['/src/scss/pages/home.scss'],
  imports: [CommonModule]
})

export class HomeComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {

  }

}