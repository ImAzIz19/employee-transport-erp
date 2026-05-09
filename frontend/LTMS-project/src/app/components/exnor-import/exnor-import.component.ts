import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Output, ChangeDetectorRef } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faFolderOpen } from '@fortawesome/free-solid-svg-icons';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { CotisationService } from '../../services/cotisation/cotisation.service';
import { parseServerErrorMessage } from '../../utils/handleError'; // Assuming this utility exists

@Component({
  selector: 'app-exnor-import',
  standalone: true,
  imports: [
    CommonModule,
    MatProgressBarModule,
    MatButtonModule,
    MatIconModule,
    FontAwesomeModule,
    TranslateModule,
    MatProgressSpinnerModule
  ],
  templateUrl: './exnor-import.component.html',
  styleUrls: ['./exnor-import.component.css']
})
export class ExnorImportComponent {
  @Output() fileSelected = new EventEmitter<File>();
  @Output() save = new EventEmitter<void>();
  @Output() cancel = new EventEmitter<void>();

  isLoading: boolean = false;
  uploadProgress: number = 0;
  isUploading: boolean = false;
  errorMessage: string | null = null;
  successMessage: string | null = null;

  faFolderOpen = faFolderOpen;
  uploadedFile: File | null = null;

  constructor(
    private cotisationService: CotisationService,
    private translateService: TranslateService,
    private cdr: ChangeDetectorRef
  ) {}

  onFileSelected(event: Event): void {
    try {
      const input = event.target as HTMLInputElement;
      if (input.files?.length) {
        this.uploadedFile = input.files[0];
        this.fileSelected.emit(this.uploadedFile);
        input.value = ''; // Reset input to allow re-selection of the same file
        this.clearMessages();
        this.cdr.detectChanges();
      }
    } catch (err) {
      this.handleError('ERROR.SELECTING_FILE', err);
    }
  }

  onSave(): void {
    if (!this.uploadedFile) {
      this.handleError('ERROR.NO_FILE_SELECTED', new Error('No file selected'));
      this.cdr.detectChanges();
      return;
    }

    this.isUploading = true;
    this.isLoading = true;
    this.uploadProgress = 0;
    this.clearMessages();

    // Simulate progress (replace with actual progress if backend supports it)
    const progressInterval = setInterval(() => {
      this.uploadProgress = Math.min(this.uploadProgress + 10, 90);
      this.cdr.detectChanges();
    }, 200);

    this.cotisationService.importExonerationData(this.uploadedFile).subscribe({
      next: (response) => {
        clearInterval(progressInterval);
        this.uploadProgress = 100;
        this.isUploading = false;
        this.isLoading = false;
        this.successMessage = response.message || this.translateService.instant('SUCCESS.FILE_IMPORTED');
        this.uploadedFile = null;
        this.save.emit();
        this.cdr.detectChanges();
      },
      error: (err) => {
        clearInterval(progressInterval);
        this.handleError('ERROR.IMPORTING_FILE', err);
        this.isUploading = false;
        this.isLoading = false;
        this.cdr.detectChanges();
      }
    });
  }

  onCancel(): void {
    try {
      this.uploadedFile = null;
      this.uploadProgress = 0;
      this.isUploading = false;
      this.isLoading = false;
      this.clearMessages();
      this.cancel.emit();
      this.cdr.detectChanges();
    } catch (err) {
      this.handleError('ERROR.CANCELING_ACTION', err);
    }
  }

  onDragOver(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
  }

  onDrop(event: DragEvent): void {
    try {
      event.preventDefault();
      event.stopPropagation();

      if (event.dataTransfer?.files.length) {
        this.uploadedFile = event.dataTransfer.files[0];
        this.fileSelected.emit(this.uploadedFile);
        this.clearMessages();
        this.cdr.detectChanges();
      }
    } catch (err) {
      this.handleError('ERROR.DROPPING_FILE', err);
    }
  }

  downloadTemplate(): void {
    this.isLoading = true;
    this.clearMessages();

    this.cotisationService.downloadTemplate().subscribe({
      next: (blob) => {
        if (!(blob instanceof Blob)) {
          this.handleError('ERROR.INVALID_TEMPLATE_FILE', new Error('Invalid file received from server'));
          this.isLoading = false;
          this.cdr.detectChanges();
          return;
        }
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = 'template.xlsx';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);
        this.isLoading = false;
        this.clearMessages();
        this.cdr.detectChanges();
      },
      error: (err) => {
        this.handleError('ERROR.DOWNLOADING_TEMPLATE', err);
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

    this.errorMessage = translated || this.translateService.instant('ERROR.UNEXPECTED');
    this.successMessage = null;
    this.cdr.detectChanges();
  }

  private clearMessages(): void {
    this.errorMessage = null;
    this.successMessage = null;
    this.cdr.detectChanges();
  }
}