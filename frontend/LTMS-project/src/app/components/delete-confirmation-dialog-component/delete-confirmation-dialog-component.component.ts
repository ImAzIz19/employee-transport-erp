import { CommonModule } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { TranslateModule } from '@ngx-translate/core';

export type DialogActionType = 'delete' | 'deactivate' | 'activate';

export interface DialogData {
  entityName: string;
  actionType: DialogActionType;
  additionalMessage?: string;
}

@Component({
  selector: 'app-confirmation-dialog',
  standalone: true,
  imports: [
    CommonModule,
    MatDialogModule,
    MatButtonModule,
    TranslateModule
  ],
  templateUrl: './delete-confirmation-dialog-component.component.html',
  styleUrls: ['./delete-confirmation-dialog-component.component.css']
})
export class DeleteConfirmationDialogComponent {
  constructor(
    public dialogRef: MatDialogRef<DeleteConfirmationDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData
  ) {}

  get actionTitle(): string {
    switch (this.data.actionType) {
      case 'delete': return 'DELETE_TITLE';
      case 'deactivate': return 'DEACTIVATE_TITLE';
      case 'activate': return 'ACTIVATE_TITLE';
      default: return 'CONFIRM_ACTION';
    }
  }

  get actionMessage(): string {
    switch (this.data.actionType) {
      case 'delete': return 'DELETE_CONFIRMATION_MESSAGE';
      case 'deactivate': return 'DEACTIVATE_CONFIRMATION_MESSAGE';
      case 'activate': return 'ACTIVATE_CONFIRMATION_MESSAGE';
      default: return 'CONFIRM_ACTION_MESSAGE';
    }
  }

  get confirmButtonText(): string {
    switch (this.data.actionType) {
      case 'delete': return 'DELETE';
      case 'deactivate': return 'DEACTIVATE';
      case 'activate': return 'ACTIVATE';
      default: return 'CONFIRM';
    }
  }
}