import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MATERIAL } from '../../material';
@Component({
  selector: 'app-confirm-dialog',
  standalone: true,
  imports: [MATERIAL],
  templateUrl: './confirm-dialog.html',
  styleUrls: ['./confirm-dialog.scss'] // chú ý có s
})
export class ConfirmDialogComponent {
  constructor(
    public dialogRef: MatDialogRef<ConfirmDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { message: string }
  ) {}

  onNoClick(): void {
    this.dialogRef.close(false);
  }

  onYesClick(): void {
    this.dialogRef.close(true);
  }
}
