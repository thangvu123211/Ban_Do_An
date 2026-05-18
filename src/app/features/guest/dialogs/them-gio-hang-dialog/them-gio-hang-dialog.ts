import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MATERIAL } from '../../../../Shared/material';
import { CartService } from '../../../../core/services/cart.service';
import { AuthService } from '../../../../core/services/auth.service';

@Component({
  selector: 'app-them-gio-hang-dialog',
  standalone: true,
  imports: [MATERIAL],
  templateUrl: './them-gio-hang-dialog.html',
  styleUrl: './them-gio-hang-dialog.scss'
})
export class ThemGioHangDialog {

  mon: any = null;
  soLuong = 1;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dialogRef: MatDialogRef<ThemGioHangDialog>,
    private cartService: CartService,
    private authService: AuthService
  ) {
    this.mon = data?.mon ?? null;
  }

  tangSoLuong() {
    this.soLuong++;
  }

  giamSoLuong() {
    if (this.soLuong > 1) {
      this.soLuong--;
    }
  }

  get tongTien() {
    return this.soLuong * (this.mon?.gia_tien || 0);
  }

  xacNhan() {
  this.dialogRef.close({
    mon: {
      ma_mon_an: this.mon.ma_mon_an,
      ten_mon_an: this.mon.ten_mon_an,
      gia_tien: this.mon.gia_tien,
      anh_mon_an: this.mon.anh_mon_an
    },
    soLuong: this.soLuong
  });
}

  huy() {
    this.dialogRef.close();
  }
}