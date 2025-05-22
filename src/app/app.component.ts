import { Component } from '@angular/core';
import { RouterOutlet, RouterModule } from '@angular/router'; 
import { HeaderComponent } from './component/header/header.component'; 
import { FooterComponent } from './component/footer/footer.component'; 
import { ModalService } from './services/modal/modal.service';
import { environment } from '../environments/environment';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterModule, HeaderComponent, FooterComponent ], 
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'jo-frontend';
  
  constructor(protected modalService: ModalService) {
  console.log('ENV:', environment); // Affiche les valeurs d’environnement dans la console du navigateur
  }


  // Getter pour accéder à modalService dans les tests
  get modalServiceInstance() {
    return this.modalService;
  }
}