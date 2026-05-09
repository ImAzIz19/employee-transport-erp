import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { NavBarComponent } from '../../nav-bar/nav-bar.component';
import { RegisterRequest } from '../../../interface/registerRequest/registerRequest';
import { RoleDTO } from '../../../interface/role/role';
import { AuthService } from '../../../services/auth.service';
import { UserManagerServer } from '../../../services/userManger/user-manger.service';


@Component({
  selector: 'app-add-user',
  templateUrl: './add-user.component.html',
  styleUrls: ['./add-user.component.css'],
  imports: [NavBarComponent, ReactiveFormsModule],
  standalone: true
})
export class AddUserComponent implements OnInit {
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

  constructor(
    private fb: FormBuilder,
    private userManagerService: UserManagerServer,
    private authService: AuthService
  ) {
    this.userForm = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      loginName: [''],
      password: ['', [Validators.required, Validators.minLength(6)]],
      role: [[], Validators.required],
      organization: ['']
    });
  }

  ngOnInit(): void {
    this.loadRoles();
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

    this.isSubmitting = true;
    this.errorMessage = null;
    this.successMessage = null;

    // Map selectedRoles to a single roleId (use the first selected role's ID)
    const selectedRoleId = this.selectedRoles.length > 0
      ? this.availableRoles.find(r => r.value === this.selectedRoles[0])?.id
      : undefined;

    if (!selectedRoleId) {
      this.isSubmitting = false;
      this.errorMessage = 'Please select at least one role.';
      return;
    }

    const registerRequest: RegisterRequest = {
      firstName: this.userForm.get('firstName')?.value,
      lastName: this.userForm.get('lastName')?.value,
      loginName: this.userForm.get('loginName')?.value || undefined,
      email: this.userForm.get('email')?.value,
      password: this.userForm.get('password')?.value,
      roleId: selectedRoleId,
      orgId: this.userForm.get('organization')?.value || undefined
    };

    this.authService.register(registerRequest).subscribe({
      next: () => {
        this.isSubmitting = false;
        this.successMessage = 'User registered successfully!';
        this.userForm.reset();
        this.selectedRoles = [];
      },
      error: (error) => {
        this.isSubmitting = false;
        this.errorMessage = error.error?.message || 'Registration failed. Please try again.';
        console.error('Registration error:', error);
      }
    });
  }
}