import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MATERIAL } from '../../../Shared/material';

@Component({
  selector: 'app-danh-sach-mon-an',
  imports: [MATERIAL],
  templateUrl: './danh-sach-mon-an.html',
  styleUrl: './danh-sach-mon-an.scss'
})
export class DanhSachMonAn {
  constructor(
    private dialogRef: MatDialogRef<DanhSachMonAn>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}
  close() {
    this.dialogRef.close();
  }
}
