import { Component, Input, Output, EventEmitter, ViewChild, AfterViewInit } from '@angular/core';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { CommonModule } from '@angular/common';
import { MatDialog } from '@angular/material/dialog';
import { DeleteConfirmationDialogComponent } from '../../delete-confirmation-dialog-component/delete-confirmation-dialog-component.component';
import { AgencyService } from '../../../services/agency/agency.service';
import { DriverService } from '../../../services/driver/driver.service';
import { VehicleService } from '../../../services/vehicle/vehicle.service';
import { RouterLink } from '@angular/router';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { PlantSectionService } from '../../../services/plant-section/plant-section.service';
import { CircuitService } from '../../../services/circuit/circuit.service';
import { EmployeeService } from '../../../services/employee/employee.service';
import { SegmentService } from '../../../services/segment/segment.service';
import { StationService } from '../../../services/station/station.service';
import { DetailsComponent } from '../../details/details.component';
import { DataService } from '../../../services/data/data.service';
import { User } from '../../../interface/user/user';
import { UserManagerService } from '../../../services/user/user.service';

@Component({
  selector: 'app-data-table',
  standalone: true,
  imports: [CommonModule, MatTableModule, MatSortModule, MatPaginatorModule, RouterLink, TranslateModule],
  templateUrl: './data-table.component.html',
  styleUrls: ['./data-table.component.css'],
})
export class DataTableComponent implements AfterViewInit {
  @Input() data: any[] = [];
  @Input() columns: any[] = [];
  errorMessage: string | null = null;

  dataSource: MatTableDataSource<any> = new MatTableDataSource();
  displayedColumns: string[] = [];

  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  psManagers: User[] = [];
  rhManagers: User[] = [];

  constructor(
    private dataService: DataService,
    private dialog: MatDialog,
    private agencyService: AgencyService,
    private driverService: DriverService,
    private vehicleService: VehicleService,
    private plantsectionService: PlantSectionService,
    private segmentService: SegmentService,
    private employeeService: EmployeeService,
    private circutService: CircuitService,
    private stationService: StationService,
    private userService: UserManagerService,
    private translateService: TranslateService
  ) {}

  ngOnInit(): void {
    this.loadPsManagers();
  }

  loadPsManagers() {
    this.userService.getPsManagers().subscribe({
      next: (managers) => {
        this.psManagers = managers;
        this.clearError();
      },
      error: (err) => {
        this.handleError('ERROR.LOADING_PS_MANAGERS', err);
      },
    });

    this.userService.getRhManagers().subscribe({
      next: (managers) => {
        this.rhManagers = managers;
        this.clearError();
      },
      error: (err) => {
        this.handleError('ERROR.LOADING_RH_MANAGERS', err);
      },
    });
  }

  getPsManagerName(managerId: number): string {
    const psmanager = this.psManagers.find((m) => m.id === managerId);
    return psmanager ? `${psmanager.firstName} ${psmanager.lastName}` : this.translateService.instant('NOT_ASSIGNED');
  }

  getRhManagerName(managerId: number): string {
    const rhmanager = this.rhManagers.find((m) => m.id === managerId);
    return rhmanager ? `${rhmanager.firstName} ${rhmanager.lastName}` : this.translateService.instant('NOT_ASSIGNED');
  }

  ngOnChanges() {
    this.updateTable();
  }

  ngAfterViewInit() {
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
  }

  private updateTable() {
    try {
      this.dataSource.data = this.data || [];
      this.displayedColumns = this.columns.map((col) => col.field);
      if (this.columns.length) {
        this.displayedColumns.push('action');
      }
      this.clearError();
    } catch (err) {
      this.handleError('ERROR.UPDATING_TABLE', err);
    }
  }

