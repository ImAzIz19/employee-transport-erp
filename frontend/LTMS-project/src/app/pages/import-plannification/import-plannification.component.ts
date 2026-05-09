import { Component } from '@angular/core';
import { ImportPlannificationHeaderComponent } from '../../components/import-plannification-header/import-plannification-header.component';
import { NavBarComponent } from "../../components/nav-bar/nav-bar.component";

@Component({
  selector: 'app-import-plannification',
  imports: [ImportPlannificationHeaderComponent, NavBarComponent],
  templateUrl: './import-plannification.component.html',
  styleUrl: './import-plannification.component.css'
})
export class ImportPlannificationComponent {

}
