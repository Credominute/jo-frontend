import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-home',
  standalone: true,
  templateUrl: './home.component.html',
  styleUrls: ['../../../scss/pages/home.scss'],
  imports: [CommonModule, RouterLink]
})

export class HomeComponent implements OnInit {

  constructor() { }

  ngOnInit(): void 
  {
  //Initialisation future
    }
}