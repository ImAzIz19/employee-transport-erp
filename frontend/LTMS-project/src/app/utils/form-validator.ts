import { AbstractControl, ValidationErrors, FormGroup } from '@angular/forms';

export class FormValidator {
  static validEmail(control: AbstractControl): ValidationErrors | null {
    if (!control.value) {
      return null; 
    }
    const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
    return emailPattern.test(control.value) ? null : { invalidEmail: true };
  }

  static validPassword(control: AbstractControl): ValidationErrors | null {
    if (!control.value) {
      return null; 
    }
    const passwordPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    return passwordPattern.test(control.value) ? null : { invalidPassword: true };
  }

  static matchPassword(control: AbstractControl): ValidationErrors | null {
    const newPassword = control.get('newPassword')?.value;
    const confirmPassword = control.get('confirmPassword')?.value;

    return newPassword === confirmPassword ? null : { passwordsMismatch: true };
  }
}
