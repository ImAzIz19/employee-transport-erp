import { Component } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { Agency } from '../../interface/agency/agency';
import { FacturesExporterDataComponent } from "../factures-exporter-data/factures-exporter-data.component";

@Component({
  selector: 'app-factures-exporter',
  imports: [TranslateModule,FacturesExporterDataComponent],
  templateUrl: './factures-exporter.component.html',
  styleUrl: './factures-exporter.component.css'
})
export class FacturesExporterComponent {
 

}
