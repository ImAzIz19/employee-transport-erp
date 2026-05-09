import { CommonModule } from '@angular/common';
import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators, FormsModule } from '@angular/forms';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { Agency } from '../../interface/agency/agency';
import { AgencyService } from '../../services/agency/agency.service'; // Assuming this service exists
import { BillService } from '../../services/bill/bill.service';
import { parseServerErrorMessage } from '../../utils/handleError'; // Assuming this utility exists

@Component({
  selector: 'app-factures-exporter-data',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, TranslateModule],
  templateUrl: './factures-exporter-data.component.html',
  styleUrls: ['./factures-exporter-data.component.css']
})
export class FacturesExporterDataComponent implements OnInit {
  errorMessage: string | null = null;
  successMessage: string | null = null;
  operationType: 'load' | 'calculate' = 'load';
  isLoading: boolean = false;
  form: FormGroup;
  agencies: Agency[] = [];
  
  years = Array.from({ length: 5 }, (_, i) => new Date().getFullYear() + i);
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
    private fb: FormBuilder,
    private agencyService: AgencyService,
    private billService: BillService,
    private cdr: ChangeDetectorRef,
    private translateService: TranslateService
  ) {
    this.form = this.createForm();
  }

  ngOnInit(): void {
    this.loadAgencies();
  }

  createForm(): FormGroup {
    try {
      return this.fb.group({
        selectedYear: ['', Validators.required],
        selectedMonth: ['', Validators.required],
        agencyId: ['', Validators.required]
      });
    } catch (err) {
      this.handleError('ERROR.CREATING_FORM', err);
      return this.fb.group({});
    }
  }

  loadAgencies(): void {
    this.isLoading = true;
    this.clearError();

    this.agencyService.getAgencies().subscribe({
      next: (agencies) => {
        this.agencies = agencies;
        this.isLoading = false;
        this.clearError();
        this.cdr.detectChanges();
      },
      error: (err) => {
        this.handleError('ERROR.FETCHING_AGENCIES', err);
        this.isLoading = false;
        this.cdr.detectChanges();
      }
    });
  }

  executeAction(): void {
    this.markAllAsTouched();

    if (this.form.invalid) {
      this.handleError('ERROR.INVALID_FORM', new Error('Form is invalid'));
      this.cdr.detectChanges();
      return;
    }

    this.isLoading = true;
    this.clearError();
    this.form.disable();

    const month = Number(this.form.value.selectedMonth);
    const year = Number(this.form.value.selectedYear);
    const agencyId = Number(this.form.value.agencyId);

    this.billService.generateBillExcel(agencyId, year, month).subscribe({
      next: (blob) => {
        const fileName = `bill_${agencyId}_${month}_${year}.xlsx`;
        const link = document.createElement('a');
        link.href = window.URL.createObjectURL(blob);
        link.download = fileName;
        link.click();
        window.URL.revokeObjectURL(link.href);
        this.isLoading = false;
        this.form.enable();
        this.clearError();
        this.cdr.detectChanges();
      },
      error: (err) => {
        this.handleError('ERROR.GENERATING_BILL', err);
        this.isLoading = false;
        this.form.enable();
        this.cdr.detectChanges();
      }
    });
  }

  markAllAsTouched(): void {
    try {
      Object.keys(this.form.controls).forEach((key) => {
        const control = this.form.get(key);
        if (control) {
          control.markAsTouched();
          control.markAsDirty();
          control.updateValueAndValidity();
        }
      });
      this.cdr.detectChanges();
    } catch (err) {
      this.handleError('ERROR.MARKING_FORM_FIELDS', err);
    }
  }

  private handleError(errorKey: string, error: any): void {
    console.error(errorKey, error);

    const rawMessage = error?.error?.message || error?.message || '';
    const parsed = parseServerErrorMessage(rawMessage);
    const translated = this.translateService.instant(errorKey);

    this.errorMessage = translated || this.translateService.instant('ERROR.UNEXPECTED');
    this.cdr.detectChanges();
  }

  private clearError(): void {
    this.errorMessage = null;
    this.cdr.detectChanges();
  }
}