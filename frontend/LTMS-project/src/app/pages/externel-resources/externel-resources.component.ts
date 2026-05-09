import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { NavBarComponent } from '../../components/nav-bar/nav-bar.component';
import { RouterOutlet } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { AgencyService } from '../../services/agency/agency.service';
import { VehicleService } from '../../services/vehicle/vehicle.service';
import { DriverService } from '../../services/driver/driver.service';
import { CommonModule } from '@angular/common';
import { FilterExportComponent } from '../../components/shared/filter-export/filter-export.component';
import { DataService } from '../../services/data/data.service';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { parseServerErrorMessage } from '../../utils/handleError';

@Component({
  selector: 'app-externel-resources',
  standalone: true,
  imports: [NavBarComponent, RouterOutlet, FilterExportComponent, CommonModule, TranslateModule],
  templateUrl: './externel-resources.component.html',
  styleUrl: './externel-resources.component.css',
})
export class ExternalResourcesComponent implements OnInit {
  data: any[] = [];
  filteredData: any[] = [];
  columns: any[] = [];
  title: string = '';
  addButtonLabel: string = '';
  addButtonRoute: string = '';
  searchTerm: string = '';
  isDeleted: boolean = false;
  isDesactivated: boolean = false;
  isActivated: boolean = false;
  isAdded: boolean = false;
  isUpdated: boolean = false;
  searchPlaceHolder: string = 'SEARCH';
  errorMessage: string | null = null;

  constructor(
    private route: ActivatedRoute,
    private agencyService: AgencyService,
    private vehicleService: VehicleService,
    private driverService: DriverService,
    private dataService: DataService,
    private translateService: TranslateService,
    private cdr: ChangeDetectorRef
  ) { }

   ngOnInit(): void {
    this.route.params.subscribe({
      next: (params) => {
        const type = params['type'];
        try {
          this.updateDynamicData(type);
          this.loadData(type);
          this.clearError();
          
          // Check if there was a recent action (e.g., 'add')
          const lastAction = this.dataService.getLastAction();
          if (lastAction) {
            this.handleAction(lastAction);
            this.dataService.clearLastAction(); // Clear after handling
          }
        } catch (err) {
          this.handleError('ERROR.INITIALIZING_COMPONENT', err);
        }
      },
      error: (err) => {
        this.handleError('ERROR.LOADING_PARAMS', err);
      }
    });

    this.dataService.dataChanged$.subscribe({
      next: (action) => {
        console.log('Received action:', action);
        const type = this.route.snapshot.params['type'];
        try {
          this.loadData(type);
          this.handleAction(action); // Extract action handling into a method
          this.clearError();
        } catch (err) {
          this.handleError('ERROR.HANDLING_DATA_CHANGE', err);
        }
      },
      error: (err) => {
        this.handleError('ERROR.SUBSCRIBING_DATA_CHANGE', err);
      }
    });
  }

  // New method to handle actions consistently
  private handleAction(action: 'delete' | 'deactivate' | 'activate' | 'add' | 'update'): void {
    this.isDeleted = action === 'delete';
    this.isDesactivated = action === 'deactivate';
    this.isActivated = action === 'activate';
    this.isAdded = action === 'add';
    this.isUpdated = action === 'update';
    this.cdr.detectChanges(); // Ensure UI updates
  }

