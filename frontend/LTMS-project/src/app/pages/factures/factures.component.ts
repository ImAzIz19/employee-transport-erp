import { Component } from '@angular/core';
import { NavBarComponent } from "../../components/nav-bar/nav-bar.component";
import { FacturesExporterComponent } from "../../components/factures-exporter/factures-exporter.component";

@Component({
  selector: 'app-factures',
  imports: [NavBarComponent, FacturesExporterComponent],
  templateUrl: './factures.component.html',
  styleUrl: './factures.component.css'
})
export class FacturesComponent {

}
