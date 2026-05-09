import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Output } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import {TranslatePipe} from "@ngx-translate/core";

@Component({
  selector: 'app-verification-code-form',
  standalone: true, // This allows it to be used independently
    imports: [CommonModule, FormsModule, TranslatePipe],
  templateUrl: './verification-code-form.component.html',
  styleUrls: ['./verification-code-form.component.css']
})
export class VerificationCodeFormComponent {
  @Output() verifyCodeEvent = new EventEmitter<string>();
  submitted: boolean = false; // Flag to track form submission

  verificationCode: string = '';

  verifyCode(verificationForm: NgForm) {
    this.submitted = true; // Mark the form as submitted

    const verificationCodeControl = verificationForm.controls['verificationCode'];

    // Mark the control as touched and dirty to trigger validation
    verificationCodeControl.markAsTouched();
    verificationCodeControl.markAsDirty();

    // Check if the field is empty and set the 'required' error
    if (!verificationCodeControl.value) {
      verificationCodeControl.setErrors({ required: true });
    }

    // Emit the verification code if the form is valid
    if (verificationForm.valid) {
      this.verifyCodeEvent.emit(this.verificationCode); // Emit the verification code
    }
  }
  verifyCodeFieldChange(event: any) {
    // Replace any non-numeric characters with an empty string
    this.verificationCode = this.verificationCode.replace(/\D/g, '');
  }


}