  onDeleteClick(item: any): void {
    const entityName = item.name || item.full_name || item.reference_name || item.plantsection_name || item.segment_name || item.serialNumber || item.pathReference || item.refRegion || 'Unknown';
    const dialogRef = this.dialog.open(DeleteConfirmationDialogComponent, {
      data: { entityName, actionType: 'delete' },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.deleteEntity(item);
      }
    });
  }

  deleteEntity(item: any): void {
    const entityId = item.id;
    const entityType = this.getEntityType(item);

    switch (entityType) {
      case 'agency':
        this.agencyService.deleteAgency(entityId).subscribe({
          next: () => {
            this.clearError();
          },
          error: (err) => this.handleError('ERROR.DELETING_AGENCY', err),
        });
        break;
      case 'driver':
        this.driverService.deleteDriver(entityId).subscribe({
          next: () => {
            this.dataService.notifyDataChanged('delete');
            this.clearError();
          },
          error: (err) => this.handleError('ERROR.DELETING_DRIVER', err),
        });
        break;
      case 'vehicle':
        this.vehicleService.deleteVehicle(entityId).subscribe({
          next: () => {
            this.dataService.notifyDataChanged('delete');
            this.clearError();
          },
          error: (err) => this.handleError('ERROR.DELETING_VEHICLE', err),
        });
        break;
      case 'plantsection':
        this.plantsectionService.deletePlantSection(entityId).subscribe({
          next: () => {
            this.dataService.notifyDataChanged('delete');
            this.clearError();
          },
          error: (err) => this.handleError('ERROR.DELETING_PLANTSECTION', err),
        });
        break;
      case 'segment':
        this.segmentService.deleteSegment(entityId).subscribe({
          next: () => {
            this.dataService.notifyDataChanged('delete');
            this.clearError();
          },
          error: (err) => this.handleError('ERROR.DELETING_SEGMENT', err),
        });
        break;
      case 'employee':
        this.employeeService.deleteEmployee(entityId).subscribe({
          next: () => {
            this.dataService.notifyDataChanged('delete');
            this.clearError();
          },
          error: (err) => this.handleError('ERROR.DELETING_EMPLOYEE', err),
        });
        break;
      case 'path':
        this.circutService.deletePath(entityId).subscribe({
          next: () => {
            this.dataService.notifyDataChanged('delete');
            this.clearError();
          },
          error: (err) => this.handleError('ERROR.DELETING_PATH', err),
        });
        break;
      case 'station':
        this.stationService.deleteStation(entityId).subscribe({
          next: () => {
            this.dataService.notifyDataChanged('delete');
            this.clearError();
          },
          error: (err) => this.handleError('ERROR.DELETING_STATION', err),
        });
        break;
      default:
        this.handleError('ERROR.UNKNOWN_ENTITY_TYPE', new Error('Unknown entity type'));
        break;
    }
  }

  getEntityType(item: any): string {
    if (item.hasOwnProperty('nomDeEntreprise')) {
      return 'agency';
    } else if (item.hasOwnProperty('full_name')) {
      return 'driver';
    } else if (item.hasOwnProperty('numDeSeries')) {
      return 'vehicle';
    } else if (item.hasOwnProperty('plantsection_name')) {
      return 'plantsection';
    } else if (item.hasOwnProperty('segment_name')) {
      return 'segment';
    } else if (item.hasOwnProperty('serialNumber')) {
      return 'employee';
    } else if (item.hasOwnProperty('pathReference')) {
      return 'path';
    } else if (item.hasOwnProperty('refRegion')) {
      return 'station';
    }
    return '';
  }

  openDetails(item: any): void {
    try {
      this.dialog.open(DetailsComponent, {
        width: '70vw',
        height: '80vh',
        maxWidth: '2000px',
        maxHeight: '1200px',
        panelClass: 'scrollable-dialog',
        data: { entityType: this.getEntityType(item), item: item },
      });
      this.clearError();
    } catch (err) {
      this.handleError('ERROR.OPENING_DETAILS', err);
    }
  }

  onDesactivateClick(item: any): void {
    const entityName = item.name || item.full_name || item.reference_name || item.plantsection_name || item.segment_name || item.serialNumber || item.pathReference || item.refRegion || 'Unknown';
    const dialogRef = this.dialog.open(DeleteConfirmationDialogComponent, {
      data: { entityName, actionType: 'deactivate' },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.desactivateEntity(item);
      }
    });
  }

  onActivateClick(item: any): void {
    const entityName = item.name || item.full_name || item.reference_name || item.plantsection_name || item.segment_name || item.serialNumber || item.pathReference || item.refRegion || 'Unknown';
    const dialogRef = this.dialog.open(DeleteConfirmationDialogComponent, {
      data: { entityName, actionType: 'activate' },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.activateEntity(item);
      }
    });
  }

  desactivateEntity(item: any): void {
    const entityId = item.id;
    const entityType = this.getEntityType(item);

    switch (entityType) {
      case 'agency':
        this.agencyService.deactivateAgency(entityId).subscribe({
          next: () => {
            item.isDesactivated = true;
            this.dataService.notifyDataChanged('deactivate');
            this.clearError();
          },
          error: (err) => this.handleError('ERROR.DEACTIVATING_AGENCY', err),
        });
        break;
      case 'driver':
        this.driverService.deactivateDriver(entityId).subscribe({
          next: () => {
            item.isDesactivated = true;
            this.dataService.notifyDataChanged('deactivate');
            this.clearError();
          },
          error: (err) => this.handleError('ERROR.DEACTIVATING_DRIVER', err),
        });
        break;
      case 'vehicle':
        this.vehicleService.deactivateVehicle(entityId).subscribe({
          next: () => {
            item.isDesactivated = true;
            this.dataService.notifyDataChanged('deactivate');
            this.clearError();
          },
          error: (err) => this.handleError('ERROR.DEACTIVATING_VEHICLE', err),
        });
        break;
      case 'plantsection':
        this.plantsectionService.deactivatePlantSection(entityId).subscribe({
          next: () => {
            item.isDesactivated = true;
            this.dataService.notifyDataChanged('deactivate');
            this.clearError();
          },
          error: (err) => this.handleError('ERROR.DEACTIVATING_PLANTSECTION', err),
        });
        break;
      case 'segment':
        this.segmentService.deactivateSegment(entityId).subscribe({
          next: () => {
            item.isDesactivated = true;
            this.dataService.notifyDataChanged('deactivate');
            this.clearError();
          },
          error: (err) => this.handleError('ERROR.DEACTIVATING_SEGMENT', err),
        });
        break;
      case 'employee':
        this.employeeService.deactivateEmployee(entityId).subscribe({
          next: () => {
            item.isDesactivated = true;
            this.dataService.notifyDataChanged('deactivate');
            this.clearError();
          },
          error: (err) => this.handleError('ERROR.DEACTIVATING_EMPLOYEE', err),
        });
        break;
      case 'path':
        this.circutService.deactivatePath(entityId).subscribe({
          next: () => {
            item.isDesactivated = true;
            this.dataService.notifyDataChanged('deactivate');
            this.clearError();
          },
          error: (err) => this.handleError('ERROR.DEACTIVATING_PATH', err),
        });
        break;
      case 'station':
        this.stationService.deactivateStation(entityId).subscribe({
          next: () => {
            item.isDesactivated = true;
            this.dataService.notifyDataChanged('deactivate');
            this.clearError();
          },
          error: (err) => this.handleError('ERROR.DEACTIVATING_STATION', err),
        });
        break;
      default:
        this.handleError('ERROR.UNKNOWN_ENTITY_TYPE', new Error('Unknown entity type'));
        break;
    }
  }

  activateEntity(item: any): void {
    const entityId = item.id;
    const entityType = this.getEntityType(item);

    switch (entityType) {
      case 'agency':
        this.agencyService.activateAgency(entityId).subscribe({
          next: () => {
            item.isDesactivated = false;
            this.dataService.notifyDataChanged('activate');
            this.clearError();
          },
          error: (err) => this.handleError('ERROR.ACTIVATING_AGENCY', err),
        });
        break;
      case 'driver':
        this.driverService.activateDriver(entityId).subscribe({
          next: () => {
            item.isDesactivated = false;
            this.dataService.notifyDataChanged('activate');
            this.clearError();
          },
          error: (err) => this.handleError('ERROR.ACTIVATING_DRIVER', err),
        });
        break;
      case 'vehicle':
        this.vehicleService.activateVehicle(entityId).subscribe({
          next: () => {
            item.isDesactivated = false;
            this.dataService.notifyDataChanged('activate');
            this.clearError();
          },
          error: (err) => this.handleError('ERROR.ACTIVATING_VEHICLE', err),
        });
        break;
      case 'plantsection':
        this.plantsectionService.activatePlantSection(entityId).subscribe({
          next: () => {
            item.isDesactivated = false;
            this.dataService.notifyDataChanged('activate');
            this.clearError();
          },
          error: (err) => this.handleError('ERROR.ACTIVATING_PLANTSECTION', err),
        });
        break;
      case 'segment':
        this.segmentService.activateSegment(entityId).subscribe({
          next: () => {
            item.isDesactivated = false;
            this.dataService.notifyDataChanged('activate');
            this.clearError();
          },
          error: (err) => this.handleError('ERROR.ACTIVATING_SEGMENT', err),
        });
        break;
      case 'employee':
        this.employeeService.activateEmployee(entityId).subscribe({
          next: () => {
            item.isDesactivated = false;
            this.dataService.notifyDataChanged('activate');
            this.clearError();
          },
          error: (err) => this.handleError('ERROR.ACTIVATING_EMPLOYEE', err),
        });
        break;
      case 'path':
        this.circutService.activatePath(entityId).subscribe({
          next: () => {
            item.isDesactivated = false;
            this.dataService.notifyDataChanged('activate');
            this.clearError();
          },
          error: (err) => this.handleError('ERROR.ACTIVATING_PATH', err),
        });
        break;
      case 'station':
        this.stationService.activateStation(entityId).subscribe({
          next: () => {
            item.isDesactivated = false;
            this.dataService.notifyDataChanged('activate');
            this.clearError();
          },
          error: (err) => this.handleError('ERROR.ACTIVATING_STATION', err),
        });
        break;
      default:
        this.handleError('ERROR.UNKNOWN_ENTITY_TYPE', new Error('Unknown entity type'));
        break;
    }
  }

  private handleError(errorKey: string, error: any): void {
    console.error(errorKey, error);
    this.errorMessage = this.translateService.instant(errorKey) || 'An unexpected error occurred';
  }

  private clearError(): void {
    this.errorMessage = null;
  }
}