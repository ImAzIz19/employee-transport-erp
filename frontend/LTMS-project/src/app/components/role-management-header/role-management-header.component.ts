import { Component, EventEmitter, Output } from '@angular/core';
import { RoleManagementListComponent } from "../role-management-list/role-management-list.component";
import { CommonModule } from '@angular/common';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatButtonModule } from '@angular/material/button';
import { MatOptionModule } from '@angular/material/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { RoleDTO } from '../../interface/role/role';
import { RoleModifyDTO } from '../../interface/role/roleModifyDTO';
import { UserManagerServer } from '../../services/userManger/user-manger.service';
import { PermissionDTO } from '../../interface/permission/permissionsDTO';
import { Router } from '@angular/router';
import {  Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';

export interface RolePermission {
  id: number;
  transaction: string;
  description: string;
  assigned: boolean;
  action?: string;
}

@Component({
  selector: 'app-add-role-dialog',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatDialogModule
  ],
  template: `
    <h2 mat-dialog-title>Add New Role</h2>
    <br>
    <mat-dialog-content>
      <form [formGroup]="roleForm" class="flex flex-col gap-4">
        <div class="input-container">
          <input
            formControlName="name"
            placeholder="Enter role name"
            class="w-full px-3 py-2 rounded-md border border-gray-600 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
          <div *ngIf="roleForm.get('name')?.hasError('required') && roleForm.get('name')?.touched"
               class="text-red-500 text-sm mt-1">
            Role name is required
          </div>
          <div *ngIf="roleForm.get('name')?.hasError('minlength') && roleForm.get('name')?.touched"
               class="text-red-500 text-sm mt-1">
            Role name must be at least 3 characters
          </div>
        </div>
      </form>
    </mat-dialog-content>
    <br>
    <mat-dialog-actions align="end">
      <button mat-button (click)="onCancel()">Cancel</button>
      <button mat-raised-button color="primary" (click)="onSubmit()" [disabled]="roleForm.invalid || isLoading">
        {{ isLoading ? 'Creating...' : 'Create' }}
      </button>
    </mat-dialog-actions>
  `,
  styles: [
    `
      mat-dialog-content {
        padding: 20px;
      }
      .input-container {
        width: 100%;
      }
      input {
        transition: all 0.2s ease-in-out;
      }
    `
  ]
})
export class AddRoleDialogComponent {
  roleForm: FormGroup;
  isLoading = false;

  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<AddRoleDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.roleForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3)]]
    });
  }

  onSubmit(): void {
    if (this.roleForm.valid) {
      this.isLoading = true;
      this.dialogRef.close(this.roleForm.value.name);
    }
  }

  onCancel(): void {
    this.dialogRef.close();
  }
}

@Component({
  selector: 'app-role-management-header',
  standalone: true,
  imports: [
    RoleManagementListComponent,
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatAutocompleteModule,
    MatOptionModule,
    MatButtonModule,
    MatDialogModule
  ],
  templateUrl: './role-management-header.component.html',
  styleUrls: ['./role-management-header.component.css']
})
export class RoleManagementHeaderComponent {
  isLoading = false;
  errorMessage = '';
  showPermissions = false;

  roles: RoleDTO[] = [];
  allPermissions: RolePermission[] = [];
  filteredPermissions: RolePermission[] = [];

  @Output() loadRoles = new EventEmitter<string>();
  @Output() saveRoles = new EventEmitter<{ role: string, permissions: RolePermission[] }>();
  @Output() addRole = new EventEmitter<string>();

  roleFilter = new FormControl<string>('');
  nameFilter = new FormControl<string>('');

  constructor(
    private userManagerServer: UserManagerServer,
    private router: Router,
    private dialog: MatDialog,
    private authService: AuthService
  ) {
    this.nameFilter.valueChanges
      .pipe(debounceTime(300), distinctUntilChanged())
      .subscribe(() => this.applyFilters());

    this.roleFilter.valueChanges.subscribe(() => this.onLoadRoles());

    this.loadRolesFromApi();
    this.loadPermissionsFromApi();
  }

  private loadRolesFromApi(): void {
    this.isLoading = true;
    this.userManagerServer.getAllRoles().subscribe({
      next: (roles: RoleDTO[]) => {
        this.roles = roles;
        this.isLoading = false;
      },
      error: (error) => {
        this.errorMessage = 'Failed to load roles';
        console.error('Error fetching roles:', error);
        this.isLoading = false;
      }
    });
  }

  private loadPermissionsFromApi(): void {
    this.isLoading = true;
    this.userManagerServer.getAllPermissions().subscribe({
      next: (permissions: PermissionDTO[]) => {
        this.allPermissions = permissions.map(perm => ({
          id: perm.id,
          transaction: perm.permission,
          description: perm.permission,
          assigned: false,
          action: undefined
        }));
        this.filteredPermissions = [...this.allPermissions];
        this.isLoading = false;
        this.onLoadRoles();
      },
      error: (error) => {
        this.errorMessage = 'Failed to load permissions';
        console.error('Error fetching permissions:', error);
        this.isLoading = false;
      }
    });
  }

