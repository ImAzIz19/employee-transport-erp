import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { FormValidator } from '../../utils/form-validator';
import {TranslateModule} from '@ngx-translate/core';

@Component({
  selector: 'app-email-input',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule,TranslateModule],
  templateUrl: './email-input.component.html',
  styleUrl: './email-input.component.css'
})
export class EmailInputComponent {
  emailForm: FormGroup;
  @Output() sendEmailEvent = new EventEmitter<string>();
  @Input() errorMessage1: string | null = null;

  constructor(private fb: FormBuilder) {
    this.emailForm = this.fb.group({
      email: ['', [FormValidator.validEmail]] 
    });
  }

  sendEmail() {
    const emailControl = this.emailForm.controls['email'];

    emailControl.markAsTouched();
    emailControl.markAsDirty();

    if (!emailControl.value) {
      emailControl.setErrors({ required: true });
    }

    if (this.emailForm.valid) {
      this.sendEmailEvent.emit(this.emailForm.value.email);
    }
  }
}
