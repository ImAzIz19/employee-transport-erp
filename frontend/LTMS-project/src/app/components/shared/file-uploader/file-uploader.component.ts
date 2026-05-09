// file-upload.component.ts
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faFolderOpen } from '@fortawesome/free-solid-svg-icons';
import { TranslateModule } from '@ngx-translate/core';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { EmployeeService } from '../../../services/employee/employee.service';
import { StationService } from '../../../services/station/station.service';

@Component({
  selector: 'app-file-upload',
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
  templateUrl: './file-uploader.component.html',
  styleUrls: ['./file-uploader.component.css']
})
export class FileUploaderComponent {
  constructor(
    private employeeService: EmployeeService,
    private stationService: StationService,
  ) {
  }
  @Output() fileSelected = new EventEmitter<File>();
  @Output() save = new EventEmitter<void>();
  @Output() cancel = new EventEmitter<void>();
  @Output() verify = new EventEmitter<void>();

  @Input() entityType: string = ''; 
  @Input() isLoading: boolean = false;
  @Input() uploadProgress: number = 0;
  @Input() isUploading: boolean = false;
  @Input() planification: boolean=false ;

  faFolderOpen = faFolderOpen;
  uploadedFile: File | null = null;
  errorMessage: string = '';

  onFileSelected(event: Event): void {
  console.log('File selected event:', event);
  const input = event.target as HTMLInputElement;
  if (input.files?.length) {
    console.log('File selected:', input.files[0]);
    this.uploadedFile = input.files[0];
    this.fileSelected.emit(this.uploadedFile);
  } else {
    console.log('No files selected');
  }
}

  onSave(): void {
    this.save.emit();
  }

  onCancel(): void {
    this.uploadedFile = null;
    this.cancel.emit();
  }

  onVerify(): void {
    this.verify.emit();
  }

  onDragOver(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
  }

  onDrop(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
    
    if (event.dataTransfer?.files.length) {
      this.uploadedFile = event.dataTransfer.files[0];
      this.fileSelected.emit(this.uploadedFile);
    }
  }

  downloadTemplate(entityType: 'station' | 'employee'): void {
    this.isLoading = true;
    this.errorMessage = '';
    
    const downloadObservable$ = entityType === 'station' 
      ? this.stationService.downloadStationTemplate() 
      : this.employeeService.downloadEmployeeTemplate();
    
    const fileName = `${entityType}_template.xlsx`;

    downloadObservable$.subscribe({
      next: (blob) => {
        this.handleDownload(blob, fileName);
        this.isLoading = false;
      },
      error: (error) => {
        console.error(`Error downloading ${entityType} template:`, error);
        this.errorMessage = `Failed to download ${entityType} template. ${error.message || 'Please try again later.'}`;
        this.isLoading = false;
        
        setTimeout(() => this.errorMessage = '', 5000);
      }
    });
  }

  private handleDownload(blob: Blob, fileName: string): void {
    // Create a download link
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = fileName;
    
    // Trigger the download
    document.body.appendChild(a);
    a.click();
    
    // Clean up
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
  }
}