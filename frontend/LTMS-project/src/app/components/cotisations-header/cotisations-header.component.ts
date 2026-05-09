import { Component } from '@angular/core';
import { CotisationsFilterComponent } from "../cotisations-filter/cotisations-filter.component";

@Component({
  selector: 'app-cotisations-header',
  imports: [CotisationsFilterComponent],
  templateUrl: './cotisations-header.component.html',
  styleUrl: './cotisations-header.component.css'
})
export class CotisationsHeaderComponent {

}
