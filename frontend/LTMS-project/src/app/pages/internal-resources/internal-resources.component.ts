import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { FilterExportComponent } from '../../components/shared/filter-export/filter-export.component';
import { NavBarComponent } from '../../components/nav-bar/nav-bar.component';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { ActivatedRoute, RouterOutlet } from '@angular/router';
import { DataService } from '../../services/data/data.service';
import { PlantSectionService } from '../../services/plant-section/plant-section.service';
import { CommonModule } from '@angular/common';
import { SegmentService } from '../../services/segment/segment.service';
import { EmployeeService } from '../../services/employee/employee.service';
import { CircuitService } from '../../services/circuit/circuit.service';
import { StationService } from '../../services/station/station.service';
import { User } from '../../interface/user/user';
import { UserManagerService } from '../../services/user/user.service';

@Component({
  selector: 'app-internal-resources',
  standalone: true,
  imports: [FilterExportComponent, NavBarComponent, TranslateModule, RouterOutlet, CommonModule],
  templateUrl: './internal-resources.component.html',
  styleUrls: ['./internal-resources.component.css'],
})
export class InternalResourcesComponent implements OnInit {
  data: any[] = [];
  filteredData: any[] = [];
  columns: any[] = [];
  title: string = '';
  addButtonLabel: string = '';
  importButtonLabel: string = '';
  importButtonRoute: string = '';
  addButtonRoute: string = '';
  searchTerm: string = '';
  isDeleted: boolean = false;
  isDesactivated: boolean = false;
  isActivated: boolean = false;
  isAdded: boolean = false;
  isUpdated: boolean = false;
  searchPlaceHolder: string = 'SEARCH';
  psManagers: User[] = [];
  errorMessage: string | null = null;

