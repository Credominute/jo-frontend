import { Component, inject } from '@angular/core';
import { ModalService } from '../../services/modal/modal.service';
import { AuthService } from '../../services/authenticate/auth.service';
import { CommonModule } from '@angular/common';


@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './header.component.html',
  styleUrls: ['/src/scss/component/header.scss'],
})
export class HeaderComponent {
  isMenuOpen = false;
  modalService = inject(ModalService);
  authService = inject(AuthService);
  userIsAuthenticated = false;
  private authListenerSubs: any;

  isAdmin = false;
  private adminListenerSubs: any;


  toggleMenu() {
    this.isMenuOpen = !this.isMenuOpen;
  }

// logout the user
  logout() {
  this.authService.logoutUser();
  }

  login() {
  this.modalService.open('login');
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
    this.authListenerSubs.unsubscribe();
  }
}