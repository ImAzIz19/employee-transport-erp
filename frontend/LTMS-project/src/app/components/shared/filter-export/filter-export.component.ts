import { Component, Input, Output, EventEmitter, inject } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { DataTableComponent } from '../data-table/data-table.component';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { TranslateModule } from '@ngx-translate/core';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Observable } from 'rxjs';
import { AgencyService } from '../../../services/agency/agency.service';
import { DriverService } from '../../../services/driver/driver.service';
import { PlantSectionService } from '../../../services/plant-section/plant-section.service';
import { SegmentService } from '../../../services/segment/segment.service';
import { VehicleService } from '../../../services/vehicle/vehicle.service';
import { EmployeeService } from '../../../services/employee/employee.service';
import { CircuitService } from '../../../services/circuit/circuit.service';
import { StationService } from '../../../services/station/station.service';

@Component({
  selector: 'app-filter-export',
  standalone: true,
  imports: [
    FormsModule,
    RouterModule,
    CommonModule,
    DataTableComponent,
    ReactiveFormsModule,
    TranslateModule,
    MatSelectModule,
    MatFormFieldModule
  ],
  templateUrl: './filter-export.component.html',
  styleUrls: ['./filter-export.component.css'],
})
export class FilterExportComponent {
    // Services
  private vehicleService = inject(VehicleService);
  private plantSectionService = inject(PlantSectionService);
  private segmentService = inject(SegmentService);
  private driverService = inject(DriverService);
  private agencyService = inject(AgencyService);
  private employeeService = inject(EmployeeService);
  private circuitService = inject(CircuitService);
  private stationService = inject(StationService);

  private snackBar = inject(MatSnackBar);

  
  @Input() searchPlaceHolder: string = '';
  @Input() title: string = '';
  @Input() addButtonLabel: string = '';
  @Input() addButtonRoute: string = '';
  @Input() importButtonLabel: string = '';
  @Input() importButtonRoute: string = '';
  @Input() data: any[] = [];
  @Input() columns: any[] = [];
  @Output() searchTermChange = new EventEmitter<string>();
  @Output() statusFilterChange = new EventEmitter<string>();


  filteredData: any[] = [];
  searchTerm: string = '';
  selectedStatus: string = 'active'; // Default to active

  searchControl = new FormControl('');
  statusControl = new FormControl('active'); // Default to active
  isExporting: boolean = false;

  statusOptions = [
    { value: 'active', label: 'ACTIVE' }, // Active first
    { value: 'inactive', label: 'INACTIVE' },
    { value: 'all', label: 'ALL_STATUSES' }
  ];

  constructor() {
    this.statusControl.setValue('active');

    this.searchControl.valueChanges
      .pipe(
        debounceTime(300),
        distinctUntilChanged()
      )
      .subscribe((term) => {
        this.searchTerm = term?.toLowerCase() || '';
        this.applyFilters();
      });

    this.statusControl.valueChanges
      .subscribe((status) => {
        this.selectedStatus = status || 'all';
        this.applyFilters();
      });

  }

  ngOnChanges(): void {
    this.filteredData = [...this.data];
    this.statusControl.setValue('active'); // Force reset to active on data changes
    this.applyFilters();
    if (this.statusControl.value !== 'active') {
      this.statusControl.setValue('active');
    }
  }

  private applyFilters(): void {
    this.filteredData = this.data.filter((item) => {
      const nameMatch = this.checkNameMatch(item);
      const statusMatch = this.checkStatusMatch(item);
      return nameMatch && statusMatch;
    });
    this.searchTermChange.emit(this.searchTerm);
    this.statusFilterChange.emit(this.selectedStatus);
  }

