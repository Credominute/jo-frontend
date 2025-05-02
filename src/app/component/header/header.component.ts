import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ModalService } from '../../services/modal/modal.service';
import { AuthService } from '../../services/authenticate/auth.service';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './header.component.html',
  styleUrls: ['../../../scss/components/header.scss'],
})

export class HeaderComponent {
  mock = environment.mock;
  isMenuOpen = false;
  modalService = inject(ModalService);
  authService = inject(AuthService);
  userIsAuthenticated = false;
  private authListenerSubs: any;
  isAdmin = false;
  private adminListenerSubs: any;

  mockLoginAdmin() {
    this.authService.mockLoginAsAdmin().subscribe();
  }

  toggleMenu() {
    this.isMenuOpen = !this.isMenuOpen;
  }

// logout the user
  logout() {
  this.authService.logoutUser();
  }

  ngOnInit() {
  this.userIsAuthenticated = this.authService.getIsAuthenticated;
  // listen to the status of the authentication
  this.authListenerSubs = this.authService.getStatusAuthListener.subscribe((isAuthenticated: boolean) => {
    this.userIsAuthenticated = isAuthenticated;
  });

  this.isAdmin = this.authService.getIsAdmin;
  // listen to the status of the authentication
  this.adminListenerSubs = this.authService.getAdminAuthListener.subscribe((isAdmin: boolean) => {
    this.isAdmin = isAdmin;
  });
}

ngOnDestroy() {
  // Vérification que la subscription existe avant d'essayer de se désabonner
  if (this.authListenerSubs) {
    this.authListenerSubs.unsubscribe();
  }

  if (this.adminListenerSubs) {
    this.adminListenerSubs.unsubscribe();
  }
 }
}