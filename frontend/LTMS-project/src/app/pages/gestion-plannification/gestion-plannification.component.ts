import { Component } from '@angular/core';
import { NavBarComponent } from "../../components/nav-bar/nav-bar.component";
import { GestionPlannificationHeaderComponent } from "../../components/gestion-plannification-header/gestion-plannification-header.component";

@Component({
  selector: 'app-gestion-plannification',
  imports: [NavBarComponent, GestionPlannificationHeaderComponent],
  templateUrl: './gestion-plannification.component.html',
  styleUrl: './gestion-plannification.component.css'
})
export class GestionPlannificationComponent {

}
