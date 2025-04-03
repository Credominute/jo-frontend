import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router'; 
import { HeaderComponent } from './component/header/header.component'; 
import { FooterComponent } from './component/footer/footer.component'; 
import { ModalService } from './services/modal/modal.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, HeaderComponent, FooterComponent], 
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'jo-frontend';

  constructor(protected modalService: ModalService) {}

  // Getter pour accéder à modalService dans les tests
  get modalServiceInstance() {
    return this.modalService;
  }
}