  constructor(
    private route: ActivatedRoute,
    private dataService: DataService,
    private plantSection: PlantSectionService,
    private segmentService: SegmentService,
    private employeeService: EmployeeService,
    private circuitService: CircuitService,
    private stationService: StationService,
    private userService: UserManagerService,
    private translateService: TranslateService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
  try {
    this.route.params.subscribe({
      next: (params) => {
        const type = params['type'];
        try {
          this.updateDynamicData(type);
          this.loadData(type);
          this.clearError();

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
      },
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

    this.loadPsManagers();
  } catch (err) {
    this.handleError('ERROR.INITIALIZING_COMPONENT', err);
  }
}

  loadPsManagers(): void {
    this.userService.getPsManagers().subscribe({
      next: (managers) => {
        this.psManagers = managers;
        this.clearError();
        this.cdr.detectChanges();
      },
      error: (err) => {
        this.handleError('ERROR.FETCHING_PS_MANAGERS', err);
      },
    });
  }
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
        case 'plantsection':
          this.title = 'PLANTSECTION';
          this.addButtonLabel = 'NEWPLANTSECTION';
          this.addButtonRoute = `/internal-resources/${type}/new`;
          this.searchPlaceHolder = 'SEARCHPLANTSECTION';
          break;
        case 'segment':
          this.title = 'SEGMENT';
          this.addButtonLabel = 'NEWSEGMENT';
          this.addButtonRoute = `/internal-resources/${type}/new`;
          this.searchPlaceHolder = 'SEARCHSEGMENT';
          break;
        case 'employee':
          this.title = 'EMPLOYEE';
          this.addButtonLabel = 'NEWEMPLOYEE';
          this.addButtonRoute = `/internal-resources/${type}/new`;
          this.importButtonLabel = 'MYACTION';
          this.importButtonRoute = `/internal-resources/${type}/import`;
          this.searchPlaceHolder = 'SEARCHEMPLOYEE';
          break;
        case 'path':
          this.title = 'PATH';
          this.addButtonLabel = 'NEWPATH';
          this.addButtonRoute = `/internal-resources/${type}/new`;
          this.searchPlaceHolder = 'SEARCHPATH';
          break;
        case 'station':
          this.title = 'STATION';
          this.addButtonLabel = 'NEWSTATION';
          this.addButtonRoute = `/internal-resources/${type}/new`;
          this.searchPlaceHolder = 'SEARCHSTATION';
          break;
        default:
          this.title = 'Internal Resources';
          this.addButtonLabel = 'Add';
          this.addButtonRoute = '/internal-resources';
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
        case 'plantsection':
          this.plantSection.getPlantSections().subscribe({
            next: (data) => {
              this.data = data;
              this.filteredData = data;
              this.columns = [
                { field: 'plantsection_name', header: 'PLANTSECTIONNAME' },
                { field: 'description', header: 'DESCRIPTION' },
                { field: 'psManagerId', header: 'MANAGER' },
                { field: 'rhManagerId', header: 'RH-RESPONSABLE' },
              ];
              this.clearError();
              this.cdr.detectChanges();
            },
            error: (err) => {
              this.handleError('ERROR.FETCHING_PLANT_SECTIONS', err);
            },
          });
          break;
        case 'segment':
          this.segmentService.getSegments().subscribe({
            next: (data) => {
              this.data = data;
              this.filteredData = data;
              this.columns = [
                { field: 'segment_name', header: 'SEGMENT_NAME' },
                { field: 'costCenter', header: 'COST_CENTER' },
                { field: 'sapRef', header: 'SAPREF' },
                { field: 'plantSectionId', header: 'PLANTSECTION' },
              ];
              this.clearError();
              this.cdr.detectChanges();
            },
            error: (err) => {
              this.handleError('ERROR.FETCHING_SEGMENTS', err);
            },
          });
          break;
        case 'employee':
          this.employeeService.getEmployees().subscribe({
            next: (data) => {
              this.data = data;
              this.filteredData = data;
              this.columns = [
                { field: 'serialNumber', header: 'EMPLOYEE_ID' },
                { field: 'lastName', header: 'LAST_NAME' },
                { field: 'firstName', header: 'FIRST_NAME' },
                { field: 'againstMaster', header: 'IS_COUNTER_MASTER' },
              ];
              this.clearError();
              this.cdr.detectChanges();
            },
            error: (err) => {
              this.handleError('ERROR.FETCHING_EMPLOYEES', err);
            },
          });
          break;
        case 'path':
          this.circuitService.getPaths().subscribe({
            next: (data) => {
              this.data = data;
              this.filteredData = data;
              this.columns = [
                { field: 'pathReference', header: 'PATH_REFERENCE' },
                { field: 'leoniSapReference', header: 'LEONI_SAP_REFERENCE' },
                { field: 'numberOfKilometres', header: 'NUMBER_OF_KILOMETRES' },
                { field: 'employeeContribution', header: 'EMPLOYEE_CONTRIBUTION' },
              ];
              this.clearError();
              this.cdr.detectChanges();
            },
            error: (err) => {
              this.handleError('ERROR.FETCHING_PATHS', err);
            },
          });
          break;
        case 'station':
          this.stationService.getStations().subscribe({
            next: (data) => {
              this.data = data;
              this.filteredData = data;
              this.columns = [
                { field: 'refRegion', header: 'REF_REGION' },
                { field: 'refSapLeoni', header: 'REF_SAP_LEONI' },
                { field: 'longitude', header: 'LONGITUDE' },
                { field: 'latitude', header: 'LATITUDE' },
              ];
              this.clearError();
              this.cdr.detectChanges();
            },
            error: (err) => {
              this.handleError('ERROR.FETCHING_STATIONS', err);
            },
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

  onSearchTermChange(term: string): void {
    try {
      this.searchTerm = term.toLowerCase();
      this.filteredData = this.data.filter((item) => {
        switch (this.title) {
          case 'PLANTSECTION':
            return item.plantsection_name?.toLowerCase().includes(this.searchTerm);
          case 'SEGMENT':
            return item.segment_name?.toLowerCase().includes(this.searchTerm);
          case 'EMPLOYEE':
            return item.firstName?.toLowerCase().includes(this.searchTerm);
          case 'PATH':
            return item.pathReference?.toLowerCase().includes(this.searchTerm);
          case 'STATION':
            return item.refRegion?.toLowerCase().includes(this.searchTerm);
          default:
            return true;
        }
      });
      this.cdr.detectChanges();
    } catch (err) {
      this.handleError('ERROR.FILTERING_DATA', err);
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