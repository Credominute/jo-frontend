import { Component } from '@angular/core';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrl: './header.component.css',
})
export class HeaderComponent {
  isMenuOpen = false;
  userIsAuthenticated = false;
  private authListenerSubs: any;

  isAdmin = false;
  private adminListenerSubs: any;


  toggleMenu() {
    this.isMenuOpen = !this.isMenuOpen;
  }
}