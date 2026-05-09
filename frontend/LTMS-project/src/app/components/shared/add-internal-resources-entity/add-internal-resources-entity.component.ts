import { ChangeDetectorRef, Component, Input, OnInit } from '@angular/core';
import { NavBarComponent } from "../../nav-bar/nav-bar.component";
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators, AbstractControl, ValidatorFn } from '@angular/forms';
import { PlantSection } from '../../../interface/plant-section/plant-section';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { PlantSectionService } from '../../../services/plant-section/plant-section.service';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { CircuitService } from '../../../services/circuit/circuit.service';
import { EmployeeService } from '../../../services/employee/employee.service';
import { SegmentService } from '../../../services/segment/segment.service';
import { StationService } from '../../../services/station/station.service';
import { AgencyService } from '../../../services/agency/agency.service';
import { Agency } from '../../../interface/agency/agency';
import { UserManagerService } from '../../../services/user/user.service';
import { User } from '../../../interface/user/user';
import { FileUploaderComponent } from "../file-uploader/file-uploader.component";
import { Station } from '../../../interface/station/station';
import { Segment } from '../../../interface/Segment/Segment';
import { parseServerErrorMessage } from '../../../utils/handleError';

@Component({
  selector: 'app-add-internal-resources-entity',
  imports: [NavBarComponent, TranslateModule, ReactiveFormsModule, RouterModule, FileUploaderComponent],
  templateUrl: './add-internal-resources-entity.component.html',
  styleUrl: './add-internal-resources-entity.component.css'
})
export class AddInternalResourcesEntityComponent implements OnInit {
  entityType: 'plantsection' | 'segment' | 'employee' | 'path' | 'station' = 'plantsection';
  form: FormGroup;
  isSaving: boolean = false;
  redirectLink: string = '/external-resources';
  plantsections: PlantSection[] = [];
  stations: Station[] = [];
  segments: Segment[] = [];
  agencies: Agency[] = [];
  rhManagers: User[] = [];
  psManagers: User[] = [];
  rhSegmentUsers: User[] = [];
  chefSegmentUsers: User[] = [];
  errorMessage: string | null = null;
  successMessage: string | null = null;

