import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { AuthService } from '../../services/authenticate/auth.service';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-header-admin',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './header-admin.component.html',
  styleUrls: ['../../../scss/components/header-admin.scss'],
})
export class HeaderAdminComponent {
  userIsAuthenticated = false;
  isAdmin = false;
  private authListenerSubs: any;
  private adminListenerSubs: any;

  isCRUD = false;

  constructor(private readonly authService: AuthService, private readonly router: Router) {}

  ngOnInit() {
    this.userIsAuthenticated = this.authService.getIsAuthenticated;
    this.isAdmin = this.authService.getIsAdmin;
    // listen to the status of the authentication
    this.authListenerSubs = this.authService.getStatusAuthListener.subscribe((isAuthenticated: boolean) => {
      this.userIsAuthenticated = isAuthenticated;
    });

    // listen to the status of the authentication
    this.adminListenerSubs = this.authService.getAdminAuthListener.subscribe((isAdmin: boolean) => {
      this.isAdmin = isAdmin;
    });
  }

  ngOnDestroy() {
    this.authListenerSubs.unsubscribe();
    this.adminListenerSubs.unsubscribe();
  }

  logout() {
    this.authService.logoutUser();
  }

  toggle() {
    if (this.isCRUD) {
      this.router.navigate(['/admin']);
    } else {
      this.router.navigate(['/admin/offers']);
    }

    this.isCRUD = !this.isCRUD;
  }
}
