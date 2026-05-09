// shuttles-dashboard-dialog.component.ts
import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { TranslateService } from '@ngx-translate/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-shuttles-dashboard-dialog',
  templateUrl: './shuttles-dashboard-dialog.component.html',
  styleUrls: ['./shuttles-dashboard-dialog.component.css'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    TranslateModule
  ]
})
export class ShuttlesDashboardDialogComponent {
  selectedAgency: string = '';
  selectedYear: number = new Date().getFullYear();
  selectedMonth: number = new Date().getMonth() + 1;

  agencies = [
    { id: '1', name: 'Agence Paris' },
    { id: '2', name: 'Agence Lyon' },
    { id: '3', name: 'Agence Marseille' },
    { id: '4', name: 'Agence Toulouse' }
  ];

  years = Array.from({length: 5}, (_, i) => new Date().getFullYear() + i);
  
  months = [
    { value: 1, name: 'JANUARY' },
    { value: 2, name: 'FEBRUARY' },
    { value: 3, name: 'MARCH' },
    { value: 4, name: 'APRIL' },
    { value: 5, name: 'MAY' },
    { value: 6, name: 'JUNE' },
    { value: 7, name: 'JULY' },
    { value: 8, name: 'AUGUST' },
    { value: 9, name: 'SEPTEMBER' },
    { value: 10, name: 'OCTOBER' },
    { value: 11, name: 'NOVEMBER' },
    { value: 12, name: 'DECEMBER' }
  ];

  constructor(
    public dialogRef: MatDialogRef<ShuttlesDashboardDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private translate: TranslateService
  ) {}

  isFormValid(): boolean {
    return !!this.selectedAgency && !!this.selectedYear && !!this.selectedMonth;
  }

  exportData(): void {
    const exportData = {
      agency: this.selectedAgency,
      year: this.selectedYear,
      month: this.selectedMonth,
      monthName: this.months.find(m => m.value === this.selectedMonth)?.name
    };
    
    console.log('Exporting shuttle data:', exportData);
    this.dialogRef.close(exportData);
  }
}