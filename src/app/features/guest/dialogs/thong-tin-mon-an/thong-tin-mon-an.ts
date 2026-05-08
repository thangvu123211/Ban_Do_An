import { Component, Inject } from '@angular/core';
import { MATERIAL } from '../../../../Shared/material';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { CartService } from '../../../../core/services/cart.service';
import { ToastMessageComponent } from '../../../../Shared/toasts_message/toast-message/toast-message';

@Component({
  selector: 'app-thong-tin-mon-an',
  imports: [MATERIAL, ToastMessageComponent],
  templateUrl: './thong-tin-mon-an.html',
  styleUrl: './thong-tin-mon-an.scss'
})
export class ThongTinMonAn {
  toast = {
    show: false,
    message: '',
    type: 'success' as 'success' | 'warn' | 'error'
  };

  constructor(
    public dialogRef: MatDialogRef<ThongTinMonAn>,
    private cartService: CartService,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) { }

  showToast(message: string, type: 'success' | 'warn' | 'error') {
    this.toast.show = true;
    this.toast.message = message;
    this.toast.type = type;
    setTimeout(() => (this.toast.show = false), 3000);
  }

  close() {
    this.dialogRef.close();
  }
  addToGioHang(mon: any): void {
    this.cartService.addItem({
      id: mon.ma_mon_an,
      ma_mon_an: mon.ma_mon_an,
      ten_mon_an: mon.ten_mon_an,
      gia_tien: mon.gia_tien,
      anh_mon_an: mon.anh_mon_an
    });

    // 👉 trả kết quả về component cha
    this.dialogRef.close({
      success: true,
      message: `Thêm thành công món ${mon.ten_mon_an} vào giỏ hàng`
    });
  }
}
