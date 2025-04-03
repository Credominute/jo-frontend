import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { OffersPageComponent } from './pages/offers/offers.component';
// import { OthersPageComponent } from './pages/others/others.component';
// import { ContactPageComponent } from './pages/contact/contact.component';
// import { LegalNoticePageComponent } from './pages/legal-notice/legal-notice.component';


export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'offers', component: OffersPageComponent },
 // { path: 'others', component: OthersPageComponent },
 // { path: 'contact', component: ContactPageComponent }, 
 // { path: 'legal-notice', component: LegalNoticePageComponent },
  { path: '**', redirectTo: '' },
];