

import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MATERIAL } from '../../../Shared/material';

@Component({
  selector: 'app-gio-hang',
  imports: [MATERIAL],
  templateUrl: './gio-hang.html',
  styleUrl: './gio-hang.scss'
})
export class GioHang {

  gioHang: any[] = [];
  maBan!: number;
  tenBan!: string;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dialogRef: MatDialogRef<GioHang>
  ) {
    this.gioHang = data.gioHang;
    this.maBan = data.maBan;
    this.tenBan = data.tenBan;
  }

  goiMon() {
    this.data.onGoiMon(); // 🔥 gọi thẳng hàm cha
    this.dialogRef.close();
  }
  tangSoLuong(item: any) {
    item.soLuong++;
  }

  giamSoLuong(item: any) {
    if (item.soLuong > 1) {
      item.soLuong--;
    }
  }
  removeFromGioHang(mon: any) {
  const index = this.gioHang.findIndex(
    item => item.ma_mon_an === mon.ma_mon_an
  );

  if (index !== -1) {
    this.gioHang.splice(index, 1); // 🔥 mutate mảng gốc
  }
}
  get tongTien(): number {
    return this.gioHang.reduce((sum, i) => sum + i.gia_tien * i.soLuong, 0);
  }
  close() {
    this.dialogRef.close();
  }
}

