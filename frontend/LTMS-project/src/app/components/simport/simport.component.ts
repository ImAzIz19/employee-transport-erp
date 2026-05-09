import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { NavBarComponent } from "../nav-bar/nav-bar.component";
import { CommonModule, DatePipe } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { UploadActionDTO } from '../../interface/UploadAction/UploadAction';
import { UploadActionService } from '../../services/UploadAction/upload-action.service';

@Component({
  selector: 'app-employee-import',
  templateUrl: './simport.component.html',
  styleUrls: ['./simport.component.scss'],
  standalone: true,
  imports: [CommonModule, TranslateModule, NavBarComponent],
  providers: [DatePipe],
})
export class SimportComponent implements OnInit {
  entityType: 'employee' | 'station' | 'path' = 'employee';
  selectedFile: File | null = null;
  isFileValid = false;
  filter: 'user' | 'org' = 'user';
  currentUser = 'ADMIN-MH';
  currentOrg = 'LEONI Monastir';
  isLoading = false;
  errorMessage: string | null = null;
  importHistory: UploadActionDTO[] = [];

  constructor(
    private route: ActivatedRoute,
    private uploadActionService: UploadActionService,
    private translateService: TranslateService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    try {
      this.route.params.subscribe({
        next: (params) => {
          this.entityType = params['type'] || 'employee';
          this.loadImportHistory();

          this.clearError();
          this.cdr.detectChanges();
        },
        error: (err) => {
          this.handleError('ERROR.LOADING_PARAMS', err);
        },
      });
    } catch (err) {
      this.handleError('ERROR.INITIALIZING_COMPONENT', err);
    }
  }

  getImports(): UploadActionDTO[] {
  try {
    return this.importHistory;
  } catch (err) {
    this.handleError('ERROR.GETTING_IMPORTS', err);
    return [];
  }
}
  loadImportHistory(): void {
    try {
      this.isLoading = true;
      this.clearError();
      this.uploadActionService.getAllUploadActions().subscribe({
        next: (uploadActions) => {
          this.importHistory = uploadActions;
          console.log('Import History:', this.importHistory);
          this.isLoading = false;
          this.clearError();
          this.cdr.detectChanges();
        },
        error: (err) => {
          this.isLoading = false;
          this.handleError('ERROR.FETCHING_IMPORT_HISTORY', err);
        },
      });
    } catch (err) {
      this.isLoading = false;
      this.handleError('ERROR.LOADING_IMPORT_HISTORY', err);
    }
  }

  

  onFileSelected(event: any): void {
    try {
      this.selectedFile = event.target.files[0] as File;
      this.isFileValid = false;
      this.clearError();

      if (this.selectedFile) {
        // Add file validation logic here (e.g., check file type or size)
        const validTypes = ['text/csv', 'application/vnd.ms-excel', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'];
        if (!validTypes.includes(this.selectedFile.type)) {
          this.handleError('ERROR.INVALID_FILE_TYPE', new Error('Invalid file type'));
          return;
        }
        this.isFileValid = true;
        this.cdr.detectChanges();
      }
    } catch (err) {
      this.handleError('ERROR.SELECTING_FILE', err);
    }
  }

  downloadImportFile(actionId: number): void {
      this.uploadActionService.downloadActionFile(actionId)
  }

  getStatusClass(status: string): string {
    try {
      const statusClasses: Record<string, string> = {
        'COMPLETED': 'bg-green-100 text-green-800',
        'FAILED': 'bg-red-100 text-red-800',
        'PENDING': 'bg-yellow-100 text-yellow-800',
        'PROCESSING': 'bg-blue-100 text-blue-800',
      };
      return statusClasses[status] || 'bg-gray-100 text-gray-800';
    } catch (err) {
      this.handleError('ERROR.GETTING_STATUS_CLASS', err);
      return 'bg-gray-100 text-gray-800';
    }
  }

  private handleError(errorKey: string, error: any): void {
    console.error(errorKey, error);
    this.errorMessage = this.translateService.instant(errorKey) || 'Une erreur inattendue est survenue';
    this.cdr.detectChanges();
  }

  private clearError(): void {
    this.errorMessage = null;
    this.cdr.detectChanges();
  }
}