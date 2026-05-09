import { Component } from '@angular/core';
import { NavBarComponent } from "../../components/nav-bar/nav-bar.component";
import { RoleManagementHeaderComponent } from "../../components/role-management-header/role-management-header.component";

@Component({
  selector: 'app-role-management',
  imports: [NavBarComponent, RoleManagementHeaderComponent],
  templateUrl: './role-management.component.html',
  styleUrl: './role-management.component.css'
})
export class RoleManagementComponent {

}
