// user-filter.component.ts
import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output, SimpleChanges } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import {  debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatButtonModule } from '@angular/material/button';
import { MatOptionModule } from '@angular/material/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';

@Component({
  selector: 'app-user-filter',
  templateUrl: './user-filter.component.html',
  styleUrls: ['./user-filter.component.scss'],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatAutocompleteModule,
    MatOptionModule,
    MatButtonModule
  ]
  
})
export class UserFilterComponent implements OnInit {
  @Output() filterChanged = new EventEmitter<any>();
  @Input() users: any[] = [];

  searchFilter = new FormControl('');
  roleFilter = new FormControl([]);
  orgFilter = new FormControl('');

  uniqueRoles: string[] = [];
  uniqueOrgs: string[] = [];

  ngOnInit(): void {
    // Extract unique roles and organizations from input users
    this.extractUniqueValues();

    // Emit filter changes with debounce for search
    this.searchFilter.valueChanges
      .pipe(
        debounceTime(300),
        distinctUntilChanged()
      )
      .subscribe(() => this.emitFilters());

    this.roleFilter.valueChanges.subscribe(() => this.emitFilters());
    this.orgFilter.valueChanges.subscribe(() => this.emitFilters());
  }

  ngOnChanges(changes: SimpleChanges) {
  if (changes['users']) {
    this.extractUniqueValues();
  }
}

private extractUniqueValues(): void {
  const allRoles = new Set<string>();
  const allOrgs = new Set<string>();

  this.users?.forEach(user => {
    // Add organization
    if (user.orgUnit) {
      allOrgs.add(user.orgUnit);
    }

    // Add all roles (assuming roles is RoleDTO[])
    if (user.roles && user.roles.length > 0) {
      user.roles.forEach((role: any) => {
        if (typeof role === 'object' && role.name) {
          allRoles.add(role.name);
        } else if (typeof role === 'string') {
          allRoles.add(role);
        }
      });
    }
  });

  this.uniqueRoles = Array.from(allRoles).sort();
  this.uniqueOrgs = Array.from(allOrgs).sort();
}

  private emitFilters(): void {
    this.filterChanged.emit({
      search: this.searchFilter.value,
      roles: this.roleFilter.value,
      org: this.orgFilter.value
    });
  }

  // Method to reset filters
  resetFilters(): void {
    this.searchFilter.setValue('');
    this.roleFilter.setValue([]);
    this.orgFilter.setValue('');
  }
}