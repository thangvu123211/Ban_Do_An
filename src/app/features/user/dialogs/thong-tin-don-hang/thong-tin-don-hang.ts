import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MATERIAL } from '../../../../Shared/material';

@Component({
  selector: 'app-thong-tin-don-hang',
  imports: [MATERIAL],
  templateUrl: './thong-tin-don-hang.html',
  styleUrl: './thong-tin-don-hang.scss'
})
export class ThongTinDonHang {
steps = [
    { key: 'cho_xac_nhan', label: 'Chờ xác nhận' },
    { key: 'da_xac_nhan', label: 'Đã xác nhận' },
    { key: 'dang_lam', label: 'Đang làm' },
    { key: 'dang_giao', label: 'Đang giao' }
  ];

  constructor(
    @Inject(MAT_DIALOG_DATA) public hoaDon: any,
    private dialogRef: MatDialogRef<ThongTinDonHang>
  ) {}

  isActive(stepKey: string): boolean {
    const order = ['cho_xac_nhan', 'da_xac_nhan', 'dang_lam', 'dang_giao'];
    return order.indexOf(this.hoaDon.trang_thai) >= order.indexOf(stepKey);
  }

  close() {
    this.dialogRef.close();
  }
}
