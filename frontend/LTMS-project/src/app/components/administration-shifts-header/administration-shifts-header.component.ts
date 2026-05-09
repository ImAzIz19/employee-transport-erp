import { Component } from '@angular/core';
import { AdministrationShiftsDataComponent } from "../administration-shifts-data/administration-shifts-data.component";
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { AddNewShiftsComponent } from '../add-new-shifts/add-new-shifts.component';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-administration-shifts-header',
  imports: [AdministrationShiftsDataComponent,TranslateModule],
  templateUrl: './administration-shifts-header.component.html',
  styleUrl: './administration-shifts-header.component.css'
})
export class AdministrationShiftsHeaderComponent {
  errorMessage: string = '';


  constructor(
    private translate: TranslateService,
    private dialog: MatDialog
  ) {}

   openHistoriqueRecap(): void {
      this.dialog.open(AddNewShiftsComponent, {
        width: '400vw',
        maxWidth: '400px',
        data: { 
          title: this.translate.instant('HISTORY_RECAP')
        }
      });
    }
  
}
