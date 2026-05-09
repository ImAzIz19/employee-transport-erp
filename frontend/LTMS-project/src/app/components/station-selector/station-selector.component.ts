import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Station } from '../../interface/station/station';
import { StationService } from '../../services/station/station.service';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-station-selector',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './station-selector.component.html',
  styleUrls: ['./station-selector.component.css']
})
export class StationSelectorComponent implements OnInit {
  @Input() availableStations: Station[] = [];
  @Input() selectedStationIds: Set<number> = new Set<number>();
  @Input() arrivalPoint: string = '';

  // For display purposes only
  selectedStationsForDisplay: Station[] = [];

  @Output() stationSelected = new EventEmitter<number>(); // Emit station ID
  @Output() stationRemoved = new EventEmitter<number>(); // Emit station ID

  constructor(private stationService: StationService) {}

  ngOnInit() {
    if (this.selectedStationIds?.size > 0) {
      this.loadSelectedStations();
    }
  }

  loadSelectedStations(): void {
  const stationIds = Array.from(this.selectedStationIds);
  
  if (stationIds.length > 0) {
    forkJoin(
      stationIds.map(id => this.stationService.getStationById(id))
    ).subscribe({
      next: (stations: (Station | null)[]) => {
        // Filter out null values if needed
        this.selectedStationsForDisplay = stations.filter(station => station !== null) as Station[];
      },
      error: (err) => {
        console.error('Error loading selected stations:', err);
      }
    });
  }
}
  selectStation(station: Station) {
    if (!this.selectedStationIds.has(station.id)) {
      this.stationSelected.emit(station.id);
      this.selectedStationsForDisplay.push(station);
      this.selectedStationIds.add(station.id);
    }
  }

  removeStation(station: Station) {
    this.stationRemoved.emit(station.id);
    this.selectedStationsForDisplay = this.selectedStationsForDisplay.filter(
      s => s.id !== station.id
    );
    this.selectedStationIds.delete(station.id);
  }
}