  applyFilters(): void {
    if (!this.allPermissions || this.allPermissions.length === 0) {
      this.filteredPermissions = [];
      return;
    }

    const roleFilterValue = this.normalizeString(this.roleFilter.value);
    const nameFilterValue = this.normalizeString(this.nameFilter.value);

    this.filteredPermissions = this.allPermissions.filter(item => {
      const transaction = this.normalizeString(item.transaction);
      const description = this.normalizeString(item.description);

      const matchesRole = true;
      const matchesName = !nameFilterValue ||
        transaction.includes(nameFilterValue) ||
        description.includes(nameFilterValue);

      return matchesRole && matchesName;
    });
  }

  private normalizeString(value: any): string {
    if (value === null || value === undefined) return '';
    return String(value).trim().toLowerCase();
  }

  onLoadRoles(): void {
    const selectedRoleName = this.roleFilter.value;

    this.clearError();
    this.showPermissions = true;

    this.allPermissions.forEach(p => p.assigned = false);

    if (!selectedRoleName) {
      this.applyFilters();
      this.loadRoles.emit('');
      return;
    }

    this.isLoading = true;

    const selectedRole = this.roles.find(role => role.name === selectedRoleName);

    if (selectedRole && selectedRole.permissions) {
      const rolePermissionNames = Array.isArray(selectedRole.permissions)
        ? selectedRole.permissions
        : Array.from(selectedRole.permissions);

      this.allPermissions.forEach(permission => {
        permission.assigned = rolePermissionNames.includes(permission.transaction);
      });
    }

    this.applyFilters();
    this.isLoading = false;
    this.loadRoles.emit(selectedRoleName);
  }

  onSaveRoles(): void {
  const selectedRoleName = this.roleFilter.value as string;
  if (!selectedRoleName) {
    this.errorMessage = 'Please select a role first';
    return;
  }

  this.isLoading = true;
  const selectedRole = this.roles.find(role => role.name === selectedRoleName);
  if (!selectedRole) {
    this.errorMessage = 'Selected role not found';
    this.isLoading = false;
    return;
  }

  const roleModifyDTO: RoleModifyDTO = {
    name: selectedRoleName,
    permissions: this.filteredPermissions
      .filter(p => p.assigned)
      .map(p => p.id)
  };

  this.userManagerServer.updateRole(selectedRole.id, roleModifyDTO).subscribe({
    next: () => {
      this.isLoading = false;
      this.saveRoles.emit({
        role: selectedRoleName,
        permissions: this.filteredPermissions.filter(p => p.assigned)
      });
      // Refresh permissions by refreshing the token
      this.authService.refreshToken().subscribe({
        next: () => {
          this.router.navigate(['/admin/users']);
        },
        error: (error) => {
          console.error('Error refreshing token:', error);
          this.router.navigate(['/admin/users']);
        }
      });
    },
    error: (error) => {
      this.errorMessage = 'Failed to save role';
      console.error('Error saving role:', error);
      this.isLoading = false;
    }
  });
}

  onAddRole(): void {
    const dialogRef = this.dialog.open(AddRoleDialogComponent, {
      width: '400px',
      disableClose: true
    });

    dialogRef.afterClosed().subscribe(roleName => {
      if (roleName) {
        this.isLoading = true;
        const roleData: RoleModifyDTO = {
          name: roleName,
          permissions: []
        };

        this.userManagerServer.createRole(roleData).subscribe({
          next: (newRole: RoleDTO) => {
            this.roles = [...this.roles, newRole];
            this.roleFilter.setValue(newRole.name);
            this.addRole.emit(newRole.name);
            this.isLoading = false;
          },
          error: (error) => {
            this.errorMessage = 'Failed to create role';
            console.error('Error creating role:', error);
            this.isLoading = false;
          }
        });
      }
    });
  }

  onDeleteRole(): void {
    const selectedRoleName = this.roleFilter.value;
    if (!selectedRoleName) {
      this.errorMessage = 'Please select a role to delete';
      return;
    }

    this.isLoading = true;
    const selectedRole = this.roles.find(role => role.name === selectedRoleName);
    if (!selectedRole) {
      this.errorMessage = 'Selected role not found';
      this.isLoading = false;
      return;
    }

    this.userManagerServer.deleteRole(selectedRole.id).subscribe({
      next: () => {
        this.roles = this.roles.filter(role => role.id !== selectedRole.id);
        this.roleFilter.setValue('');
        this.isLoading = false;
        this.onLoadRoles();
      },
      error: (error) => {
        this.errorMessage = 'Failed to delete role';
        console.error('Error deleting role:', error);
        this.isLoading = false;
      }
    });
  }

  clearError(): void {
    this.errorMessage = '';
  }
}