  updateDynamicData(type: string): void {
    try {
      switch (type) {
        case 'agencies':
          this.title = 'AGENCES';
          this.addButtonLabel = 'NEWAGENCY';
          this.addButtonRoute = `/external-resources/${type}/new`;
          this.searchPlaceHolder = 'SEARCHAGENCY';
          break;
        case 'vehicles':
          this.title = 'VEHICULES';
          this.addButtonLabel = 'NEWVEHICLE';
          this.addButtonRoute = `/external-resources/${type}/new`;
          this.searchPlaceHolder = 'SEARCHVEHICLE';
          break;
        case 'drivers':
          this.title = 'CHAUFF';
          this.addButtonLabel = 'NEWDRIVER';
          this.addButtonRoute = `/external-resources/${type}/new`;
          this.searchPlaceHolder = 'SEARCHDRIVER';
          break;
        default:
          this.title = 'External Resources';
          this.addButtonLabel = 'Add';
          this.addButtonRoute = '/external-resources';
          this.searchPlaceHolder = 'SEARCH';
          this.handleError('ERROR.UNKNOWN_ENTITY_TYPE', new Error('Invalid entity type'));
          break;
      }
      this.cdr.detectChanges();
    } catch (err) {
      this.handleError('ERROR.UPDATING_DYNAMIC_DATA', err);
    }
  }

  loadData(type: string): void {
    try {
      switch (type) {
        case 'agencies':
          this.agencyService.getAgencies().subscribe({
            next: (data) => {
              this.data = data;
              this.filteredData = data;
              this.columns = [
                { field: 'nomDeEntreprise', header: 'NAME' },
                { field: 'email', header: 'EMAIL' },
                { field: 'numberOfVehicles', header: 'VEHICLECOUNT' },
                { field: 'numberOfDrivers', header: 'DRIVERCOUNT' },
              ];
              this.clearError();
              this.cdr.detectChanges();
            },
            error: (err) => {
              this.handleError('ERROR.FETCHING_AGENCIES', err);
            }
          });
          break;

        case 'vehicles':
          this.vehicleService.getVehicles().subscribe({
            next: (data) => {
              this.data = data.map((vehicle) => ({
                ...vehicle,
                agenceName: vehicle.agence.nomDeEntreprise,
              }));
              this.filteredData = this.data;
              this.columns = [
                { field: 'numDeReference', header: 'REFERENCENAME' },
                { field: 'numDeSeries', header: 'LICENSEPLATE' },
                { field: 'agenceName', header: 'AGENCY-NAME' },
                { field: 'capacite', header: 'CAPACITY' },
              ];
              this.clearError();
              this.cdr.detectChanges();
            },
            error: (err) => {
              this.handleError('ERROR.FETCHING_VEHICLES', err);
            }
          });
          break;

        case 'drivers':
          this.driverService.getDrivers().subscribe({
            next: (data) => {
              this.data = data.map((driver) => ({
                ...driver,
                full_name: `${driver.prenom} ${driver.nom}`,
                agenceName: driver.agence.nomDeEntreprise,
              }));
              this.filteredData = this.data;
              this.columns = [
                { field: 'full_name', header: 'NAME' },
                { field: 'agenceName', header: 'AGENCY-NAME' },
                { field: 'telephone', header: 'PHONE' },
                { field: 'dateDeNaissance', header: 'DATEOFBIRTH' },
              ];
              this.clearError();
              this.cdr.detectChanges();
            },
            error: (err) => {
              this.handleError('ERROR.FETCHING_DRIVERS', err);
            }
          });
          break;

        default:
          this.data = [];
          this.filteredData = [];
          this.columns = [];
          this.handleError('ERROR.UNKNOWN_ENTITY_TYPE', new Error('Invalid entity type'));
          this.cdr.detectChanges();
          break;
      }
    } catch (err) {
      this.handleError('ERROR.LOADING_DATA', err);
    }
  }

   private handleError(errorKey: string, error: any): void {
    console.error(errorKey, error);
    // Use parseServerErrorMessage to process the raw error message
    const rawMessage = error.message || error?.error?.message || error.toString();
    const parsedMessage = parseServerErrorMessage(rawMessage);
    // Use the parsed message if available, otherwise fall back to translated errorKey
    this.errorMessage = parsedMessage || this.translateService.instant(errorKey) || 'Une erreur inattendue est survenue';
    this.cdr.detectChanges();
  }

  private clearError(): void {
    this.errorMessage = null;
    this.cdr.detectChanges();
  }
}