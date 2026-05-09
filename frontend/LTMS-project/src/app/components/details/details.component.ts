import { Component, OnInit, OnDestroy, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { AgencyService } from '../../services/agency/agency.service';
import { DriverService } from '../../services/driver/driver.service';
import { VehicleService } from '../../services/vehicle/vehicle.service';
import { AGENCY_FIELD_TRANSLATIONS } from './../../utils/const/AGENCY_FIELD_TRANSLATIONS';
import { DRIVER_FIELD_TRANSLATIONS } from './../../utils/const/DRIVER_FIELD_TRANSLATIONS';
import { VEHICLE_FIELD_TRANSLATIONS } from './../../utils/const/VEHICLE_FIELD_TRANSLATIONS';
import { forkJoin, Subscription } from 'rxjs';
import { PlantSectionService } from '../../services/plant-section/plant-section.service';
import { PLANT_SECTION_FIELD_TRANSLATIONS } from '../../utils/const/PLANTSECTION_FIELD_TRANSLATIONS';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { PATH_FIELD_TRANSLATIONS } from '../../utils/const/path.constants';
import { EMPLOYEE_FIELD_TRANSLATIONS } from '../../utils/const/employee.constants';
import { SEGMENT_FIELD_TRANSLATIONS } from '../../utils/const/segment.constants';
import { STATION_FIELD_TRANSLATIONS } from '../../utils/const/station.constants';
import { CircuitService } from '../../services/circuit/circuit.service';
import { EmployeeService } from '../../services/employee/employee.service';
import { SegmentService } from '../../services/segment/segment.service';
import { StationService } from '../../services/station/station.service';
import { UserManagerService } from '../../services/user/user.service';

@Component({
  selector: 'app-details',
  standalone: true,
  imports: [CommonModule, TranslateModule,],
  templateUrl: './details.component.html',
  styleUrls: ['./details.component.css'],
})
export class DetailsComponent implements OnInit, OnDestroy {
  item: any;
  entityType: string = '';
  translatedFields: { key: string; value: any }[] = [];
  private langChangeSubscription: Subscription;

  constructor(
    private agencyService: AgencyService,
    private driverService: DriverService,
    private vehicleService: VehicleService,
    private plantsectionService: PlantSectionService,
    private translate: TranslateService,
    private segmentService: SegmentService,
    private employeeService: EmployeeService,
    private circutService: CircuitService,
    private stationService: StationService,
    private userService: UserManagerService,
    @Inject(MAT_DIALOG_DATA) public data: { entityType: string; item: any }
  ) {
    this.langChangeSubscription = new Subscription();
  }

  ngOnInit(): void {
    if (!this.data?.entityType) {
      console.error('No entity type provided');
      return;
    }

    this.entityType = this.data.entityType.toLowerCase(); // Ensure consistent casing
    this.loadEntityDetails();

    this.langChangeSubscription = this.translate.onLangChange.subscribe(() => {
      if (this.item) {
        this.translateFields();
      }
    });
  }

  ngOnDestroy(): void {
    this.langChangeSubscription.unsubscribe();
  }

  loadEntityDetails(): void {
    if (!this.data?.item) return;

    switch (this.entityType.toLowerCase()) {
      case 'plantsection':
        forkJoin([
          this.plantsectionService.getPlantSections(),
          this.userService.getRhManagers(),
          this.userService.getPsManagers(),
          this.segmentService.getSegments(),
        ]).subscribe({
          next: ([plantsections, rhManagers, psManagers, segments]) => {
            this.item = plantsections.find(p => p.plantsection_name === this.data.item.plantsection_name);
            console.log(this.item)
            if (this.item) {
              // Map PS Manager ID to name
              const psManager = psManagers.find(ps => ps.id === this.item.psManagerId);
              if (psManager) {
                this.item.psManagerName = `${psManager.firstName} ${psManager.lastName}`;
              }

              // Map RH Manager ID to name
              const rhManager = rhManagers.find(rh => rh.id === this.item.rhManagerId);
              if (rhManager) {
                this.item.rhManagerName = `${rhManager.firstName} ${rhManager.lastName}`;
              }

              // Map segment IDs to names
              if (this.item.segmentIds && this.item.segmentIds.length > 0) {
                this.item.segmentNames = this.item.segmentIds
                  .map((id: number) => {  // Explicitly type 'id' as number
                    const segment = segments.find(sg => sg.id === id);
                    return segment ? segment.segment_name : 'Unknown';
                  })
                  .join(', ');
              } else {
                this.item.segmentNames = 'None';
              }
            }

            this.translateFields();
          },
          error: (err) => console.error('Error loading plant section:', err)
        });
        break;

      case 'agency':
        this.agencyService.getAgencies().subscribe({
          next: (agencies) => {
            this.item = agencies.find(a => a.name === this.data.item.name);
            this.translateFields();
          },
          error: (err) => console.error('Error loading agency:', err)
        });
        break;

      case 'driver':
        this.driverService.getDrivers().subscribe({
          next: (drivers) => {
            this.item = drivers.find(d =>
              `${d.prenom} ${d.nom}` ===
              `${this.data.item.prenom} ${this.data.item.nom}`
            );
            this.translateFields();
          },
          error: (err) => console.error('Error loading driver:', err)
        });
        break;

      case 'vehicle':
        this.vehicleService.getVehicles().subscribe({
          next: (vehicles) => {
            this.item = vehicles.find(v => v.numDeReference === this.data.item.numDeReference);
            this.translateFields();
          },
          error: (err) => console.error('Error loading vehicle:', err)
        });
        break;

      case 'path':
        // Fetch paths, agencies, and stations
        forkJoin([
          this.circutService.getPaths(),
          this.agencyService.getAgencies(),
          this.stationService.getStations() // Add stations service call
        ]).subscribe({
          next: ([paths, agencies, stations]) => { // Now correctly destructuring 3 items
            // Find the path
            this.item = paths.find(p => p.pathReference === this.data.item.pathReference);

            // If found, map agency ID to agency name and station IDs to names
            if (this.item) {
              // Map agency ID to name
              const agency = agencies.find(a => a.id === this.item.agencyId);
              if (agency) {
                this.item.agencyName = agency.name;
              }

              // Map station IDs to names
              if (this.item.stations && this.item.stations.length > 0) {
                this.item.stationNames = this.item.stations
                  .map((id: number) => {
                    const station = stations.find(st => st.id === id);
                    return station ? station.refRegion : 'Unknown'; // Using refRegion as display name
                  })
                  .join(', ');
              } else {
                this.item.stationNames = 'None'; // Fixed typo from segmentNames to stationNames
              }
            }

            this.translateFields();
          },
          error: (err) => console.error('Error loading path:', err)
        });
        break;

      case 'employee':
        forkJoin([
          this.employeeService.getEmployees(),
          this.plantsectionService.getPlantSections(),
          this.segmentService.getSegments(),
          this.stationService.getStations()
        ]).subscribe({
          next: ([employees, plantsections, segments, stations]) => {
            // Find the employee
            this.item = employees.find(e =>
              e.id === this.data.item.id ||
              e.serialNumber === this.data.item.serialNumber ||
              (`${e.firstName} ${e.lastName}` === `${this.data.item.firstName} ${this.data.item.lastName}`)
            );

            if (this.item) {
              // Map Plant Section ID to name
              if (this.item.plantSectionId) {
                const plantsection = plantsections.find(p => p.id === this.item.plantSectionId);
                if (plantsection) {
                  this.item.plantSectionName = plantsection.plantsection_name;
                }
              }

              // Map Segment ID to name
              if (this.item.segmentId) {
                const segment = segments.find(s => s.id === this.item.segmentId);
                if (segment) {
                  this.item.segmentName = segment.segment_name;
                }
              }

              // Map Station ID to name
              if (this.item.stationId) {
                const station = stations.find(s => s.id === this.item.stationId);
                if (station) {
                  this.item.stationName = station.refRegion || station.refRegion; // Use appropriate field
                }
              }
            }

            this.translateFields();
          },
          error: (err) => console.error('Error loading employee:', err)
        });
        break;

      case 'segment':
        forkJoin([
          this.segmentService.getSegments(),
          this.userService.getRhSegmentUsers(),
          this.userService.getChefSegmentUsers(),
          this.plantsectionService.getPlantSections() // Added to map plantSectionId
        ]).subscribe({
          next: ([segments, rhSegmentUsers, chefSegmentUsers, plantsections]) => {
            // Find the segment
            this.item = segments.find(s =>
              s.segment_name === this.data.item.segment_name ||
              s.id === this.data.item.id
            );

            if (this.item) {
              // Map RH Segment User ID to name
              const rhUser = rhSegmentUsers.find(rh => rh.id === this.item.rhSegmentId);
              if (rhUser) {
                this.item.rhManagerName = `${rhUser.firstName} ${rhUser.lastName}`;
              }

              // Map Chef Segment User ID to name
              const chefUser = chefSegmentUsers.find(chef => chef.id === this.item.chefSegmentId);
              if (chefUser) {
                this.item.chefSegmentName = `${chefUser.firstName} ${chefUser.lastName}`;
              }

              // Map Plant Section ID to name
              const plantsection = plantsections.find(p => p.id === this.item.plantSectionId);
              if (plantsection) {
                this.item.plantSectionName = plantsection.plantsection_name;
              }
            }

            this.translateFields();
          },
          error: (err) => console.error('Error loading segment:', err)
        });
        break;
      case 'station':
        forkJoin([
          this.stationService.getStations(),
          this.circutService.getPaths() // Fetch circuits to map circuit names
        ]).subscribe({
          next: ([stations, circuits]) => {
            this.item = stations.find(s =>
              s.refRegion === this.data.item.refRegion ||
              (s.longitude === this.data.item.longitude &&
                s.latitude === this.data.item.latitude)
            );

            if (this.item) {
              // Map circuit ID to circuit name if it exists
              if (this.item.circuitId) {
                const circuit = circuits.find(c => c.id === this.item.circuitId);
                if (circuit) {
                  this.item.circuitName = circuit.pathReference; // or whatever field contains the circuit name
                }
              }
            }

            this.translateFields();
          },
          error: (err) => console.error('Error loading station:', err)
        });
        break;

      default:
        console.warn('Unknown entity type:', this.entityType);
    }
  }

  translateFields(): void {
    if (!this.item) return;

    const translationMap = this.getTranslationMap();
    if (!translationMap) return;

    this.translatedFields = Object.entries(this.item)
      .filter(([key]) =>
        key !== 'id' &&
        key !== 'full_name' &&
        key !== 'agencyId' &&          // For path/circuit
        key !== 'psManagerId' &&      // For plant section
        key !== 'rhManagerId' &&
        key !== 'plantSectionId' &&    // For segment
        key !== 'rhSegmentId' &&      // For segment
        key !== 'chefSegmentId' &&     // For segment
        key !== 'segmentId' &&         // For employee
        key !== 'stationId' &&         // For employee
        key !== 'segments' &&
        key !== 'regions' &&
        key !== 'manager_id' &&        // For employee
        key !== 'segmentIds' &&
        key !== 'stations' &&
        key !== 'circuitId' &&
        key !== 'agence'    &&
        key !== 'agenceId'    // For station
        // Add this to hide segment IDs array
      )
      .map(([key, value]) => ({
        key: this.getTranslatedKey(translationMap, key),
        value: key === 'web_site'
          ? this.getWebsiteLink(value as string)
          : value, // Simplified the value mapping
      }));
  }

  private getTranslationMap(): any {
    switch (this.entityType.toLowerCase()) {
      case 'agency':
        return AGENCY_FIELD_TRANSLATIONS;
      case 'driver':
        return DRIVER_FIELD_TRANSLATIONS;
      case 'vehicle':
        return VEHICLE_FIELD_TRANSLATIONS;
      case 'plantsection':
        return PLANT_SECTION_FIELD_TRANSLATIONS;
      case 'path':
        return PATH_FIELD_TRANSLATIONS;
      case 'employee':
        return EMPLOYEE_FIELD_TRANSLATIONS;
      case 'segment':
        return SEGMENT_FIELD_TRANSLATIONS;
      case 'station':
        return STATION_FIELD_TRANSLATIONS;
      default:
        console.warn(`No translation map found for entity type: ${this.entityType}`);
        return {};
    }
  }

  private getTranslatedKey(translationMap: any, key: string): string {
    const translationKey = translationMap[key];
    return translationKey ? this.translate.instant(translationKey) : key;
  }

  getWebsiteLink(url: string): string {
    if (!url) return '';
    // Consider using DomSanitizer for security if displaying in template
    return url.startsWith('http') ? url : `https://${url}`;
  }
}