import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config'; 
import { AppComponent } from './app/app.component';
import { provideHttpClient } from '@angular/common/http';
import { provideRouter } from '@angular/router'; // Pour ajouter les routes

bootstrapApplication(AppComponent, {
  providers: [
  provideHttpClient(), // Fournir HttpClient au niveau global
  provideRouter([]),    // Ajouter les routes (ajuste selon tes besoins)
  ]
})
  .catch((err) => console.error(err));
