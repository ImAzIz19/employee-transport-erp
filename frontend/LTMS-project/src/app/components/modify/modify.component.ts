import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AgencyService } from '../../services/agency/agency.service';
import { DriverService } from '../../services/driver/driver.service';
import { VehicleService } from '../../services/vehicle/vehicle.service';
import { Agency } from '../../interface/agency/agency';
import { Driver } from '../../interface/driver/driver';
import { Vehicle } from '../../interface/vehicle/vehicle';
import { NavBarComponent } from '../nav-bar/nav-bar.component';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { AbstractControl, ValidatorFn } from '@angular/forms';
import { DataService } from '../../services/data/data.service';
import { parseServerErrorMessage } from '../../utils/handleError';

const ENTITY_TYPES = {
  AGENCY: 'agency',
  DRIVER: 'driver',
  VEHICLE: 'vehicle',
};

const ROUTES = {
  AGENCY: '/external-resources/agencies',
  DRIVER: '/external-resources/drivers',
  VEHICLE: '/external-resources/vehicles',
};

@Component({
  selector: 'app-modify',
  standalone: true,
  imports: [CommonModule, RouterModule, ReactiveFormsModule, NavBarComponent, TranslateModule],
  templateUrl: './modify.component.html',
  styleUrls: ['./modify.component.css'],
})
export class ModifyComponent implements OnInit {
  form: FormGroup;
  entityType: string = '';
  item: any = null;
  agencies: Agency[] = [];
  errorMessage: string | null = null;

  constructor(
    private dataService: DataService,
    private route: ActivatedRoute,
    private router: Router,
    private fb: FormBuilder,
    private agencyService: AgencyService,
    private driverService: DriverService,
    private vehicleService: VehicleService,
    private translateService: TranslateService,
    private cdr: ChangeDetectorRef
  ) {
    this.form = this.fb.group({});
  }

  ngOnInit(): void {
    try {
      this.loadEntityDetails();
      this.fetchAgenciesAndVehicles();
      this.clearError();
    } catch (err) {
      this.handleError('ERROR.INITIALIZING_COMPONENT', err);
    }
  }

  loadEntityDetails(): void {
    const url = this.router.url;

    try {
      if (url.includes('/agencies/modify/agency/')) {
        this.entityType = ENTITY_TYPES.AGENCY;
        const id = this.route.snapshot.paramMap.get('id');
        if (id) {
          const agencyId = Number(id);
          this.agencyService.getAgencyById(agencyId).subscribe({
            next: (data) => {
              this.item = data;
              this.form = this.createForm();
              this.clearError();
              this.cdr.detectChanges();
            },
            error: (err) => {
              this.handleError('ERROR.FETCHING_AGENCY', err);
            },
          });
        } else {
          this.handleError('ERROR.INVALID_ID', new Error('Agency ID is missing'));
        }
      } else if (url.includes('/drivers/modify/driver/')) {
        this.entityType = ENTITY_TYPES.DRIVER;
        const id = this.route.snapshot.paramMap.get('id');
        if (id) {
          const driverId = Number(id);
          this.driverService.getDriverById(driverId).subscribe({
            next: (data) => {
              this.item = data;
              this.form = this.createForm();
              this.clearError();
              this.cdr.detectChanges();
            },
            error: (err) => {
              this.handleError('ERROR.FETCHING_DRIVER', err);
            },
          });
        } else {
          this.handleError('ERROR.INVALID_ID', new Error('Driver ID is missing'));
        }
      } else if (url.includes('/vehicles/modify/vehicle/')) {
        this.entityType = ENTITY_TYPES.VEHICLE;
        const id = this.route.snapshot.paramMap.get('numDeReference');
        if (id) {
          const vehicleId = Number(id);
          this.vehicleService.getVehicleById(vehicleId).subscribe({
            next: (data) => {
              this.item = data;
              this.form = this.createForm();
              this.clearError();
              this.cdr.detectChanges();
            },
            error: (err) => {
              this.handleError('ERROR.FETCHING_VEHICLE', err);
            },
          });
        } else {
          this.handleError('ERROR.INVALID_ID', new Error('Vehicle ID is missing'));
        }
      } else {
        this.handleError('ERROR.UNKNOWN_ENTITY_TYPE', new Error('Invalid entity type'));
      }
    } catch (err) {
      this.handleError('ERROR.LOADING_ENTITY_DETAILS', err);
    }
  }

  fetchAgenciesAndVehicles(): void {
    this.agencyService.getAgencies().subscribe({
      next: (agencies) => {
        this.agencies = agencies;
        this.clearError();
        this.cdr.detectChanges();
      },
      error: (err) => {
        this.handleError('ERROR.FETCHING_AGENCIES', err);
      },
    });
  }

