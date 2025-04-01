import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { OffersPageComponent } from './pages/offers/offers.component';
import { EventsPageComponent } from './pages/events/events.component';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'offers', component: OffersPageComponent },
  { path: 'events', component: EventsPageComponent },
  { path: '**', redirectTo: '' },
];