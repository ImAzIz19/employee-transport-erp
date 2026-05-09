import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { VerificationCodeFormComponent } from '../shared/verification-code-form/verification-code-form.component';
import {TranslatePipe} from '@ngx-translate/core';

@Component({
  selector: 'app-verification-code',
  standalone: true, // If using Angular standalone components
  imports: [CommonModule, FormsModule, VerificationCodeFormComponent, TranslatePipe],
  templateUrl: './verification-code.component.html',
  styleUrls: ['./verification-code.component.css']
})
export class VerificationCodeComponent {
  @Output() verifyCodeEvent = new EventEmitter<string>();
  @Output() resendEmailEvent = new EventEmitter<void>();
  @Input() errorMessage2: string | null = null;

  verifyCode(code: string) {
    this.verifyCodeEvent.emit(code);
    console.log('Verification code entered:', code);
  }

  resendEmail() {
    this.resendEmailEvent.emit();
    console.log('Resending email...');
  }
}
