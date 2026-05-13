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
    { key: 'dang_chuan_bi', label: 'Đang chuẩn bị' },
    { key: 'dang_giao', label: 'Đang giao hàng' },
    { key: 'da_giao', label: 'Đã giao hàng' },
    //{ key: 'da_huy', label: 'Đã hủy đơn hàng' },
    //{ key: 'da_thanh_toan', label: 'Đã thanh toán' }
  ];

  constructor(
    @Inject(MAT_DIALOG_DATA) public hoaDon: any,
    private dialogRef: MatDialogRef<ThongTinDonHang>
  ) { }

  isHuy(): boolean {
    return this.hoaDon.trang_thai === 'da_huy';
  }

  isThanhToan(): boolean {
    return this.hoaDon.trang_thai === 'da_thanh_toan';
  }

  isActive(stepKey: string): boolean {
    const order = ['cho_xac_nhan', 'dang_chuan_bi', 'dang_giao', 'da_giao'];
    return order.indexOf(this.hoaDon.trang_thai) >= order.indexOf(stepKey);
  }

  close() {
    this.dialogRef.close();
  }
}
