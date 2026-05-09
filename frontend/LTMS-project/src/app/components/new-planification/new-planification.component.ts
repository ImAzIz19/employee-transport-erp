import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { NavBarComponent } from '../nav-bar/nav-bar.component';
import { PlantSection } from '../../interface/plant-section/plant-section';
import { User } from '../../interface/user/user';
import { PlanificationRequestDTO } from '../../interface/planification/planificationRequestDTO';
import { PlantSectionService } from '../../services/plant-section/plant-section.service';
import { PlanificationService } from '../../services/planification/planification.service';
import { Router } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { parseServerErrorMessage } from '../../utils/handleError'; // Assuming this utility exists
import { AuthService } from '../../services/auth.service';
import { UserManagerService } from '../../services/user/user.service';

@Component({
  selector: 'app-new-planification',
  standalone: true,
  imports: [
    CommonModule,
    NavBarComponent,
    ReactiveFormsModule,
    TranslateModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatProgressBarModule
  ],
  templateUrl: './new-planification.component.html',
  styleUrls: ['./new-planification.component.css']
})
export class NewPlanificationComponent implements OnInit {
  plantsections: PlantSection[] = [];
  rhManagers: User[] = [];
  form: FormGroup;
  weeks: { year: number; week: number; display: string; value: string }[] = [];
  selectedWeekDisplay: string = '';
  planningModes = [
    { value: 'cumulatif', label: 'Cumulatif' },
    { value: 'ecrasee', label: 'Écrasée' }
  ];
  showRhManagerSelect = false;
  uploadedFile: File | null = null;
  isUploading = false;
  uploadProgress = 0;
  errorMessage: string | null = null;
  successMessage: string | null = null;
  url: string = '';

  constructor(
    private fb: FormBuilder,
    private plantsectionServices: PlantSectionService,
    private planificationService: PlanificationService,
    private router: Router,
    private translateService: TranslateService,
    private authService: AuthService, // Assuming AuthService is available
    private cdr: ChangeDetectorRef,
    private userManagerService: UserManagerService // Assuming UserManagerService is available
  ) {
    this.form = this.createForm();
  }

  ngOnInit(): void {
    this.generateWeeks();
    this.setCurrentWeek();
    this.fetchData();
  }

  private createForm(): FormGroup {
    try {
      return this.fb.group({
        plantSectionId: ['', Validators.required],
        week: ['', Validators.required],
        planningMode: ['cumulatif', Validators.required],
        isDelegated: [false],
        rhManagerId: ['']
      });
    } catch (err) {
      this.handleError('ERROR.CREATING_FORM', err);
      return this.fb.group({});
    }
  }

  fetchData(): void {
    this.isUploading = true;
    this.clearMessages();

    // Fetch plant sections
    this.plantsectionServices.getPlantSections().subscribe({
      next: (plantsections) => {
        this.plantsections = plantsections;
        this.isUploading = false;
        this.clearMessages();
        this.cdr.detectChanges();
      },
      error: (err) => {
        this.handleError('ERROR.FETCHING_PLANT_SECTIONS', err);
        this.isUploading = false;
        this.cdr.detectChanges();
      }
    });

    // Fetch RH managers
     this.userManagerService.getAllUsers().subscribe({
    next: (users) => {
      // Filter users to only include those with ROLE_RH
      this.rhManagers = users.filter(user => 
        user.roles && user.roles.some(role => role.name === 'ROLE_RH')
      );
      
      this.isUploading = false;
      this.clearMessages();
      this.cdr.detectChanges();
    },
    error: (err) => {
      this.handleError('ERROR.FETCHING_RH_MANAGERS', err);
      this.isUploading = false;
      this.cdr.detectChanges();
    }
  });
  }

  generateWeeks(): void {
    const currentDate = new Date();
    const currentYear = currentDate.getFullYear();

    for (let year = currentYear - 1; year <= currentYear + 1; year++) {
      const weeksInYear = this.getWeeksInYear(year);
      for (let week = 1; week <= weeksInYear; week++) {
        const display = `Semaine ${week}, ${year}`;
        const value = `${year}-W${week.toString().padStart(2, '0')}`;
        this.weeks.push({ year, week, display, value });
      }
    }
  }

  getWeeksInYear(year: number): number {
    const janFirst = new Date(year, 0, 1);
    const firstSaturday = new Date(janFirst);
    firstSaturday.setDate(janFirst.getDate() + (6 - janFirst.getDay() + 7) % 7);

    const dec31 = new Date(year, 11, 31);
    const lastSaturday = new Date(dec31);
    lastSaturday.setDate(dec31.getDate() - (dec31.getDay() - 6 + 7) % 7);

    return Math.ceil((lastSaturday.getTime() - firstSaturday.getTime()) / (7 * 24 * 60 * 60 * 1000)) + 1;
  }

  setCurrentWeek(): void {
    const date = new Date();
    const year = date.getFullYear();
    const week = this.getSaturdayBasedWeekNumber(date);
    this.selectedWeekDisplay = `Semaine ${week}, ${year}`;
    const weekValue = `${year}-W${week.toString().padStart(2, '0')}`;
    this.form.patchValue({ week: weekValue });
    this.cdr.detectChanges();
  }

