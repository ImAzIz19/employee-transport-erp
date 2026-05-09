import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators, AbstractControl, ValidatorFn } from '@angular/forms';
import { PlantSection } from '../../interface/plant-section/plant-section';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { PlantSectionService } from '../../services/plant-section/plant-section.service';
import { NavBarComponent } from "../nav-bar/nav-bar.component";
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { CommonModule } from '@angular/common';
import { Segment } from '../../interface/Segment/Segment';
import { Employee } from '../../interface/Employee/Employee';
import { Path } from '../../interface/circuit/circuit';
import { Station } from '../../interface/station/station';
import { CircuitService } from '../../services/circuit/circuit.service';
import { EmployeeService } from '../../services/employee/employee.service';
import { SegmentService } from '../../services/segment/segment.service';
import { StationService } from '../../services/station/station.service';
import { AgencyService } from '../../services/agency/agency.service';
import { Agency } from '../../interface/agency/agency';
import { UserManagerService } from '../../services/user/user.service';
import { User } from '../../interface/user/user';
import { StationSelectorComponent } from "../station-selector/station-selector.component";
import { parseServerErrorMessage } from '../../utils/handleError';

export const ENTITY_TYPES = {
  PLANTSECTION: 'plantsection',
  SEGMENT: 'segment',
  EMPLOYEE: 'employee',
  PATH: 'path',
  STATION: 'station'
}

export type EntityType = keyof typeof ENTITY_TYPES;

const ROUTES = {
  PLANTSECTION: '/internal-resources/plantsection',
  SEGMENT: '/internal-resources/segment',
  EMPLOYEE: '/internal-resources/employee',
  PATH: '/internal-resources/path',
  STATION: '/internal-resources/station',
};

