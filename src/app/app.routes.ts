import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { OffersPageComponent } from './pages/offers/offers.component';
import { EventsPageComponent } from './pages/events/events.component';
import { SignLogInComponent } from './pages/sign-log-in/sign-log-in.component';
import { PageNonFoundComponent } from './pages/page-non-found/page-non-found.component';
import { SportsPageComponent } from './pages/sports/sports.component';
import { UnderConstructionComponent } from './pages/under-construction/under-construction.component';
import { ManualPageComponent } from './pages/manual/manual.component';
import { AdminComponent } from './pages/admin/admin.component';
import { AdminOrdersComponent } from './pages/admin-orders/admin-orders.component';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'offers', component: OffersPageComponent },
  { path: 'events', component: EventsPageComponent },
  { path: 'sports', component: SportsPageComponent },
  { path: 'login', component: SignLogInComponent },
  { path: 'manual', component: ManualPageComponent },
  { path: 'admin', component: AdminComponent},
  { path: 'admin-orders', component: AdminOrdersComponent}, // administration des ventes (à venir)
  { path: 'payment', loadComponent: () => import('./pages/payment/payment.component').then(m => m.PaymentComponent) },
  { path: 'under-construction', component: UnderConstructionComponent },
  { path: '**', component: PageNonFoundComponent }
];