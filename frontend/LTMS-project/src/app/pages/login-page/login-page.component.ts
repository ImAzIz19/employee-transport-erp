import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { TranslateModule } from '@ngx-translate/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login-page',
  imports: [RouterLink, ReactiveFormsModule, TranslateModule, CommonModule],
  templateUrl: './login-page.component.html',
  styleUrls: ['./login-page.component.css'],
  standalone: true,
})
export class LoginPageComponent {
  loginForm: FormGroup;
  errorMessage: string | null = null;
  isSubmitting = false;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private authService: AuthService
  ) {
    this.loginForm = this.fb.group({
      username: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
    });
  }

login() {
  if (this.loginForm.invalid) {
    this.loginForm.markAllAsTouched();
    this.errorMessage = 'Please fill out the form correctly.';
    return;
  }

  this.isSubmitting = true;
  this.errorMessage = null;

  const credentials = {
    email: this.loginForm.value.username,
    password: this.loginForm.value.password,
  };

  this.authService.login(credentials).subscribe({
    next: (response) => {
      this.isSubmitting = false;
      if (!response.userEntityDTO.isVerified) {
        this.router.navigate(['/forget-password']);
      } else {
        this.router.navigate(['/home']);
      }
    },
    error: (err) => {
      this.isSubmitting = false;
      this.errorMessage =
        err?.error?.message || 'Login failed. Please check your credentials.';
      console.error('Login failed', err);
    },
  });
}

}