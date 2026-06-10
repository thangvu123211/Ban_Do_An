import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MATERIAL } from '../../../../Shared/material';

@Component({
  selector: 'app-xac-nhan-thanh-toan',
  imports: [MATERIAL],
  templateUrl: './xac-nhan-thanh-toan.html',
  styleUrl: './xac-nhan-thanh-toan.scss'
})
export class XacNhanThanhToan {
  constructor(
    private dialogRef: MatDialogRef<XacNhanThanhToan>,
    @Inject(MAT_DIALOG_DATA) public data: {
      tongTien: number;
      tenNguoiNhan: string;
      sdt: string;
      diaChi: string;
    }
  ) { }

  huy() {
    this.dialogRef.close(false);
  }

  xacNhan() {
    this.dialogRef.close(true);
  }
}

