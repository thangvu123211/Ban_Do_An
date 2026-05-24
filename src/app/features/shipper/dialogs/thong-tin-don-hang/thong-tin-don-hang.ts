import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MATERIAL } from '../../../../Shared/material';
import { WebsocketService } from '../../../../core/services/websocket.service';
import { HoaDonService } from '../../../../core/services/HoaDon.Service';
import { ToastMessageComponent } from '../../../../Shared/toasts_message/toast-message/toast-message';

@Component({
  selector: 'app-thong-tin-don-hang',
  imports: [MATERIAL, ToastMessageComponent],
  templateUrl: './thong-tin-don-hang.html',
  styleUrl: './thong-tin-don-hang.scss'
})
export class ThongTinDonHang implements OnInit {

  hoaDon: any;

  steps = [
    { key: 'cho_xac_nhan', label: 'Chờ xác nhận' },
    { key: 'da_xac_nhan', label: 'Đã xác nhận' },
    { key: 'dang_giao', label: 'Đang giao hàng' },
    { key: 'da_giao', label: 'Đã giao hàng' }
  ];

  toast = {
    show: false,
    message: '',
    type: 'success' as 'success' | 'warn' | 'error'
  };

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dialogRef: MatDialogRef<ThongTinDonHang>,
    private wsService: WebsocketService,
    private hoaDonService: HoaDonService
  ) {
    this.hoaDon = data;
  }

  ngOnInit(): void {
    this.wsService.connect();

    this.wsService.messages$.subscribe((msg: any) => {
      if (!msg?.type) return;

      const payload = msg.payload;

      // chỉ update đúng đơn này
      if (payload?.ma_hd !== this.hoaDon.ma_hd) return;

      if (msg.type === 'update_trang_thai_hoa_don_user') {

        this.hoaDon = {
          ...this.hoaDon,
          trang_thai: payload.trang_thai
        };

      }

      if (msg.type === 'cancel_hoa_don_user') {
        this.hoaDon = {
          ...this.hoaDon,
          trang_thai: 'da_huy'
        };
      }
    });
  }


  isHuy(): boolean {
    return this.hoaDon.trang_thai === 'da_huy';
  }

  showToast(message: string, type: 'success' | 'warn' | 'error') {
    this.toast.show = true;
    this.toast.message = message;
    this.toast.type = type;
    setTimeout(() => this.toast.show = false, 3000);
  }

  isStepActive(stepKey: string): boolean {
    const order = ['cho_xac_nhan', 'da_xac_nhan', 'dang_giao', 'da_giao'];
    return order.indexOf(this.hoaDon.trang_thai) >= order.indexOf(stepKey);
  }

  capNhatTrangThai(trangThai: string) {

  // 🚫 CHẶN SAI LUỒNG
  if (trangThai === 'dang_giao' && this.hoaDon.trang_thai !== 'da_xac_nhan') {
    return;
  }

  if (trangThai === 'da_giao' && this.hoaDon.trang_thai !== 'dang_giao') {
    return;
  }

  this.hoaDonService.updateTrangThai(this.hoaDon.ma_hd, trangThai)
    .subscribe({
      next: () => {
        this.hoaDon.trang_thai = trangThai;

        this.showToast(
          trangThai === 'dang_giao'
            ? '🚚 Shipper đang giao đơn hàng'
            : '✅ Đơn hàng đã giao thành công',
          'success'
        );
      },
      error: () => {
        this.showToast('❌ Cập nhật trạng thái thất bại', 'error');
      }
    });
}
  close() {
    this.dialogRef.close();
  }

  canDangGiao(): boolean {
    return this.hoaDon.trang_thai === 'da_xac_nhan';
  }

  canDaGiao(): boolean {
    return this.hoaDon.trang_thai === 'dang_giao';
  }

  isDaGiao(): boolean {
    return this.hoaDon.trang_thai === 'da_giao';
  }
}
