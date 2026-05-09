// planning-download-dialog.component.ts
import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { TranslateService } from '@ngx-translate/core';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-planning-download-dialog',
  templateUrl: './planning-download-dialog.component.html',
  styleUrls: ['./planning-download-dialog.component.css'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    TranslateModule
  ]
})
export class PlanningDownloadDialogComponent {
  // Form fields
  selectedDownloadType: string = '';
  selectedYear: number | null = null;
  selectedMonth: number | null = null;
  selectedAgency: string = '';
  selectedCircuit: string = '';
  showCircuitSelection: boolean = false;

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

  agencies = [
    { id: '1', name: 'Agence Paris' },
    { id: '2', name: 'Agence Lyon' },
    { id: '3', name: 'Agence Marseille' },
    { id: '4', name: 'Agence Toulouse' }
  ];

  isLoading: boolean = false;
  errorMessage: string | null = null;


  constructor(
    public dialogRef: MatDialogRef<PlanningDownloadDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private translate: TranslateService
  ) {}

  validateAndExport(): void {
    this.clearError();
    
    // Basic validation
    if (!this.selectedDownloadType) {
      this.errorMessage = 'SELECT_DOWNLOAD_TYPE_REQUIRED';
      return;
    }

    if (!this.selectedYear) {
      this.errorMessage = 'YEAR_REQUIRED';
      return;
    }

    if (!this.selectedMonth) {
      this.errorMessage = 'MONTH_REQUIRED';
      return;
    }

    if (!this.selectedAgency) {
      this.errorMessage = 'AGENCY_REQUIRED';
      return;
    }

    if (this.showCircuitSelection && !this.selectedCircuit) {
      this.errorMessage = 'CIRCUIT_REQUIRED';
      return;
    }

    this.isLoading = true;
    
    try {
      // Simulate API call
      setTimeout(() => {
        this.isLoading = false;
        const exportData = {
          type: this.selectedDownloadType,
          year: this.selectedYear,
          month: this.selectedMonth,
          monthName: this.months.find(m => m.value === this.selectedMonth)?.name,
          agency: this.selectedAgency,
          circuit: this.selectedCircuit
        };
        
        console.log('Exporting planning data:', exportData);
        this.dialogRef.close(exportData);
      }, 1500);
    } catch (error) {
      this.isLoading = false;
      this.errorMessage = 'EXPORT_FAILED';
      console.error('Export error:', error);
    }
  }

  clearError(): void {
    this.errorMessage = null;
  }

  // Other methods remain the same...
}