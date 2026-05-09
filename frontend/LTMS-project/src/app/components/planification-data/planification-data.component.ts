import { Component, ViewChild, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatCardModule } from '@angular/material/card';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { PlanificationFilterComponent } from '../planification-filter/planification-filter.component';
import { MatDialog } from '@angular/material/dialog';
import { PlanificationDetailsComponent } from '../planification-details/planification-details.component';
import { finalize } from 'rxjs/operators';
import { PlanificationDTO } from '../../interface/planification/planificatio';
import { PlanificationService } from '../../services/planification/planification.service';
import { parseServerErrorMessage } from '../../utils/handleError';

@Component({
  selector: 'app-planification-data',
  standalone: true,
  imports: [
    CommonModule,
    MatPaginatorModule,
    MatTableModule,
    MatCardModule,
    MatProgressSpinnerModule,
    MatSnackBarModule,
    TranslateModule,
    PlanificationFilterComponent
  ],
  templateUrl: './planification-data.component.html',
  styleUrls: ['./planification-data.component.scss']
})
export class PlanificationDataComponent implements OnInit {
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  displayedColumns: string[] = [
    'dateAction',
    'username',
    'actionName',
    'plantSectionName',
    'week',
    'filename',
    'orgName',
    'plannedEmployees'
  ];

  dataSource = new MatTableDataSource<PlanificationDTO>();
  filteredData: PlanificationDTO[] = [];
  isLoading = false;
  plantSections: string[] = [];
  weeks: string[] = [];
  pageSize = 10;
  currentPage = 0;
  errorMessage: string | null = null;

  constructor(
    private dialog: MatDialog,
    private planificationService: PlanificationService,
    private snackBar: MatSnackBar,
    private translateService: TranslateService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.loadPlanifications();
  }

  loadPlanifications(): void {
    this.isLoading = true;
    this.clearError();

    this.planificationService.getAll()
      .pipe(
        finalize(() => {
          this.isLoading = false;
          this.cdr.detectChanges();
        })
      )
      .subscribe({
        next: (planifications) => {
          this.dataSource.data = planifications;
          this.filteredData = [...planifications];
          this.extractFilterOptions(planifications);
          this.updatePaginatedData();
          this.clearError();
          this.cdr.detectChanges();
        },
        error: (error) => {
          this.handleError('ERROR.FETCHING_PLANIFICATIONS', error);
        }
      });
  }

  private extractFilterOptions(planifications: PlanificationDTO[]): void {
    try {
      this.plantSections = [...new Set(planifications.map(item => item.plantSectionName))].filter(Boolean) as string[];
      this.weeks = [...new Set(planifications.map(item => item.week))].filter(Boolean) as string[];
      this.cdr.detectChanges();
    } catch (error) {
      this.handleError('ERROR.EXTRACTING_FILTER_OPTIONS', error);
    }
  }

  onFilterChange(filters: any): void {
    try {
      let filteredData = [...this.dataSource.data];

      if (filters.name) {
        filteredData = filteredData.filter(item =>
          item.userName?.toLowerCase().includes(filters.name.toLowerCase())
        );
      }

      if (filters.plantSection) {
        filteredData = filteredData.filter(item =>
          item.plantSectionName?.toLowerCase().includes(filters.plantSection.toLowerCase())
        );
      }

      if (filters.action && filters.action !== 'all') {
        filteredData = filteredData.filter(item =>
          item.actionName === filters.action
        );
      }

      if (filters.week) {
        filteredData = filteredData.filter(item =>
          item.week?.toLowerCase().includes(filters.week.toLowerCase())
        );
      }

      this.filteredData = filteredData;
      this.currentPage = 0;
      this.updatePaginatedData();

      if (this.paginator) {
        this.paginator.firstPage();
      }
      this.clearError();
      this.cdr.detectChanges();
    } catch (error) {
      this.handleError('ERROR.FILTERING_DATA', error);
    }
  }

  updatePaginatedData(): void {
    try {
      const startIndex = this.currentPage * this.pageSize;
      const endIndex = startIndex + this.pageSize;
      this.dataSource.data = this.filteredData.slice(startIndex, endIndex);
      this.cdr.detectChanges();
    } catch (error) {
      this.handleError('ERROR.UPDATING_PAGINATED_DATA', error);
    }
  }

  onPageChange(event: any): void {
    try {
      this.currentPage = event.pageIndex;
      this.pageSize = event.pageSize;
      this.updatePaginatedData();
      this.cdr.detectChanges();
    } catch (error) {
      this.handleError('ERROR.HANDLING_PAGE_CHANGE', error);
    }
  }

  openDetails(planification: PlanificationDTO): void {
    try {
      this.dialog.open(PlanificationDetailsComponent, {
        width: '70vw',
        height: '80vh',
        maxWidth: '2000px',
        maxHeight: '1200px',
        panelClass: 'scrollable-dialog',
        data: { planification }
      });
      this.clearError();
    } catch (error) {
      this.handleError('ERROR.OPENING_DETAILS', error);
    }
  }

  getPlannedEmployeesDisplay(planification: PlanificationDTO): string {
    try {
      return `${planification.successSaved}/${planification.totalLines}`;
    } catch (error) {
      this.handleError('ERROR.DISPLAYING_PLANNED_EMPLOYEES', error);
      return '';
    }
  }

  ngAfterViewInit(): void {
    try {
      this.dataSource.paginator = this.paginator;
      this.cdr.detectChanges();
    } catch (error) {
      this.handleError('ERROR.SETTING_PAGINATOR', error);
    }
  }

  downloadFile(planification: PlanificationDTO): void {
    this.isLoading = true;
    this.clearError();

    this.planificationService.downloadFile(planification.id).subscribe({
      next: (response) => {
        const blob = new Blob([response], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = planification.targetAction || 'planification.xlsx';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
        this.isLoading = false;
        this.clearError();
        this.snackBar.open(this.translateService.instant('SUCCESS.FILE_DOWNLOADED'), this.translateService.instant('ACTION.CLOSE'), { duration: 5000 });
        this.cdr.detectChanges();
      },
      error: (error) => {
        this.handleError('ERROR.DOWNLOADING_FILE', error);
        this.isLoading = false;
        this.cdr.detectChanges();
      }
    });
  }

  private handleError(errorKey: string, error: any): void {
    console.error(errorKey, error);

    const rawMessage = error?.error?.message || error?.message || '';
    const parsed = parseServerErrorMessage(rawMessage);
    const translated = this.translateService.instant(errorKey);

    this.errorMessage = parsed || translated || this.translateService.instant('ERROR.UNEXPECTED');
    this.cdr.detectChanges();

    // Auto-clear error message after 5 seconds
    setTimeout(() => {
      this.clearError();
    }, 5000);
  }

  private clearError(): void {
    this.errorMessage = null;
    this.cdr.detectChanges();
  }
}