  getSaturdayBasedWeekNumber(date: Date): number {
    const d = new Date(date);
    d.setDate(d.getDate() + (5 - d.getDay() + 7) % 7);
    const yearStart = new Date(d.getFullYear(), 0, 1);
    const firstSaturday = new Date(yearStart);
    firstSaturday.setDate(yearStart.getDate() + (6 - yearStart.getDay() + 7) % 7);

    if (d < firstSaturday) {
      return this.getWeeksInYear(d.getFullYear() - 1);
    }

    return Math.ceil(((d.getTime() - firstSaturday.getTime()) / (7 * 24 * 60 * 60 * 1000))) + 1;
  }

  onWeekChange(event: Event): void {
    const select = event.target as HTMLSelectElement;
    const selectedValue = select.value;
    const selectedOption = this.weeks.find(w => w.value === selectedValue);

    if (selectedOption) {
      this.selectedWeekDisplay = selectedOption.display;
      this.cdr.detectChanges();
    }
  }

  onDragOver(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
    const uploadArea = event.currentTarget as HTMLElement;
    uploadArea.classList.add('border-blue-500');
  }

  onDrop(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
    const uploadArea = event.currentTarget as HTMLElement;
    uploadArea.classList.remove('border-blue-500');

    if (event.dataTransfer?.files) {
      this.handleFiles(event.dataTransfer.files);
    }
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.handleFiles(input.files);
    }
  }

  private handleFiles(files: FileList): void {
    try {
      const file = files[0];
      if (file && this.isValidExcelFile(file)) {
        this.uploadedFile = file;
        this.clearMessages();
      } else {
        this.handleError('ERROR.INVALID_FILE_TYPE', new Error('Invalid Excel file'));
      }
      this.cdr.detectChanges();
    } catch (err) {
      this.handleError('ERROR.HANDLING_FILE', err);
    }
  }

  private isValidExcelFile(file: File): boolean {
    const validExtensions = ['.xlsx', '.xls'];
    const fileName = file.name.toLowerCase();
    return validExtensions.some(ext => fileName.endsWith(ext));
  }

  // onSubmit(): void {
  //   this.markAllAsTouched();

  //   if (!this.uploadedFile || this.form.invalid) {
  //     this.handleError('ERROR.INVALID_FORM', new Error('Form is invalid or no file uploaded'));
  //     this.cdr.detectChanges();
  //     return;
  //   }

  //   this.isUploading = true;
  //   this.clearMessages();
  //   this.form.disable();

  //   const weekValue = this.form.value.week; // e.g., "2025-W23"
  //   const [year, week] = weekValue.split('-W'); // Split into ["2025", "23"]

  //   const requestDTO: PlanificationRequestDTO = {
  //     week: `KW-${year}-${week}`,
  //     file: this.uploadedFile,
  //     userId: 1, // Replace with actual user ID
  //     plantSectionId: this.form.value.plantSectionId ? +this.form.value.plantSectionId : undefined
  //   };

  //   // Simulate upload progress
  //   const progressInterval = setInterval(() => {
  //     this.uploadProgress = Math.min(this.uploadProgress + 10, 90);
  //     this.cdr.detectChanges();
  //   }, 300);

  //   this.url = this.form.value.planningMode === 'cumulatif'
  //     ? '/api/planifications/upload/cum'
  //     : '/api/planifications/upload/ecras';

  //   this.planificationService.uploadFile(requestDTO, this.url).subscribe({
  //     next: (response) => {
  //       clearInterval(progressInterval);
  //       this.uploadProgress = 100;

  //       const totalIssues = (response.employeesNotActifForPlanification || 0) +
  //         (response.nonExistentEmployees || 0) +
  //         (response.invalidDays || 0);

  //       if (totalIssues > 0) {
  //         this.isUploading = false;
  //         this.handleError('ERROR.PLANIFICATION_ISSUES', new Error(
  //           `${totalIssues} employés n'ont pas été ajoutés à la planification : ` +
  //           `${response.employeesNotActifForPlanification || 0} employés inactifs, ` +
  //           `${response.nonExistentEmployees || 0} employés inexistants, ` +
  //           `${response.invalidDays || 0} jours invalides. Check your email for more info`
  //         ));
  //         this.form.enable();
  //         this.cdr.detectChanges();
  //         setTimeout(() => this.clearMessages(), 5000);
  //         return;
  //       }

  //       this.isUploading = false;
  //       this.successMessage = this.translateService.instant('SUCCESS.PLANIFICATION_UPLOADED');
  //       this.form.enable();
  //       this.resetForm();
  //       this.cdr.detectChanges();
  //       setTimeout(() => {
  //         this.clearMessages();
  //         this.router.navigate(['/planification/importDePlannification']);
  //       }, 5000);
  //     },
  //     error: (err: HttpErrorResponse) => {
  //       clearInterval(progressInterval);
  //       this.isUploading = false;
  //       this.form.enable();
  //       this.handleError('ERROR.UPLOADING_PLANIFICATION', err);
  //       this.cdr.detectChanges();
  //       setTimeout(() => this.clearMessages(), 5000);
  //     }
  //   });
  // }
  onSubmit(): void {
    if (!this.uploadedFile || this.form.invalid) {
      this.markAllAsTouched();
      this.errorMessage = !this.uploadedFile ? 'Veuillez sélectionner un fichier' : 'Veuillez remplir tous les champs requis';
      return;
    }

    // Get the current user ID from AuthService
    const currentUser = this.authService.currentUserValue;

    if (!currentUser) {
      this.errorMessage = 'User not authenticated';
      return;
    }

    this.isUploading = true;
    this.uploadProgress = 0;
    this.errorMessage = null;
    this.successMessage = null;

    const weekValue = this.form.value.week; // e.g., "2025-W23"
    const [year, week] = weekValue.split('-W'); // Split into ["2025", "23"]

    // Create the DTO object with the logged-in user's ID
    const requestDTO: PlanificationRequestDTO = {
      week: `KW-${year}-${week}`,
      file: this.uploadedFile,
      userId: currentUser.id, // Use the actual logged-in user's ID
    };

    // Add plantSectionId if provided
    if (this.form.value.plantSectionId) {
      requestDTO.plantSectionId = +this.form.value.plantSectionId;
    }

    // Add rhManagerId if delegation is enabled
    if (this.form.value.isDelegated && this.form.value.rhManagerId) {
      requestDTO.userId = +this.form.value.rhManagerId;
    }

    console.log('Request DTO:', requestDTO);

    // Rest of your existing code...
    const progressInterval = setInterval(() => {
      this.uploadProgress = Math.min(this.uploadProgress + 10, 90);
    }, 300);

    switch (this.form.value.planningMode) {
      case 'cumulatif':
        this.url = '/api/planifications/upload/cum';
        break;
      case 'ecrasee':
        this.url = '/api/planifications/upload/ecras';
        break;
      default:
        this.url = '/api/planifications/upload/cum';
    }

    this.planificationService.uploadFile(requestDTO, this.url).subscribe({
      next: (response) => {
        clearInterval(progressInterval);
        this.uploadProgress = 100;

        // Check if there are any employee-related issues
        const totalIssues = (response.employeesNotActifForPlanification || 0) +
          (response.nonExistentEmployees || 0) +
          (response.invalidDays || 0);

        if (totalIssues > 0) {
          this.isUploading = false;
          this.errorMessage = `${totalIssues} employés n'ont pas été ajoutés à la planification : ` +
            `<br>${response.employeesNotActifForPlanification || 0} employés inactifs, ` +
            `<br>${response.nonExistentEmployees || 0} employés inexistants, ` +
            `<br>${response.invalidDays || 0} jours invalides.`;

          setTimeout(() => this.errorMessage = null, 5000);
          return;
        }

        setTimeout(() => {
          this.isUploading = false;
          this.successMessage = 'Planification importée avec succès!';
          setTimeout(() => this.successMessage = null, 5000);
          this.resetForm();
          this.router.navigate(["/planification/importDePlannification"]);
        }, 500);
        console.log(response);
      },
      error: (error: HttpErrorResponse) => {
        console.log(error);
        clearInterval(progressInterval);
        this.isUploading = false;
        this.errorMessage = error.error?.message || 'Échec de l\'importation de la planification';
        setTimeout(() => this.errorMessage = null, 5000);
      }
    });
  }
  onCancel(): void {
    this.uploadedFile = null;
    this.clearMessages();
    this.isUploading = false;
    this.uploadProgress = 0;
    this.form.enable();
    this.resetForm();
    this.cdr.detectChanges();
  }

  private resetForm(): void {
    try {
      this.form.reset({
        planningMode: 'cumulatif',
        isDelegated: false,
        rhManagerId: ''
      });
      this.uploadedFile = null;
      this.setCurrentWeek();
      this.showRhManagerSelect = false;
      this.cdr.detectChanges();
    } catch (err) {
      this.handleError('ERROR.RESETTING_FORM', err);
    }
  }

  private markAllAsTouched(): void {
    try {
      Object.values(this.form.controls).forEach(control => {
        control.markAsTouched();
        control.markAsDirty();
        control.updateValueAndValidity();
      });
      this.cdr.detectChanges();
    } catch (err) {
      this.handleError('ERROR.MARKING_FORM_FIELDS', err);
    }
  }

  onDelegatedChange(): void {
    try {
      this.showRhManagerSelect = this.form.get('isDelegated')?.value;
      if (!this.showRhManagerSelect) {
        this.form.patchValue({ rhManagerId: '' });
        this.form.get('rhManagerId')?.clearValidators();
      } else {
        this.form.get('rhManagerId')?.setValidators([Validators.required]);
      }
      this.form.get('rhManagerId')?.updateValueAndValidity();
      this.cdr.detectChanges();
    } catch (err) {
      this.handleError('ERROR.UPDATING_DELEGATION', err);
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

  private clearMessages(): void {
    this.errorMessage = null;
    this.successMessage = null;
    this.cdr.detectChanges();
  }
}