  createForm(): FormGroup {
    try {
      switch (this.entityType) {
        case ENTITY_TYPES.AGENCY:
          const agency = this.item as Agency;
          return this.fb.group({
            nomDeEntreprise: [agency?.nomDeEntreprise || '', Validators.required],
            name: [agency?.name || '', Validators.required],
            address: [agency?.address || '', Validators.required],
            numeroDeTelephone: [agency?.numeroDeTelephone || '', [Validators.required, this.phoneNumberValidator()]],
            email: [agency?.email || '', [Validators.required, Validators.email]],
            matricule: [agency?.matricule || '', Validators.required],
            horaireDeTravail: [agency?.horaireDeTravail || '', Validators.required],
            siteInternet: [agency?.siteInternet || '', Validators.required],
            status: ['ACTIVE', Validators.required],
          });

        case ENTITY_TYPES.DRIVER:
          const driver = this.item as Driver;
          return this.fb.group({
            prenom: [driver?.prenom || '', Validators.required],
            nom: [driver?.nom || '', Validators.required],
            dateDeNaissance: [driver?.dateDeNaissance || '', Validators.required],
            telephone: [driver?.telephone || '', [Validators.required, this.phoneNumberValidator()]],
            agenceId: [driver?.agence?.id || '', Validators.required],
            status: ['ACTIVE', Validators.required],
          });

        case ENTITY_TYPES.VEHICLE:
          const vehicle = this.item as Vehicle;
          return this.fb.group({
            typeDeVehicule: [vehicle?.typeDeVehicule || '', Validators.required],
            numDeSeries: [vehicle?.numDeSeries || '', Validators.required],
            dateDeMiseEnRoute: [vehicle?.dateDeMiseEnRoute || '', Validators.required],
            numDeReference: [vehicle?.numDeReference || '', Validators.required],
            capacite: [vehicle?.capacite || '', Validators.required],
            agenceId: [vehicle?.agence?.id || '', Validators.required],
            status: ['ACTIVE', Validators.required],
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
    try {
      if (this.form.invalid || !this.item) {
        this.handleError('ERROR.INVALID_FORM', new Error('Form is invalid or item is missing'));
        this.markAllAsTouched();
        this.cdr.detectChanges();
        return;
      }

      this.form.disable();

      const updateEntityMap = {
        [ENTITY_TYPES.AGENCY]: () =>
          this.agencyService.updateAgency(this.item.id, this.form.value).subscribe({
            next: () => {
              console.log(this.form.value)
              this.router.navigate([ROUTES.AGENCY]);
              this.clearError();
              this.form.enable();
              this.cdr.detectChanges();
            },
            error: (err) => {
              this.handleError('ERROR.UPDATING_AGENCY', err);
              this.form.enable();
              this.cdr.detectChanges();
            },
          }),
        [ENTITY_TYPES.DRIVER]: () =>
          this.driverService.updateDriver(this.item.id, this.form.value).subscribe({
            next: () => {
              this.router.navigate([ROUTES.DRIVER]);
              this.clearError();
              this.form.enable();
              this.cdr.detectChanges();
            },
            error: (err) => {
              this.handleError('ERROR.UPDATING_DRIVER', err);
              this.form.enable();
              this.cdr.detectChanges();
            },
          }),
        [ENTITY_TYPES.VEHICLE]: () =>
          this.vehicleService.updateVehicle(this.item.id, this.form.value).subscribe({
            next: () => {
              this.router.navigate([ROUTES.VEHICLE]);
              this.clearError();
              this.form.enable();
              this.cdr.detectChanges();
            },
            error: (err) => {
              this.handleError('ERROR.UPDATING_VEHICLE', err);
              this.form.enable();
              this.cdr.detectChanges();
            },
          }),
      };

      if (updateEntityMap[this.entityType]) {
        updateEntityMap[this.entityType]();
      } else {
        this.handleError('ERROR.UNKNOWN_ENTITY_TYPE', new Error('Invalid entity type'));
        this.form.enable();
        this.cdr.detectChanges();
      }
    } catch (err) {
      this.handleError('ERROR.SUBMITTING_FORM', err);
      this.form.enable();
      this.cdr.detectChanges();
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

  phoneNumberValidator(): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } | null => {
      const value = control.value;
      const isValid = /^\d{8}$/.test(value);
      return isValid ? null : { phoneNumberLength: { value: value } };
    };
  }

    private handleError(errorKey: string, error: any): void {
    console.error(errorKey, error);
  
    const rawMessage = error?.error?.message || error?.message || '';
    const parsed = parseServerErrorMessage(rawMessage);
    const translated = this.translateService.instant(errorKey);
  
    this.errorMessage =parsed || translated || 'An unexpected error occurred';
  
    this.cdr.detectChanges();
  }
  

  private clearError(): void {
    this.errorMessage = null;
    this.cdr.detectChanges();
  }
}