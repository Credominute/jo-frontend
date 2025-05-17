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
    this.authService.loginMock('admin').subscribe();
  }

  toggleMenu() {
    this.isMenuOpen = !this.isMenuOpen;
  }

// logout the user
  logout() {
  this.authService.logoutUser();
  }

  ngOnInit() {
  // Vérifie si l'utilisateur est authentifié  
  this.userIsAuthenticated = this.authService.getIsAuthenticated;

  // Écoute l'état d'authentification
  this.authListenerSubs = this.authService.getStatusAuthListener.subscribe((isAuthenticated: boolean) => {
    this.userIsAuthenticated = isAuthenticated;
  });

  // Vérifie si l'utilisateur est admin
  this.isAdmin = this.authService.getIsAdmin;

  // Écoute l'état d'authentification admin
  this.adminListenerSubs = this.authService.getAdminAuthListener.subscribe((isAdmin: boolean) => {
    this.isAdmin = isAdmin;
  });
}

// Vérifie la visibilité du bouton admin
  isAdminVisible(): boolean {
    // En développement, toujours afficher
    if (!environment.production) {
      return true;
    }
    // En production, afficher uniquement si l'utilisateur est admin
    return this.isAdmin;
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