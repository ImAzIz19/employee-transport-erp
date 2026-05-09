import { Component, ViewChild } from '@angular/core';
import { NavBarComponent } from "../../components/nav-bar/nav-bar.component";
import { UserHeaderComponent } from "../../components/user-header/user-header.component";
@Component({
  selector: 'app-user-management',
  imports: [NavBarComponent, UserHeaderComponent],
  templateUrl: './user-management.component.html',
  styleUrl: './user-management.component.css'
})
export class UserManagementComponent {

}
