import { Component, Inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { TranslateModule, TranslateService } from '@ngx-translate/core';

interface ShiftDialogData {
  shift: {
    id: number;
    startTime: string;
    endTime: string;
    mode: string;
  };
}

@Component({
  selector: 'app-shift-edit-dialog',
  templateUrl: './shift-edit-dialog.component.html',
  styleUrls: ['./shift-edit-dialog.component.css'],
  imports: [TranslateModule,FormsModule]
})
export class ShiftEditDialogComponent {
  modeOptions = [
    { value: 'Day', label: 'SHIFT_MODES.DAY' },
    { value: 'Night', label: 'SHIFT_MODES.NIGHT' },
    { value: 'Evening', label: 'SHIFT_MODES.EVENING' },
    { value: 'Flexible', label: 'SHIFT_MODES.FLEXIBLE' }
  ];

  constructor(
    public dialogRef: MatDialogRef<ShiftEditDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: ShiftDialogData,
    private translate: TranslateService
  ) {}

  onSave(): void {
    // Format times to HHmm format before saving
    const formattedData = {
      ...this.data.shift,
      startTime: this.data.shift.startTime.replace(':', ''),
      endTime: this.data.shift.endTime.replace(':', '')
    };
    this.dialogRef.close(formattedData);
  }

  onCancel(): void {
    this.dialogRef.close();
  }
}