import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app.component';
import { provideHttpClient } from '@angular/common/http';
import { provideRouter } from '@angular/router'; // Pour ajouter les routes
import { routes } from './app/app.routes';

bootstrapApplication(AppComponent, {
  providers: [
  provideHttpClient(), // Fournir HttpClient au niveau global
  provideRouter(routes),    // Ajouter les routes (ajuster selon les besoins)
  ]
})
  .catch((err) => console.error(err));
