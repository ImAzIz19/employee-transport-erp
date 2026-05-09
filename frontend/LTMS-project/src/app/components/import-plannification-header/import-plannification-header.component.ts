import { Component } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { PlanificationDataComponent } from "../planification-data/planification-data.component";
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { PlanificationService } from '../../services/planification/planification.service';

@Component({
  selector: 'app-import-plannification-header',
  standalone: true,
  imports: [
    CommonModule,
    TranslateModule, 
    PlanificationDataComponent,
    RouterModule
  ],
  templateUrl: './import-plannification-header.component.html',
  styleUrls: ['./import-plannification-header.component.css']
})
export class ImportPlannificationHeaderComponent {
  isLoading = false;
  errorMessage: string = '';

  constructor(private planificationService: PlanificationService) {}

  downloadTemplate(): void {
    this.isLoading = true;
    this.errorMessage = '';
    
    this.planificationService.downloadTemplate().subscribe({
      next: (blob) => {
        this.handleDownload(blob);
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error downloading template:', error);
        this.errorMessage = 'Failed to download template. Please try again later.';
        this.isLoading = false;
        
        setTimeout(() => this.errorMessage = '', 5000);
      }
    });
  }

  private handleDownload(blob: Blob): void {
    // Create a download link
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'planification_template.xlsx';
    
    // Trigger the download
    document.body.appendChild(a);
    a.click();
    
    // Clean up
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
  }
}