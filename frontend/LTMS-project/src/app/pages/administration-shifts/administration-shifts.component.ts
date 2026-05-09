import { Component } from '@angular/core';
import { AdministrationShiftsHeaderComponent } from "../../components/administration-shifts-header/administration-shifts-header.component";
import { NavBarComponent } from "../../components/nav-bar/nav-bar.component";

@Component({
  selector: 'app-administration-shifts',
  imports: [AdministrationShiftsHeaderComponent, NavBarComponent],
  templateUrl: './administration-shifts.component.html',
  styleUrl: './administration-shifts.component.css'
})
export class AdministrationShiftsComponent {

}
