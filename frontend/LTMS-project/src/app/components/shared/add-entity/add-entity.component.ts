import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AgencyService } from '../../../services/agency/agency.service';
import { VehicleService } from '../../../services/vehicle/vehicle.service';
import { DriverService } from '../../../services/driver/driver.service';
import { NavBarComponent } from '../../../components/nav-bar/nav-bar.component';
import { RouterModule } from '@angular/router';
import { Agency } from '../../../interface/agency/agency';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { AbstractControl, ValidatorFn } from '@angular/forms';
import { DataService } from '../../../services/data/data.service';
import { parseServerErrorMessage } from '../../../utils/handleError';

@Component({
  selector: 'app-add-entity',
  standalone: true,
  imports: [ReactiveFormsModule, NavBarComponent, RouterModule, TranslateModule],
  templateUrl: './add-entity.component.html',
  styleUrls: ['./add-entity.component.css'],
})
export class AddEntityComponent implements OnInit {
  entityType: 'agencies' | 'vehicles' | 'drivers' = 'agencies';
  form: FormGroup;
  errorMessage: string | null = null;
  redirectLink: string = '/external-resources';
  agencies: Agency[] = [];

  constructor(
    private dataService: DataService,
    private fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private agencyService: AgencyService,
    private vehicleService: VehicleService,
    private driverService: DriverService,
    private cdr: ChangeDetectorRef,
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
          case 'agencies':
            this.redirectLink = '/external-resources/agencies';
            break;
          case 'vehicles':
            this.redirectLink = '/external-resources/vehicles';
            break;
          case 'drivers':
            this.redirectLink = '/external-resources/drivers';
            break;
          default:
            this.redirectLink = '/external-resources';
            this.handleError('ERROR.UNKNOWN_ENTITY_TYPE', new Error('Invalid entity type'));
            break;
        }

        this.fetchData();
      },
      error: (err) => {
        this.handleError('ERROR.LOADING_PARAMS', err);
      },
    });
  }

  fetchData(): void {
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
        case 'agencies':
          return this.fb.group({
            nomDeEntreprise: ['', Validators.required],
            name: ['', Validators.required],
            address: ['', Validators.required],
            numeroDeTelephone: ['', [Validators.required, this.phoneNumberValidator()]],
            email: ['', [Validators.required, Validators.email]],
            matricule: ['', Validators.required],
            horaireDeTravail: ['', Validators.required],
            siteInternet: ['', Validators.required],
            status: ['ACTIVE', Validators.required],
          });

        case 'vehicles':
          return this.fb.group({
            typeDeVehicule: ['', Validators.required],
            numDeSeries: ['', Validators.required],
            dateDeMiseEnRoute: ['', Validators.required],
            numDeReference: ['', Validators.required],
            capacite: ['', Validators.required],
            agenceId: ['', Validators.required],
            status: ['ACTIVE', Validators.required],
          });

        case 'drivers':
          return this.fb.group({
            prenom: ['', Validators.required],
            nom: ['', Validators.required],
            dateDeNaissance: ['', Validators.required],
            telephone: ['', Validators.required],
            agenceId: ['', Validators.required],
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
    this.markAllAsTouched();

    if (this.form.invalid) {
      this.handleError('ERROR.INVALID_FORM', new Error('Form is invalid'));
      this.cdr.detectChanges();
      return;
    }

    this.form.disable();

    const newEntity = this.form.value;

    switch (this.entityType) {
      case 'agencies':
        this.agencyService.addAgency(newEntity).subscribe({
          next: (response) => {
            this.form.enable();
            setTimeout(() => { // Small delay to ensure notification is processed
              this.router.navigate([this.redirectLink]);
            }, 100);
            this.clearError();
          },
          error: (err) => {
            this.handleError('ERROR.ADDING_AGENCY', err);
            this.form.enable();
            this.cdr.detectChanges();
          },
        });
        break;

      case 'vehicles':
        this.vehicleService.addVehicle(newEntity).subscribe({
          next: (response) => {
            this.form.enable();
            setTimeout(() => { // Small delay to ensure notification is processed
              this.router.navigate([this.redirectLink]);
            }, 100);
            this.clearError();
          },
          error: (err) => {
            this.handleError('ERROR.ADDING_VEHICLE', err);
            this.form.enable();
            this.cdr.detectChanges();
          },
        });
        break;

      case 'drivers':
        this.driverService.addDriver(newEntity).subscribe({
          next: (response) => {
            this.form.enable();
            setTimeout(() => { // Small delay to ensure notification is processed
              this.router.navigate([this.redirectLink]);
            }, 100);
            this.clearError();
          },
          error: (err) => {
            this.handleError('ERROR.ADDING_DRIVER', err);
            this.form.enable();
            this.cdr.detectChanges();
          },
        });
        break;

      default:
        this.handleError('ERROR.UNKNOWN_ENTITY_TYPE', new Error('Invalid entity type'));
        this.form.enable();
        this.cdr.detectChanges();
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
      case 'agencies':
        return 'NEWAGENCY';
      case 'vehicles':
        return 'NEWVEHICLE';
      case 'drivers':
        return 'NEWDRIVER';
      default:
        return 'Add Entity';
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