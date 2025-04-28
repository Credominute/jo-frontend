import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { AuthService } from '../../services/authenticate/auth.service';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-header-user',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './header-user.component.html',
  styleUrl: '/src/scss/components/header-user.scss'
})
export class HeaderUserComponent {
  userIsAuthenticated = false;
  private authListenerSubs: any;

  isAdmin = false;
  private adminListenerSubs: any;

  constructor(private readonly authService: AuthService) {}

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