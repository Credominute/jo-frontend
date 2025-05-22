import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
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
  router = inject(Router);

  toggleMenu() {
    this.isMenuOpen = !this.isMenuOpen;
  }

// Déconnexion de l'utilisateur
  logout() {
  this.authService.logoutUser();
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

// Méthode pour accéder à la page admin
  goToAdmin() {
    if (!environment.production || this.isAdmin) {
      this.router.navigate(['/admin']);
    } else {
      console.warn('Accès à la page admin refusé');
    }
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

ngOnDestroy() {
  if (this.authListenerSubs) {
    this.authListenerSubs.unsubscribe();
  }

  if (this.adminListenerSubs) {
    this.adminListenerSubs.unsubscribe();
  }
 }
}