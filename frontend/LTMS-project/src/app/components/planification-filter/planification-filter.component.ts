// planification-filter.component.ts
import { Component, Output, EventEmitter, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { Observable, of } from 'rxjs';
import { map, startWith } from 'rxjs/operators';

// Angular Material imports
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatOptionModule } from '@angular/material/core';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-planification-filter',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatAutocompleteModule,
    MatOptionModule,
    MatButtonModule
  ],
  templateUrl: './planification-filter.component.html',
  styleUrls: ['./planification-filter.component.scss']
})
export class PlanificationFilterComponent {
  @Output() filterChanged = new EventEmitter<any>();
  @Input() plantSections: string[] = [];
  @Input() weeks: string[] = [];
  
  nameFilter = new FormControl('');
  plantSectionFilter = new FormControl('');
  actionFilter = new FormControl('all');
  weekFilter = new FormControl('');

  filteredPlantSections: Observable<string[]> = of([]);
  
  filteredWeeks: Observable<string[]> = of([]);
  
  importModes: string[] = ['cumulatif', 'Avec ectasement', 'all'];

  ngOnInit(): void {
    // Initialize filter observables
    this.filteredPlantSections = this.plantSectionFilter.valueChanges.pipe(
      startWith(''),
      map(value => this._filter(value || '', this.plantSections))
    );
    
    this.filteredWeeks = this.weekFilter.valueChanges.pipe(
      startWith(''),
      map(value => this._filter(value || '', this.weeks))
    );

    // Emit filter changes
    this.nameFilter.valueChanges.subscribe(() => this.emitFilters());
    this.plantSectionFilter.valueChanges.subscribe(() => this.emitFilters());
    this.actionFilter.valueChanges.subscribe(() => this.emitFilters());
    this.weekFilter.valueChanges.subscribe(() => this.emitFilters());
  }

  private _filter(value: string, options: string[]): string[] {
    const filterValue = value.toLowerCase();
    return options.filter(option => option.toLowerCase().includes(filterValue));
  }

  private emitFilters(): void {
    this.filterChanged.emit({
      name: this.nameFilter.value,
      plantSection: this.plantSectionFilter.value,
      action: this.actionFilter.value,
      week: this.weekFilter.value
    });
  }

  // Method to set available options from parent
  setFilterOptions(plantSections: string[], weeks: string[]): void {
    this.plantSections = plantSections;
    this.weeks = weeks;
  }

  // Method to reset filters
  resetFilters(): void {
    this.nameFilter.setValue('');
    this.plantSectionFilter.setValue('');
    this.actionFilter.setValue('all');
    this.weekFilter.setValue('');
  }
}