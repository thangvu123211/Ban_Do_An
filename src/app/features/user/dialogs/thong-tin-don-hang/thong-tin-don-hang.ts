import { Component, Inject, OnInit, OnDestroy } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { WebsocketService } from '../../../../core/services/websocket.service';
import { MATERIAL } from '../../../../Shared/material';
import { DanhGia } from '../danh-gia/danh-gia';
import { ToastMessageComponent } from '../../../../Shared/toasts_message/toast-message/toast-message';
import { DanhGiaService } from '../../../../core/services/DanhGia.service';
import { ThongTinMonAn } from '../../../guest/dialogs/thong-tin-mon-an/thong-tin-mon-an';
import { Router } from '@angular/router';
import { QuanLyMonAn } from '../../../../core/services/QuanLyMonAn.service';

@Component({
  selector: 'app-thong-tin-don-hang',
  standalone: true,
  imports: [MATERIAL, ToastMessageComponent],
  templateUrl: './thong-tin-don-hang.html',
  styleUrl: './thong-tin-don-hang.scss'
})
export class ThongTinDonHang implements OnInit {

  hoaDon: any;

  toast = {
    show: false,
    message: '',
    type: 'success' as 'success' | 'warn' | 'error'
  };

  daDanhGia = false;

  steps = [
    { key: 'cho_xac_nhan', label: 'Chờ xác nhận' },
    { key: 'da_xac_nhan', label: 'Đã xác nhận' },
    { key: 'dang_giao', label: 'Đang giao hàng' },
    { key: 'da_giao', label: 'Đã giao hàng' }
  ];

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dialogRef: MatDialogRef<ThongTinDonHang>,
    private wsService: WebsocketService,
    private dialog: MatDialog,
    private danhGiaService: DanhGiaService,
    private router: Router,
    private monAnService: QuanLyMonAn
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
    this.checkDanhGia();

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

  openDanhGia(item: any) {
    const dialogRef = this.dialog.open(DanhGia, {
      width: '500px',
      height: '500px',
      data: {
        ma_hoa_don: this.hoaDon.ma_hd,
        ma_mon_an: item.ma_mon_an,
        ten_mon_an: item.mon_an?.ten_mon_an
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (!result) return;

      // ✅ GIỮ TOAST CỦA BẠN
      this.showToast(result.message, result.success ? 'success' : 'error');

      // reload lại trạng thái đã đánh giá
      this.checkDanhGia();
    });
  }

  openRating(item: any) {

    this.monAnService.LayMonAnTheoID(item.ma_mon_an)
      .subscribe((res: any) => {

        const mon = res.data;

        this.dialog.open(ThongTinMonAn, {
          width: '650px',
          height: '85vh',
          panelClass: 'thong-tin-mon-dialog',
          data: {
            ma_mon_an: mon.ma_mon_an,
            ten_mon_an: mon.ten_mon_an,
            gia_tien: mon.gia_tien,
            mo_ta: mon.mo_ta,
            anh_mon_an: mon.anh_mon_an || [],
            openTab: 'rating'
          }
        });

      });
  }


  checkDanhGia() {
    const user = JSON.parse(localStorage.getItem('user') || '{}');

    if (!this.hoaDon?.chi_tiet_hoa_dons) return;

    this.hoaDon.chi_tiet_hoa_dons.forEach((item: any) => {

      this.danhGiaService.checkDanhGia({
        ma_hd: this.hoaDon.ma_hd,
        ma_nguoi_dung: user.ma_nguoi_dung,
        ma_mon_an: item.ma_mon_an
      }).subscribe(res => {
        item.da_danh_gia = res.da_danh_gia;
      });

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