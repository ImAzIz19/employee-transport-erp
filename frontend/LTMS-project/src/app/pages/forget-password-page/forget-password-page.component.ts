import { Component } from '@angular/core';
import { trigger, transition, style, animate } from '@angular/animations';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { VerificationCodeComponent } from "../../components/verification-code/verification-code.component";
import { NewPasswordComponent } from '../../components/new-password/new-password.component';
import { EmailInputComponent } from '../../components/email-input/email-input.component';
import {TranslateModule} from '@ngx-translate/core';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';  

@Component({
  selector: 'app-forget-password-page',
  templateUrl: './forget-password-page.component.html',
  styleUrls: ['./forget-password-page.component.css'],
  imports: [CommonModule, FormsModule, VerificationCodeComponent,VerificationCodeComponent,NewPasswordComponent,EmailInputComponent,TranslateModule],
  animations: [
    trigger('fadeInOut', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(-20px)' }),
        animate('800ms 300ms ease-in-out', style({ opacity: 1, transform: 'translateY(0)' })),
      ]),
      transition(':leave', [
        animate('600ms ease-in-out', style({ opacity: 0, transform: 'translateY(20px)' })),
      ]),
    ]),
  ],
})
export class ForgetPasswordPageComponent {
  constructor(
    private authService : AuthService,
    private router: Router  
  ){}
  email: string = '';
  verificationCode: string = '';
  newPassword: string = '';
  confirmPassword: string = '';
  isVerificationSent: boolean = false;
  isCodeVerified: boolean = false;
  isVerifying: boolean = false;

  errorMessage1: string | null = null;
  errorMessage2: string | null = null;
  errorMessage3: string | null = null;
  
  handleSendEmail(email: string): void {
    this.email=email
    if (!email) return;
    console.log('Verification email sent:', email);
    this.authService.handleSendEmail(email).subscribe({
      next: response => {
        console.log('Verification email sent:', response);
        if (response === 'MFA code sent successfully.') {  
          this.isVerificationSent = true;
        }     
      },
      error: err => {
        console.error('Error sending verification email:', err);
        this.errorMessage1 = 'There was an error sending the verification email. Please try again.';
      }
    });
  }

  handleVerifyCode(code: string): void {
    this.verificationCode=code
    if (!this.email || !this.verificationCode) return;

    this.authService.handleVerifyMfa(this.email, this.verificationCode).subscribe({
      next: response => {
        console.log('MFA verified successfully:', response);
        if (response === 'MFA verification successful.') {  
          this.isCodeVerified = true;
        } 
      },
      error: err => {
        console.error('Error verifying MFA:', err);
        this.errorMessage2 = 'There was an error verifying the MFA code. Please try again.';

      }
    });
    setTimeout(() => {
      this.isCodeVerified = true;
      this.isVerificationSent = false; 
      this.isVerifying = false;
    }, 1000); 
  }

  handleResendEmail(): void {
    if (!this.email) return;

    this.authService.handleSendEmail(this.email).subscribe({
      next: response => {
        console.log('Verification email resent successfully:', response);
        alert('Verification email has been resent.');

        },
      error: err => {
        console.error('Error resending verification email:', err);
      }
    });
  }

  handleCreateNewPassword(passwords: { newPassword: string; confirmPassword: string }): void {
    if (passwords.newPassword !== passwords.confirmPassword) {
      alert('Passwords do not match!');
      return;
    }
  
    this.authService.handleCreateNewPassword(this.email, passwords.newPassword).subscribe({
      next: response => {
        console.log('Password successfully created:', response);
        alert('Password successfully updated!');
        this.router.navigate(['/login']);
      },
      error: err => {
        console.error('Error creating new password:', err);
        this.errorMessage3 = 'There was an error updating your password. Please try again.';
      }
    });
  }
  
  
}
