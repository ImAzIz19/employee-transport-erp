import { Component, Input, OnChanges, SimpleChanges, ChangeDetectorRef } from '@angular/core';
import { BusPlanDTO } from '../../interface/busPlanDTO/busPlanDTO';
import { BusPlanRequestDTO } from '../../interface/busPlanDTO/busPlanRequestDTO';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { FormsModule } from '@angular/forms';
import { MatIcon } from '@angular/material/icon';
import { Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { BusPlanificationService } from '../../services/busPlanification/bus-planification.service';
import { TranslateService } from '@ngx-translate/core';
import { parseServerErrorMessage } from '../../utils/handleError'; // Assuming this utility exists

@Component({
  selector: 'app-gestion-plannification-data',
  standalone: true,
  imports: [
    CommonModule,
    MatPaginatorModule,
    MatTableModule,
    MatCardModule,
    MatProgressSpinnerModule,
    MatSnackBarModule,
    FormsModule,
    MatIcon
  ],
  templateUrl: './gestion-plannification-data.component.html',
  styleUrls: ['./gestion-plannification-data.component.css']
})
export class GestionPlannificationDataComponent implements OnChanges {
  displayedColumns: string[] = [
    'agencyName',
    'circuitName',
    'weekDay',
    'date',
    'startTime',
    'endTime',
    'numberOfEmployees',
    'numberOfStandardBuses',
    'numberOfMiniBuses'
  ];

  dataSource = new MatTableDataSource<BusPlanDTO>();
  filteredData: BusPlanDTO[] = [];
  errorMessage: string | null = null;
  successMessage: string | null = null;
  pageSize = 5;
  currentPage = 0;

  @Input() busPlans: BusPlanDTO[] = [];
  @Input() agencyId: number | null = null;
  @Input() week: string | null = null;
  @Input() isLoading: boolean = false;
  @Input() operationType: 'load' | 'recalculate' | '' = '';

  constructor(
    private busPlanificationService: BusPlanificationService,
    private translateService: TranslateService,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnChanges(changes: SimpleChanges): void {
    try {
      if (changes['busPlans'] && changes['busPlans'].currentValue) {
        this.loadBusPlans();
      }
      if (changes['operationType']) {
        console.log('operationType in ngOnChanges:', this.operationType);
      }
      this.cdr.detectChanges();
    } catch (err) {
      this.handleError('ERROR.HANDLING_CHANGES', err);
    }
  }

  loadBusPlans(): void {
    try {
      this.clearError();
      this.filteredData = [...this.busPlans];
      this.updatePaginatedData();
      this.cdr.detectChanges();
    } catch (err) {
      this.handleError('ERROR.LOADING_BUS_PLANS', err);
    }
  }

  updatePaginatedData(): void {
    try {
      const startIndex = this.currentPage * this.pageSize;
      const endIndex = startIndex + this.pageSize;
      this.dataSource.data = this.filteredData.slice(startIndex, endIndex);
      this.cdr.detectChanges();
    } catch (err) {
      this.handleError('ERROR.UPDATING_PAGINATION', err);
    }
  }

  onPageChange(event: PageEvent): void {
    try {
      this.currentPage = event.pageIndex;
      this.pageSize = event.pageSize;
      this.updatePaginatedData();
    } catch (err) {
      this.handleError('ERROR.HANDLING_PAGE_CHANGE', err);
    }
  }

  saveChanges(): void {
    this.isLoading = true;
    this.clearError();

    try {
      if (!this.filteredData.length) {
        this.handleError('ERROR.NO_DATA_TO_SAVE', new Error('No bus plans available to save'));
        this.isLoading = false;
        this.cdr.detectChanges();
        return;
      }

      const requests: BusPlanRequestDTO[] = this.filteredData.map(plan => ({
        busPlanId: plan.id,
        numberOfStandardBuses: plan.numberOfStandardBuses,
        numberOfMiniBuses: plan.numberOfMiniBuses
      }));

      const saveRequests = requests.map(request =>
        this.busPlanificationService.modifyBusPlan(request).pipe(
          tap(response => {
            const index = this.filteredData.findIndex(plan => plan.id === response.id);
            if (index !== -1) {
              this.filteredData[index].numberOfStandardBuses = response.numberOfStandardBuses;
              this.filteredData[index].numberOfMiniBuses = response.numberOfMiniBuses;
            }
          }),
          catchError(error => {
            this.handleError('ERROR.SAVING_BUS_PLAN', error);
            return throwError(() => error);
          })
        )
      );

      Promise.all(saveRequests.map(req => req.toPromise()))
        .then(() => {
          this.updatePaginatedData();
          this.isLoading = false;
          this.successMessage = this.translateService.instant('SUCCESS.BUS_PLANS_SAVED');
          this.cdr.detectChanges();
        })
        .catch(() => {
          this.isLoading = false;
          if (!this.errorMessage) {
            this.handleError('ERROR.UNEXPECTED', new Error('Unexpected error during save'));
          }
          this.cdr.detectChanges();
        });
    } catch (err) {
      this.handleError('ERROR.SAVING_CHANGES', err);
      this.isLoading = false;
      this.cdr.detectChanges();
    }
  }

  notifyAgency(): void {
  this.isLoading = true;
  this.clearError();

  if (!this.agencyId || !this.week) {
    this.handleError('ERROR.INVALID_NOTIFY_INPUT', new Error('Agency ID or week is missing'));
    this.isLoading = false;
    this.cdr.detectChanges();
    return;
  }

  console.log('Notifying agency:', this.agencyId, 'for week:', this.week);

  this.busPlanificationService.notifyAgency(this.agencyId, this.week).subscribe({
    next: (response) => {
      this.isLoading = false;
      this.successMessage = this.translateService.instant('SUCCESS.AGENCY_NOTIFIED');
      this.cdr.detectChanges();
    },
    error: (error) => {
      this.handleError('ERROR.NOTIFYING_AGENCY', error);
      this.isLoading = false;
      this.cdr.detectChanges();
    }
  });
}
  getNumberOptions(): number[] {
    try {
      return Array.from({ length: 16 }, (_, i) => i);
    } catch (err) {
      this.handleError('ERROR.GENERATING_NUMBER_OPTIONS', err);
      return [];
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