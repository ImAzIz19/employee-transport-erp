import { CommonModule } from '@angular/common';
import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators, FormsModule } from '@angular/forms';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { PlantSection } from '../../interface/plant-section/plant-section';
import { PlantSectionService } from '../../services/plant-section/plant-section.service';
import { CotisationService } from '../../services/cotisation/cotisation.service';
import { parseServerErrorMessage } from '../../utils/handleError'; // Assuming this utility exists

@Component({
  selector: 'app-cotisations-filter',
  standalone: true,
  imports: [TranslateModule, CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './cotisations-filter.component.html',
  styleUrl: './cotisations-filter.component.css'
})
export class CotisationsFilterComponent implements OnInit {
  errorMessage: string | null = null;
  successMessage: string | null = null;
  isLoading: boolean = false;
  operationType: 'load' | 'calculate' = 'load';
  form: FormGroup;
  plantsections: PlantSection[] = [];

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
    private plantsectionServices: PlantSectionService,
    private cotisationService: CotisationService,
    private cdr: ChangeDetectorRef,
    private translateService: TranslateService
  ) {
    this.form = this.createForm();
  }

  ngOnInit(): void {
    this.loadPlantSections();
  }

  createForm(): FormGroup {
    try {
      return this.fb.group({
        selectedYear: ['', Validators.required],
        selectedMonth: ['', Validators.required],
        plantSectionId: ['', Validators.required]
      });
    } catch (err) {
      this.handleError('ERROR.CREATING_FORM', err);
      return this.fb.group({});
    }
  }

  loadPlantSections(): void {
    this.isLoading = true;
    this.clearError();

    this.plantsectionServices.getPlantSections().subscribe({
      next: (sections) => {
        this.plantsections = sections;
        this.isLoading = false;
        this.clearError();
        this.cdr.detectChanges();
      },
      error: (err) => {
        this.handleError('ERROR.FETCHING_PLANT_SECTIONS', err);
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
    const psId = Number(this.form.value.plantSectionId);

    this.cotisationService.getEmployeesByPlantSectionAndPeriod(month, year, psId).subscribe({
      next: (blob) => {
        const fileName = `employees_${psId}_${month}_${year}.xlsx`;
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
        this.handleError('ERROR.FETCHING_EMPLOYEE_DATA', err);
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

    this.errorMessage =  translated || this.translateService.instant('ERROR.UNEXPECTED');
    this.cdr.detectChanges();
  }

  private clearError(): void {
    this.errorMessage = null;
    this.cdr.detectChanges();
  }
}