@Component({
  selector: 'app-modify-internal-resources',
  imports: [NavBarComponent, TranslateModule, ReactiveFormsModule, CommonModule, RouterModule, StationSelectorComponent],
  templateUrl: './modify-internal-resources.component.html',
  styleUrl: './modify-internal-resources.component.css'
})
export class ModifyInternalResourcesComponent implements OnInit {
  form: FormGroup;
  entityType: string = '';
  item: any = null;
  isUpdating: boolean = false;
  plantsections: PlantSection[] = [];
  agencies: Agency[] = [];
  rhManagers: User[] = [];
  psManagers: User[] = [];
  rhSegmentUsers: User[] = [];
  chefSegmentUsers: User[] = [];
  availableStations: Station[] = [];
  selectedStationIds: Set<number> = new Set<number>();
  arrivalPoint: string = 'ARRIVÉE: MAIN SQUARE';
  stations: Station[] = [];
  segments: Segment[] = [];
  errorMessage: string | null = null;
  successMessage: string | null = null;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private fb: FormBuilder,
    private plantsectionService: PlantSectionService,
    private segmentService: SegmentService,
    private employeeService: EmployeeService,
    private circutService: CircuitService,
    private stationService: StationService,
    private agencyService: AgencyService,
    private userManagerService: UserManagerService,
    private translateService: TranslateService,
    private cdr: ChangeDetectorRef
  ) {
    this.form = this.fb.group({});
  }

  ngOnInit(): void {
    this.loadEntityDetails();
    this.fetchAgenciesAndVehicles();
  }

  loadEntityDetails(): void {
    const url = this.router.url;
    if (url.includes('/plantsections/modify/plantsection/')) {
      this.entityType = 'plantsection';
      const id = this.route.snapshot.paramMap.get('id');
      if (id) {
        this.plantsectionService.getPlantSectionById(Number(id)).subscribe({
          next: (data) => {
            this.item = data;
            console.log('Fetched PlantSection:', this.item);
            this.form = this.createForm();
            this.clearError();
          },
          error: (err) => {
            this.handleError('ERROR.FETCHING_PLANTSECTION', err);
          }
        });
      }
    } else if (url.includes('/segments/modify/segment/')) {
      this.entityType = 'segment';
      const id = this.route.snapshot.paramMap.get('id');
      if (id) {
        this.segmentService.getSegmentById(Number(id)).subscribe({
          next: (data) => {
            this.item = data;
            this.form = this.createForm();
            this.clearError();
          },
          error: (err) => {
            this.handleError('ERROR.FETCHING_SEGMENT', err);
          }
        });
      }
    } else if (url.includes('/employees/modify/employee/')) {
      this.entityType = 'employee';
      const id = this.route.snapshot.paramMap.get('id');
      if (id) {
        this.employeeService.getEmployeeById(Number(id)).subscribe({
          next: (data) => {
            this.item = data;
            this.form = this.createForm();
            this.clearError();
          },
          error: (err) => {
            this.handleError('ERROR.FETCHING_EMPLOYEE', err);
          }
        });
      }
    } else if (url.includes('/paths/modify/path/')) {
      this.entityType = 'path';
      const id = this.route.snapshot.paramMap.get('id');
      if (id) {
        this.circutService.getPathById(Number(id)).subscribe({
          next: (data) => {
            if (!data) {
              // Handle null case - maybe show an error or redirect
              this.handleError('ERROR.PATH_NOT_FOUND', new Error('Path not found'));
              return;
            }

            this.item = data;
            if (data.stations) {
              this.selectedStationIds = new Set<number>([...data.stations]);
            } else {
              this.selectedStationIds = new Set<number>();
            }
            this.form = this.createForm();
            this.clearError();
          },
          error: (err) => {
            this.handleError('ERROR.FETCHING_PATH', err);
          }
        });
      }
    } else if (url.includes('/stations/modify/station/')) {
      this.entityType = 'station';
      const id = this.route.snapshot.paramMap.get('id');
      if (id) {
        this.stationService.getStationById(Number(id)).subscribe({
          next: (data) => {
            this.item = data;
            this.form = this.createForm();
            this.clearError();
          },
          error: (err) => {
            this.handleError('ERROR.FETCHING_STATION', err);
          }
        });
      }
    }
  }

  fetchAgenciesAndVehicles(): void {
    this.agencyService.getAgencies().subscribe({
      next: (agencies) => {
        this.agencies = agencies;
        this.clearError();
      },
      error: (err) => {
        this.handleError('ERROR.FETCHING_AGENCIES', err);
      }
    });

    this.plantsectionService.getPlantSections().subscribe({
      next: (plantsections) => {
        this.plantsections = plantsections;
        this.clearError();
      },
      error: (err) => {
        this.handleError('ERROR.FETCHING_PLANTSECTIONS', err);
      }
    });


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

    this.stationService.getStations().subscribe({
      next: (stations) => {
        this.stations = stations;
        this.availableStations = stations;
        if (this.selectedStationIds.size > 0) {
          this.availableStations = this.availableStations.filter(avail =>
            ![...this.selectedStationIds].some(sel => sel === avail.id)
          );
        }
        this.clearError();
      },
      error: (err) => {
        this.handleError('ERROR.FETCHING_STATIONS', err);
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
  }

  createForm(): FormGroup {
    try {
      switch (this.entityType) {
        case ENTITY_TYPES.PLANTSECTION:
          const plantsection = this.item as PlantSection;
          return this.fb.group({
            plantsection_name: [plantsection?.plantsection_name || '', Validators.required],
            description: [plantsection?.description || '', Validators.required],
            emplacement: [plantsection?.emplacement || '', Validators.required],
            psManagerId: [plantsection?.psManagerId || null, Validators.required], // Required validator
            rhManagerId: [plantsection?.rhManagerId || null, Validators.required], // Required validator
            organization: [plantsection?.organization || '', Validators.required]
          });
        case ENTITY_TYPES.SEGMENT:
          const segment = this.item as Segment;
          return this.fb.group({
            segment_name: [segment?.segment_name || '', Validators.required],
            costCenter: [segment?.costCenter || '', Validators.required],
            sapRef: [segment?.sapRef || '', Validators.required],
            plantSectionId: [segment?.plantSectionId || '', Validators.required],
            rhSegmentId: [segment?.rhSegmentId || '', Validators.required],
            chefSegmentId: [segment?.chefSegmentId || '', Validators.required]
          });
        case ENTITY_TYPES.EMPLOYEE:
          const employee = this.item as Employee;
          return this.fb.group({
            serialNumber: [employee?.serialNumber || '', Validators.required],
            lastName: [employee?.lastName || '', Validators.required],
            firstName: [employee?.firstName || '', Validators.required],
            againstMaster: [employee?.againstMaster || '', Validators.required],
            groupName: [employee?.groupName || ''],
            plantSectionId: [employee?.plantSectionId || '', Validators.required],
            phoneNumber: [employee?.phoneNumber || '', [Validators.required, this.phoneNumberValidator()]],
            direct: [employee?.direct || false],
            activeForPlanification: [employee?.activeForPlanification || true],
            costCenter: [employee?.costCenter || ''],
            stationId: [employee?.stationId || '', Validators.required],
            segmentId: [employee?.segmentId || '', Validators.required]
          });
        case ENTITY_TYPES.PATH:
          const path = this.item as Path;
          return this.fb.group({
            pathReference: [path?.pathReference || '', Validators.required],
            leoniSapReference: [path?.leoniSapReference || '', Validators.required],
            numberOfKilometres: [path?.numberOfKilometres || null, [Validators.required, Validators.min(0)]],
            employeeContribution: [path?.employeeContribution || null, [Validators.required, Validators.min(0)]],
            kilometreCost: [path?.kilometreCost || null, [Validators.min(0)]],
            arrivalPoint: [path?.arrivalPoint || '', Validators.required],
            agencyId: [path?.agencyId || '', Validators.required],
          });
        case ENTITY_TYPES.STATION:
          const station = this.item as Station;
          return this.fb.group({
            refRegion: [station?.refRegion || '', Validators.required],
            refSapLeoni: [station?.refSapLeoni || '', Validators.required],
            longitude: [station?.longitude || null, [Validators.required, Validators.min(-180), Validators.max(180)]],
            latitude: [station?.latitude || null, [Validators.required, Validators.min(-90), Validators.max(90)]],
            radius: [station?.radius || 50, [Validators.required, Validators.min(1)]]
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
      this.handleError('ERROR.INVALID_FORM', new Error('Form contains invalid data'));
      return;
    }

    if (!this.item) {
      this.handleError('ERROR.NO_ITEM_TO_UPDATE', new Error('No item loaded for update'));
      return;
    }

    this.isUpdating = true;
    this.form.disable();
    this.clearError();
    console.log('Form submitted:', this.form.value);
    const updateEntityMap = {
      [ENTITY_TYPES.PLANTSECTION]: () =>
        this.plantsectionService.updatePlantSection(this.item.id, this.form.value).subscribe({
          next: () => this.handleSuccess(ROUTES.PLANTSECTION),
          error: (err) => this.handleError('ERROR.UPDATING_PLANTSECTION', err)
        }),
      [ENTITY_TYPES.SEGMENT]: () =>
        this.segmentService.updateSegment(this.item.id, this.form.value).subscribe({
          next: () => this.handleSuccess(ROUTES.SEGMENT),
          error: (err) => this.handleError('ERROR.UPDATING_SEGMENT', err)
        }),
      [ENTITY_TYPES.EMPLOYEE]: () =>
        this.employeeService.updateEmployee(this.item.id, this.form.value).subscribe({
          next: () => this.handleSuccess(ROUTES.EMPLOYEE),
          error: (err) => this.handleError('ERROR.UPDATING_EMPLOYEE', err)
        }),
      [ENTITY_TYPES.PATH]: () => {
        const stationArray = Array.from(this.selectedStationIds);
        const formData = {
          ...this.form.value,
          stations: stationArray
        };

        this.circutService.updatePath(this.item.id, formData).subscribe({
          next: () => this.handleSuccess(ROUTES.PATH),
          error: (err) => this.handleError('ERROR.UPDATING_PATH', err)
        });
      },
      [ENTITY_TYPES.STATION]: () =>
        this.stationService.updateStation(this.item.id, this.form.value).subscribe({
          next: () => this.handleSuccess(ROUTES.STATION),
          error: (err) => this.handleError('ERROR.UPDATING_STATION', err)
        })
    };

    updateEntityMap[this.entityType]();
  }

  getRedirectLink(): string {
    switch (this.entityType) {
      case ENTITY_TYPES.PLANTSECTION: return ROUTES.PLANTSECTION;
      case ENTITY_TYPES.SEGMENT: return ROUTES.SEGMENT;
      case ENTITY_TYPES.EMPLOYEE: return ROUTES.EMPLOYEE;
      case ENTITY_TYPES.PATH: return ROUTES.PATH;
      case ENTITY_TYPES.STATION: return ROUTES.STATION;
      default: return '/';
    }
  }

  onStationSelected(stationId: number) {
    if (!this.selectedStationIds.has(stationId)) {
      this.selectedStationIds.add(stationId);
      this.availableStations = this.availableStations.filter(s => s.id !== stationId);
    }
  }

  onStationRemoved(stationId: number): void {
    this.selectedStationIds.delete(stationId);
    this.stationService.getStationById(stationId).subscribe({
      next: (station) => {
        if (station) {
          this.availableStations.push(station);
          this.clearError();
        } else {
          this.handleError('ERROR.FETCHING_STATION', new Error('Station not found or insufficient permissions'));
        }
      },
      error: (err) => {
        this.handleError('ERROR.FETCHING_STATION', err);
      }
    });
  }
  phoneNumberValidator(): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } | null => {
      const value = control.value;
      const isValid = /^[0-9]{8}$/.test(value);
      return isValid ? null : { phoneNumberInvalid: true };
    };
  }

  private markAllAsTouched(): void {
    try {
      Object.keys(this.form.controls).forEach(key => {
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

  private handleSuccess(redirectRoute: string): void {
    this.isUpdating = false;
    this.form.enable();
    this.successMessage = this.translateService.instant(`SUCCESS.${this.entityType.toUpperCase()}_UPDATED`);
    setTimeout(() => {
      this.router.navigate([redirectRoute]);
    }, 1500);
  }

  private handleError(errorKey: string, error: any): void {
    console.error(errorKey, error);

    const rawMessage = error?.error?.message || error?.message || '';
    const parsed = parseServerErrorMessage(rawMessage);
    const translated = this.translateService.instant(errorKey);

    this.errorMessage = parsed || translated || 'An unexpected error occurred';

    this.cdr.detectChanges();
  }

  private nullValidator(): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } | null => {
      return control.value === null ? { required: true } : null;
    };
  }

  private clearError(): void {
    this.errorMessage = null;
    this.successMessage = null;
    this.cdr.detectChanges();
  }
}