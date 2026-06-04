import { Component, Inject, OnInit } from '@angular/core';
import { MATERIAL } from '../../../../Shared/material';
import { ToastMessageComponent } from '../../../../Shared/toasts_message/toast-message/toast-message';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { WebsocketService } from '../../../../core/services/websocket.service';
import { DanhGiaService } from '../../../../core/services/DanhGia.service';
import { Router } from '@angular/router';
import { QuanLyMonAn } from '../../../../core/services/QuanLyMonAn.service';
import { HoaDonService } from '../../../../core/services/HoaDon.Service';

@Component({
  selector: 'app-thong-tin-hoa-don',
  imports: [MATERIAL, ToastMessageComponent],
  templateUrl: './thong-tin-hoa-don.html',
  styleUrl: './thong-tin-hoa-don.scss'
})
export class ThongTinHoaDon implements OnInit {

  hoaDon: any;
  isLoading = false;
  openShipper: boolean = false;
  openStatus = false;

  toast = {
    show: false,
    message: '',
    type: 'success' as 'success' | 'warn' | 'error'
  };

  daDanhGia = false;
  originalTrangThai: string = '';

  steps = [
    { key: 'cho_xac_nhan', label: 'Chờ xác nhận' },
    { key: 'da_xac_nhan', label: 'Đã xác nhận' },
    { key: 'dang_giao', label: 'Đang giao hàng' },
    { key: 'da_giao', label: 'Đã giao hàng' }
  ];

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dialogRef: MatDialogRef<ThongTinHoaDon>,
    private wsService: WebsocketService,
    private dialog: MatDialog,
    private danhGiaService: DanhGiaService,
    private router: Router,
    private monAnService: QuanLyMonAn,
    private hoaDonService: HoaDonService
  ) {
    this.hoaDon = data;
  }

  showToast(message: string, type: 'success' | 'warn' | 'error') {
    this.toast.show = true;
    this.toast.message = message;
    this.toast.type = type;
    setTimeout(() => this.toast.show = false, 3000);
  }

  ngOnInit(): void {
    this.wsService.connect();
    this.originalTrangThai = this.hoaDon.trang_thai;
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


  get isDisableUpdate(): boolean {
    return (
      this.isLoading ||
      this.hoaDon?.trang_thai === this.originalTrangThai ||
      this.hoaDon?.trang_thai === 'dang_giao' ||
      this.hoaDon?.trang_thai === 'da_giao' 
    );
  }
  capNhatTrangThai() {
    this.isLoading = true;

    this.hoaDonService.updateTrangThai(
      this.hoaDon.ma_hd,
      this.hoaDon.trang_thai
    ).subscribe({
      next: () => {
        this.isLoading = false;
        this.showToast('Cập nhật thành công', 'success');
      },
      error: () => {
        this.isLoading = false;
        this.showToast('Cập nhật thất bại', 'error');
      }
    });
  }


  isHuy(): boolean {
    return this.hoaDon.trang_thai === 'da_huy';
  }

  isDaGiao(): boolean {
    return this.hoaDon?.trang_thai === 'da_giao';
  }

  isStepActive(stepKey: string): boolean {
    const order = ['cho_xac_nhan', 'da_xac_nhan', 'dang_giao', 'da_giao'];
    return order.indexOf(this.hoaDon.trang_thai) >= order.indexOf(stepKey);
  }

  close() {
    this.dialogRef.close();
  }
}