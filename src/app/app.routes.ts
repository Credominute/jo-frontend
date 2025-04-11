import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { OffersPageComponent } from './pages/offers/offers.component';
import { EventsPageComponent } from './pages/events/events.component';
import { SignLogInComponent } from './pages/sign-log-in/sign-log-in.component';
import { PageNonFoundComponent } from './pages/page-non-found/page-non-found.component';
import { SportsPageComponent } from './pages/sports/sports.component';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'offers', component: OffersPageComponent },
  { path: 'events', component: EventsPageComponent },
  { path: 'sports', component: SportsPageComponent },
  { path: 'login', component: SignLogInComponent },
  { path: '**', component: PageNonFoundComponent },
 // { path: 'others', component: OthersPageComponent },
 // { path: 'contact', component: ContactPageComponent }, 
 // { path: 'legal-notice', component: LegalNoticePageComponent },
];