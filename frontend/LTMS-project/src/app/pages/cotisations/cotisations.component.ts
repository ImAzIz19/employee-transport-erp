import { Component } from '@angular/core';
import { CotisationsHeaderComponent } from "../../components/cotisations-header/cotisations-header.component";
import { NavBarComponent } from "../../components/nav-bar/nav-bar.component";

@Component({
  selector: 'app-cotisations',
  imports: [CotisationsHeaderComponent, NavBarComponent],
  templateUrl: './cotisations.component.html',
  styleUrl: './cotisations.component.css'
})
export class CotisationsComponent {

}
