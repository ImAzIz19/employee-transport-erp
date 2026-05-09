// historique-recap-dialog.component.ts
import { CommonModule } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatNativeDateModule } from '@angular/material/core';

@Component({
  selector: 'app-historique-recap-dialog',
  templateUrl: './historique-recap-dialog.component.html',
  styleUrls: ['./historique-recap-dialog.component.css'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    TranslateModule,
    MatDatepickerModule,
    MatInputModule,
    MatFormFieldModule,
    MatNativeDateModule
  ]
})
export class HistoriqueRecapDialogComponent {
  startDate: Date | null = null;
  endDate: Date | null = null;
  selectedAgency: string = '';
  
  agencies = [
    { id: '1', name: 'Agence Paris' },
    { id: '2', name: 'Agence Lyon' },
    { id: '3', name: 'Agence Marseille' },
    { id: '4', name: 'Agence Toulouse' }
  ];

  constructor(
    public dialogRef: MatDialogRef<HistoriqueRecapDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private translate: TranslateService
  ) {}

  validateDates(): void {
    if (this.startDate && this.endDate && this.startDate > this.endDate) {
      this.endDate = null;
    }
  }

  isFormValid(): boolean {
    return !!this.startDate && !!this.endDate && !!this.selectedAgency;
  }

  exportData(): void {
    const exportData = {
      startDate: this.startDate,
      endDate: this.endDate,
      agency: this.selectedAgency
    };
    this.dialogRef.close(exportData);
  }
}