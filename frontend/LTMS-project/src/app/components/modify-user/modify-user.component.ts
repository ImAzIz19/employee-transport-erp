import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { UserManagerServer } from '../../services/userManger/user-manger.service';
import { AuthService } from '../../services/auth.service';
import { User,  } from '../../interface/user/user';
import { CommonModule } from '@angular/common';
import { RoleDTO } from '../../interface/role/role';
import { NavBarComponent } from '../nav-bar/nav-bar.component';

@Component({
  selector: 'app-modify-user',
  templateUrl: './modify-user.component.html',
  styleUrls: ['./modify-user.component.css'],
  imports: [NavBarComponent, ReactiveFormsModule, CommonModule, NavBarComponent],
  standalone: true
})
export class ModifyUserComponent implements OnInit {
  userForm: FormGroup;
  errorMessage: string | null = null;
  successMessage: string | null = null;
  isSubmitting = false;
  showRoleDropdown = false;
  selectedRoles: string[] = [];
  availableRoles: { value: string; label: string; id: number }[] = [];
  organizations = [
    { id: 1, name: 'Organization A' },
    { id: 2, name: 'Organization B' },
    { id: 3, name: 'Organization C' }
  ];
  userId: number | null = null;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private userManagerService: UserManagerServer,
    private authService: AuthService
  ) {
    this.userForm = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      loginName: [''],
      password: ['', [Validators.minLength(6)]],
      role: [[], Validators.required],
      organization: ['']
    });
  }

  ngOnInit(): void {
    this.userId = Number(this.route.snapshot.paramMap.get('id'));
    if (this.userId) {
      this.loadUserData(this.userId);
    }
    this.loadRoles();
  }

  private loadUserData(userId: number): void {
    this.userManagerService.getAllUsers().subscribe({
      next: (users: User[]) => {
        const user = users.find(u => u.id === userId);
        if (user) {
          this.userForm.patchValue({
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            loginName: user.loginName,
            organization: user.orgUnit ? this.organizations.find(org => org.name === user.orgUnit)?.id : '',
            role: user.roles.map(role => role.id.toString())
          });
          this.selectedRoles = user.roles.map(role => role.id.toString());
        } else {
          this.errorMessage = 'User not found.';
        }
      },
      error: (error) => {
        this.errorMessage = 'Failed to load user data. Please try again.';
        console.error('Error loading user:', error);
      }
    });
  }

  private loadRoles(): void {
    this.userManagerService.getAllRoles().subscribe({
      next: (roles: RoleDTO[]) => {
        this.availableRoles = roles.map(role => ({
          value: role.id.toString(),
          label: role.name,
          id: role.id
        }));
      },
      error: (error) => {
        this.errorMessage = 'Failed to load roles. Please try again.';
        console.error('Error loading roles:', error);
      }
    });
  }

  toggleRoleDropdown(): void {
    this.showRoleDropdown = !this.showRoleDropdown;
  }

  isRoleSelected(roleValue: string): boolean {
    return this.selectedRoles.includes(roleValue);
  }

  toggleRoleSelection(roleValue: string): void {
    if (this.isRoleSelected(roleValue)) {
      this.selectedRoles = this.selectedRoles.filter(r => r !== roleValue);
    } else {
      this.selectedRoles = [...this.selectedRoles, roleValue];
    }
    this.userForm.get('role')?.setValue(this.selectedRoles);
    this.userForm.get('role')?.markAsTouched();
  }

  getRoleLabel(roleValue: string): string {
    const role = this.availableRoles.find(r => r.value === roleValue);
    return role ? role.label : roleValue;
  }

  generateLoginName(): void {
    const firstName = this.userForm.get('firstName')?.value || '';
    const lastName = this.userForm.get('lastName')?.value || '';

    if (firstName && lastName) {
      const lastNamePart = lastName.substring(0, 3).toLowerCase();
      const firstNamePart = firstName.split(' ')[0].toLowerCase();
      this.userForm.patchValue({
        loginName: `${lastNamePart}_${firstNamePart}`
      });
    }
  }

  onSubmit(): void {
    if (this.userForm.invalid) {
      this.userForm.markAllAsTouched();
      this.errorMessage = 'Please fill all required fields correctly.';
      return;
    }

    if (!this.userId) {
      this.errorMessage = 'Invalid user ID.';
      return;
    }

    this.isSubmitting = true;
    this.errorMessage = null;
    this.successMessage = null;

    const selectedRoleId = this.selectedRoles.length > 0
      ? this.availableRoles.find(r => r.value === this.selectedRoles[0])?.id
      : undefined;

    if (!selectedRoleId) {
      this.isSubmitting = false;
      this.errorMessage = 'Please select at least one role.';
      return;
    }

    const userData: User = {
      id: this.userId,
      firstName: this.userForm.get('firstName')?.value,
      lastName: this.userForm.get('lastName')?.value,
      loginName: this.userForm.get('loginName')?.value || undefined,
      email: this.userForm.get('email')?.value,
      roles: [{ id: selectedRoleId, name: this.getRoleLabel(this.selectedRoles[0]), permissions: [] }],
      orgUnit: this.userForm.get('organization')?.value
        ? this.organizations.find(org => org.id === Number(this.userForm.get('organization')?.value))?.name
        : undefined
    };

    this.userManagerService.updateUser(this.userId, userData).subscribe({
      next: () => {
        this.isSubmitting = false;
        this.successMessage = 'User updated successfully!';
        this.router.navigate(['/admin/users']);
      },
      error: (error) => {
        this.isSubmitting = false;
        this.errorMessage = error.error?.message || 'Update failed. Please try again.';
        console.error('Update error:', error);
      }
    });
  }

  cancel(): void {
    this.router.navigate(['/admin/users']);
  }
}