import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MATERIAL } from '../../../Shared/material';

@Component({
  selector: 'app-yeu-thich',
  imports:[MATERIAL],
  templateUrl: './yeu-thich.html',
  styleUrl: './yeu-thich.scss',
  standalone: true
})
export class YeuThich {

  constructor(private dialogRef: MatDialogRef<YeuThich>,
    @Inject(MAT_DIALOG_DATA) public data: any) {}
  close() {
    this.dialogRef.close();
  }
}