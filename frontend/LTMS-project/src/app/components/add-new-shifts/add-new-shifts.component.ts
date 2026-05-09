// add-new-shifts.component.ts
import { Component, Inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { ShiftDTO } from '../../interface/shift/shift';
import { Router } from '@angular/router';
import { ShiftService } from '../../services/shift/shift-service.service';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-add-new-shifts',
  standalone: true,
  imports: [FormsModule, CommonModule, TranslateModule],
  templateUrl: './add-new-shifts.component.html',
  styleUrls: ['./add-new-shifts.component.css']
})
export class AddNewShiftsComponent {
  startTime: string = '';
  endTime: string = '';
  mood: string = 'neutral';
  isLoading: boolean = false;
  message: string = '';
  isError: boolean = false;
  
  moods = [
    { value: 'happy', label: 'MOOD.HAPPY' },
    { value: 'neutral', label: 'MOOD.NEUTRAL' },
    { value: 'sad', label: 'MOOD.SAD' },
    { value: 'tired', label: 'MOOD.TIRED' }
  ];

  constructor(
    private translate: TranslateService,
    private shiftService: ShiftService,
    private router: Router,
    private dialogRef: MatDialogRef<AddNewShiftsComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  onSubmit(): void {
    if (!this.startTime || !this.endTime) {
      this.showMessage('ADD_NEW_SHIFT.ERRORS.REQUIRED_FIELDS', true);
      return;
    }

    this.isLoading = true;
    this.message = '';  

    const shiftData: ShiftDTO = {
      startTime: this.startTime,
      endTime: this.endTime,
      mode: this.mood,
      // Add other required fields if your ShiftDTO has more properties
    };

    this.shiftService.addShift(shiftData).subscribe({
      next: (response) => {
        this.isLoading = false;
        this.showMessage('ADD_NEW_SHIFT.SUCCESS', false);
        setTimeout(() => {
          this.dialogRef.close(true); // Close dialog with 'true' indicating success
          window.location.reload(); // Force page refresh
        }, 1000);
      },
      error: (error) => {
        this.isLoading = false;
        console.error('Error adding shift:', error);
        const errorKey = error.status === 400 ? 'ADD_NEW_SHIFT.ERRORS.BAD_REQUEST' 
                     : 'ADD_NEW_SHIFT.ERRORS.GENERIC';
        this.showMessage(errorKey, true);
      }
    });
  }

  private showMessage(messageKey: string, isError: boolean): void {
    this.isError = isError;
    this.message = messageKey;
    
    // Auto-hide message after 5 seconds if it's not an error
    if (!isError) {
      setTimeout(() => {
        if (this.message === messageKey) {
          this.message = '';
        }
      }, 5000);
    }
  }

  clearMessage(): void {
    this.message = '';
  }

  onCancel(): void {
    this.dialogRef.close(false); // Close dialog without refresh
  }
}