  selectedFile: File | null = null;
  isUploading = false;
  uploadProgress = 0;
  uploadMessage: string | null = null;
  isLoading: boolean = false;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private plantsectionServices: PlantSectionService,
    private segmentService: SegmentService,
    private employeeService: EmployeeService,
    private circutService: CircuitService,
    private stationService: StationService,
    private cdr: ChangeDetectorRef,
    private agencyService: AgencyService,
    private userManagerService: UserManagerService,
    private translateService: TranslateService
  ) {
    this.form = this.createForm();
  }

  ngOnInit(): void {
    this.route.params.subscribe({
      next: (params) => {
        this.entityType = params['type'];
        this.form = this.createForm();
        this.clearError();

        switch (this.entityType) {
          case 'plantsection':
            this.redirectLink = '/internal-resources/plantsection';
            break;
          case 'segment':
            this.redirectLink = '/internal-resources/segment';
            break;
          case 'employee':
            this.redirectLink = '/internal-resources/employee';
            break;
          case 'path':
            this.redirectLink = '/internal-resources/path';
            break;
          case 'station':
            this.redirectLink = '/internal-resources/station';
            break;
          default:
            this.redirectLink = '/internal-resources';
            this.handleError('ERROR.UNKNOWN_ENTITY_TYPE', new Error('Invalid entity type'));
            break;
        }

        this.fetchData();
      },
      error: (err) => {
        this.handleError('ERROR.LOADING_PARAMS', err);
      }
    });
  }

  fetchData(): void {
    this.agencyService.getAgencies().subscribe({
      next: (agencies) => {
        this.agencies = agencies;
        this.clearError();
      },
      error: (err) => {
        this.handleError('ERROR.FETCHING_AGENCIES', err);
      },
    });

    this.plantsectionServices.getPlantSections().subscribe({
      next: (plantsections) => {
        this.plantsections = plantsections;
        this.clearError();
      },
      error: (err) => {
        this.handleError('ERROR.FETCHING_PLANTSECTIONS', err);
      },
    });

    // Get all users once and filter them by role
    this.userManagerService.getAllUsers().subscribe({
      next: (allUsers) => {
        // Filter RH Managers (ROLE_RH)
        this.rhManagers = allUsers.filter(user =>
          user.roles?.some(role => role.name === 'ROLE_RH')
        );

        // Filter PS Managers (ROLE_PS)
        this.psManagers = allUsers.filter(user =>
          user.roles?.some(role => role.name === 'ROLE_PS')
        );

        // Filter RH Segment Users (ROLE_RHSG)
        this.rhSegmentUsers = allUsers.filter(user =>
          user.roles?.some(role => role.name === 'ROLE_RHSG')
        );

        // Filter Chef Segment Users (ROLE_CHSG)
        this.chefSegmentUsers = allUsers.filter(user =>
          user.roles?.some(role => role.name === 'ROLE_CHSG')
        );

        this.clearError();
      },
      error: (err) => {
        this.handleError('ERROR.FETCHING_USERS', err);
      }
    });

    this.segmentService.getSegments().subscribe({
      next: (segments) => {
        this.segments = segments;
        this.clearError();
      },
      error: (err) => {
        this.handleError('ERROR.FETCHING_SEGMENTS', err);
      }
    });

    this.stationService.getStations().subscribe({
      next: (stations) => {
        this.stations = stations;
        this.clearError();
      },
      error: (err) => {
        this.handleError('ERROR.FETCHING_STATIONS', err);
      }
    });
  }

  createForm(): FormGroup {
    try {
      switch (this.entityType) {
        case 'plantsection':
          return this.fb.group({
            plantsection_name: ['', Validators.required],
            description: ['', Validators.required],
            emplacement: ['', Validators.required],
            psManagerId: ['', Validators.required],
            rhManagerId: ['', Validators.required],
            organization: ['', Validators.required],
          });
        case 'segment':
          return this.fb.group({
            segment_name: ['', Validators.required],
            costCenter: ['', Validators.required],
            sapRef: ['', Validators.required],
            plantSectionId: ['', Validators.required],
            rhSegmentId: ['', Validators.required],
            chefSegmentId: ['', Validators.required]
          });
        case 'employee':
          return this.fb.group({
            serialNumber: ['', Validators.required],
            lastName: ['', Validators.required],
            firstName: ['', Validators.required],
            againstMaster: ['', Validators.required],
            groupName: [''],
            plantSectionId: ['', Validators.required],
            phoneNumber: ['', [Validators.required, this.phoneNumberValidator()]],
            direct: [false],
            activeForPlanification: [true],
            costCenter: [''],
            stationId: ['', Validators.required],
            segmentId: ['', Validators.required]
          });
        case 'path':
          return this.fb.group({
            pathReference: ['', Validators.required],
            leoniSapReference: ['', Validators.required],
            numberOfKilometres: [null, [Validators.required, Validators.min(0)]],
            employeeContribution: [null, [Validators.required, Validators.min(0)]],
            kilometreCost: [null, [Validators.required, Validators.min(0)]],
            arrivalPoint: ['', Validators.required],
            agencyId: ['', Validators.required],
          });
        case 'station':
          return this.fb.group({
            refRegion: ['', Validators.required],
            refSapLeoni: ['', Validators.required],
            longitude: [null, [Validators.required, Validators.min(-180), Validators.max(180)]],
            latitude: [null, [Validators.required, Validators.min(-90), Validators.max(90)]],
            radius: [null, [Validators.required, Validators.min(0)]]
          });
        default:
          this.handleError('ERROR.UNKNOWN_ENTITY_TYPE', new Error('Invalid entity type'));
          return this.fb.group({});
      }
    } catch (err) {
      this.handleError('ERROR.CREATING_FORM', err);
      return this.fb.group({});
    }
  }

  onSubmit(): void {
    this.markAllAsTouched();

    if (this.form.invalid) {
      this.handleError('ERROR.INVALID_FORM', new Error('Form is invalid'));
      this.cdr.detectChanges();
      return;
    }

    this.form.disable();
    this.isSaving = true;
    this.clearError();

    const newEntity = this.form.value;

    switch (this.entityType) {
      case 'plantsection':
        this.plantsectionServices.addPlantSection(newEntity).subscribe({
          next: () => {
            this.handleSuccess();
          },
          error: (err) => {
            this.handleError('ERROR.ADDING_PLANTSECTION', err);
          }
        });
        break;

      case 'segment':
        this.segmentService.addSegment(newEntity).subscribe({
          next: () => {
            this.handleSuccess();
          },
          error: (err) => {
            this.handleError('ERROR.ADDING_SEGMENT', err);
          }
        });
        break;

      case 'employee':
        this.employeeService.addEmployee(newEntity).subscribe({
          next: () => {
            this.handleSuccess();
          },
          error: (err) => {
            this.handleError('ERROR.ADDING_EMPLOYEE', err);
          }
        });
        break;

      case 'path':
        this.circutService.addPath(newEntity).subscribe({
          next: () => {
            this.handleSuccess();
          },
          error: (err) => {
            this.handleError('ERROR.ADDING_PATH', err);
          }
        });
        break;

      case 'station':
        this.stationService.addStation(newEntity).subscribe({
          next: () => {
            this.handleSuccess();
          },
          error: (err) => {
            this.handleError('ERROR.ADDING_STATION', err);
          }
        });
        break;

      default:
        this.handleError('ERROR.UNKNOWN_ENTITY_TYPE', new Error('Invalid entity type'));
        this.resetFormState();
        break;
    }
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

  getTitle(): string {
    switch (this.entityType) {
      case 'plantsection':
        return 'NEWPLANTSECTION';
      case 'segment':
        return 'NEWSEGMENT';
      case 'employee':
        return 'NEWEMPLOYEE';
      case 'path':
        return 'NEWPATH';
      case 'station':
        return 'NEWSTATION';
      default:
        return 'Add Entity';
    }
  }

  onFileSelected(file: File): void {
    try {
      if (!file) {
        throw new Error('No file provided');
      }

      if (!file.name.endsWith('.xlsx') && !file.name.endsWith('.xls')) {
        throw new Error('Invalid file format. Only Excel files are allowed');
      }

      this.selectedFile = file;
      this.uploadMessage = null;
      this.clearError();
    } catch (error) {
      this.handleError('ERROR.FILE_SELECTION', error);
    }
  }

  handleFileUpload(): void {
    if (!this.selectedFile) {
      this.handleError('ERROR.NO_FILE_SELECTED', new Error('No file selected'));
      return;
    }

    this.isUploading = true;
    this.isLoading = true;
    this.uploadProgress = 0;
    this.clearError();

    const service = this.entityType === 'employee'
      ? this.employeeService
      : this.stationService;

    service.uploadFile(this.selectedFile).subscribe({
      next: (response) => {
        this.isUploading = false;
        this.isLoading = false;

        if (response.success || response.status === 'success') {
          this.successMessage = response.message || this.translateService.instant('SUCCESS.FILE_UPLOADED');
          setTimeout(() => {
            this.selectedFile = null;
            this.router.navigate([this.redirectLink]);
          }, 2000);
        } else {
          this.handleError('ERROR.UPLOAD_FAILED', new Error(response.message || 'Upload failed'));
        }
      },
      error: (error) => {
        this.isUploading = false;
        this.isLoading = false;
        this.handleError('ERROR.UPLOAD_FAILED', error);
      }
    });
  }

  onSave(): void {
    this.handleFileUpload();
  }

  onCancel(): void {
    this.selectedFile = null;
    this.clearError();
  }

  onVerify(): void {
    // Implement verification logic if needed
    console.log('Verification requested for file:', this.selectedFile);
  }

  phoneNumberValidator(): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } | null => {
      const value = control.value;
      const isValid = /^[0-9]{8}$/.test(value);
      return isValid ? null : { phoneNumberLength: { value: value } };
    };
  }

  private handleSuccess(): void {
    this.isSaving = false;
    this.form.enable();
    this.router.navigate([this.redirectLink]);
    this.clearError();
  }

  private resetFormState(): void {
    this.isSaving = false;
    this.form.enable();
    this.cdr.detectChanges();
  }

  private handleError(errorKey: string, error: any): void {
    console.error(errorKey, error);

    const rawMessage = error?.error?.message || error?.message || '';
    const parsed = parseServerErrorMessage(rawMessage);
    const translated = this.translateService.instant(errorKey);

    this.errorMessage = parsed || translated || 'An unexpected error occurred';

    this.cdr.detectChanges();
  }


  private clearError(): void {
    this.errorMessage = null;
    this.successMessage = null;
    this.cdr.detectChanges();
  }
}