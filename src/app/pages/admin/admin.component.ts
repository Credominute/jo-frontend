import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderAdminComponent } from '../../component/header-admin/header-admin.component';

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [CommonModule, HeaderAdminComponent],
  templateUrl: './admin.component.html',
  styleUrls: ['../../../scss/pages/admin.scss'],
})
export class AdminComponent {

}