  private checkNameMatch(item: any): boolean {
    if (!this.searchTerm) return true;

    switch (this.title) {
      case 'AGENCES':
        return item.nomDeEntreprise?.toLowerCase().includes(this.searchTerm) || item.email?.toLowerCase().includes(this.searchTerm);
      case 'VEHICULES':
        return item.numDeReference?.toLowerCase().includes(this.searchTerm) || item.numDeSeries?.toLowerCase().includes(this.searchTerm) || item.agence.nomDeEntreprise?.toLowerCase().includes(this.searchTerm);
      case 'CHAUFF':
        return (
          (item.nom + " " + item.prenom).toLowerCase().includes(this.searchTerm) ||
          item.agence.nomDeEntreprise?.toLowerCase().includes(this.searchTerm) || (item.prenom + " " + item.nom ).toLowerCase().includes(this.searchTerm)
        ); case 'PLANTSECTION':
        return item.plantsection_name?.toLowerCase().includes(this.searchTerm);
      case 'SEGMENT':
        return item.segment_name?.toLowerCase().includes(this.searchTerm);
      case 'EMPLOYEE':
        return (
          (item.firstName + " " + item.lastName).toLowerCase().includes(this.searchTerm) ||
          item.serialNumber?.toLowerCase().includes(this.searchTerm) || (item.lastName + " " + item.firstName ).toLowerCase().includes(this.searchTerm)
        );
      case 'PATH':
        return item.pathReference?.toLowerCase().includes(this.searchTerm) || item.leoniSapReference?.toLowerCase().includes(this.searchTerm) || item.employeeContribution?.toString().includes(this.searchTerm) || item.numberOfKilometres?.toString().includes(this.searchTerm);
      case 'STATION':
        return item.refRegion?.toLowerCase().includes(this.searchTerm) || item.refSapLeoni?.toLowerCase().includes(this.searchTerm) || item.longitude?.toString().includes(this.searchTerm) || item.latitude?.toString().includes(this.searchTerm);
      default:
        return true;
    }
  }

  private checkStatusMatch(item: any): boolean {
    switch (this.selectedStatus) {
      case 'active':
        return item.active;
      case 'inactive':
        return !item.active;
      case 'all':
      default:
        return true;
    }
  }

  onExport(): void {
    const exportType = this.getExportTypeFromTitle();
    console.log('Export type:', exportType);
    
    if (!exportType) {
      this.snackBar.open('Export not available for this table', 'Close', { duration: 3000 });
      return;
    }

    this.isExporting = true;
    
    switch (exportType) {
      case 'vehicle':
        this.exportWithService(this.vehicleService.exportVehiclesToExcel(), 'vehicles');
        break;
      case 'plant-section':
        this.exportWithService(this.plantSectionService.exportPlantSectionsToExcel(), 'plant_sections');
        break;
      case 'segment':
        this.exportWithService(this.segmentService.exportSegmentsToExcel(), 'segments');
        break;
      case 'driver':
        this.exportWithService(this.driverService.exportDriversToExcel(), 'drivers');
        break;
      case 'agency':
        this.exportWithService(this.agencyService.exportAgenciesToExcel(), 'agencies');
        break;
      case 'employee':
        this.exportWithService(this.employeeService.exportEmployeesToExcel(), 'employees');
        break;
      case 'circuit':
        this.exportWithService(this.circuitService.exportCircuitToExcel(), 'circuits');
        break;
      case 'station':
        this.exportWithService(this.stationService.exportStationsToExcel(), 'circuits');
        break;
      
      
    }
  }

  private getExportTypeFromTitle(): string | null {
  switch (this.title) {
    case 'VEHICULES': return 'vehicle';
    case 'PLANTSECTION': return 'plant-section';
    case 'SEGMENT': return 'segment';
    case 'CHAUFF': return 'driver';
    case 'AGENCES': return 'agency';
    case 'EMPLOYEE': return 'employee';
    case 'PATH': return 'circuit';
    case 'STATION': return 'station';
    default: return null;
  }
  }

  private exportWithService(exportObservable: Observable<Blob>, prefix: string): void {
    exportObservable.subscribe({
      next: (data) => this.handleExportSuccess(data, prefix),
      error: (err) => this.handleExportError(err, prefix),
      complete: () => this.isExporting = false
    });
  }

  private handleExportSuccess(data: Blob, prefix: string): void {
    const timestamp = new Date().toISOString().slice(0, 10);
    const fileName = `${prefix}_export_${timestamp}.xlsx`;
    
    const url = window.URL.createObjectURL(data);
    const link = document.createElement('a');
    link.href = url;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    
    // Cleanup
    setTimeout(() => {
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    }, 100);

    this.snackBar.open('Export completed successfully', 'Close', { duration: 3000 });
  }

  private handleExportError(error: any, entityName: string): void {
    console.error(`Error exporting ${entityName}:`, error);
    this.snackBar.open(`Failed to export ${entityName.replace('_', ' ')}`, 'Close', { duration: 3000 });
  }

}