import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { FormValidator } from "../../utils/form-validator"
import { CommonModule } from '@angular/common';
import {TranslateModule} from '@ngx-translate/core';

@Component({
  selector: 'app-new-password',
  standalone: true,
  imports: [ReactiveFormsModule,CommonModule,TranslateModule],
  templateUrl: './new-password.component.html',
  styleUrl: './new-password.component.css'
})
export class NewPasswordComponent {
  newPasswordForm: FormGroup;
  @Output() createNewPasswordEvent = new EventEmitter<{ newPassword: string, confirmPassword: string }>();
  @Input() errorMessage3: string | null = null;

  constructor(private fb: FormBuilder) {
    this.newPasswordForm = this.fb.group({
      newPassword: ['', [Validators.required, FormValidator.validPassword]],
      confirmPassword: ['', Validators.required]
    }, { validators: FormValidator.matchPassword });
  }

  createNewPassword() {
    if (this.newPasswordForm.valid) {
      this.createNewPasswordEvent.emit(this.newPasswordForm.value);
    }
  }
}
