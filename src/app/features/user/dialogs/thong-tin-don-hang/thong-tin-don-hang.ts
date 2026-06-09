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
import { HoaDonService } from '../../../../core/services/HoaDon.Service';

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

  showQR = false;
  qrUrl = '';
  maHoaDonDangThanhToan: number | null = null;

  daDanhGia = false;
  daThanhToan = false;
  daXuLyThanhToan = false;

  steps = [
    { key: 'cho_xac_nhan', label: 'Chờ xác nhận' },
    { key: 'da_xac_nhan', label: 'Đã xác nhận' },
    { key: 'dang_giao', label: 'Đang giao hàng' },
    { key: 'da_giao', label: 'Đã giao hàng' }
  ];
  showSuccessModal = false;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dialogRef: MatDialogRef<ThongTinDonHang>,
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
    this.checkDanhGia();

    this.wsService.messages$.subscribe((msg: any) => {
      if (!msg?.type) return;

      const payload = msg.payload;

      // chỉ update đúng đơn này
      if (payload?.ma_hoa_don !== this.hoaDon.ma_hd) return;

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

      if (msg.type === 'payment_success') {

        console.log('PAYMENT SUCCESS:', msg);

        const hdId =
          msg.payload?.hoa_don_id ||
          msg.payload?.ma_hoa_don ||
          msg.payload?.id;

        if (Number(hdId) !== Number(this.hoaDon.ma_hd)) return;
        if (this.daXuLyThanhToan) return;

        this.daXuLyThanhToan = true;

        this.hoaDonService.getHoaDonById(this.hoaDon.ma_hd).subscribe((res: any) => {

          this.hoaDon = res.data || res;

          this.daThanhToan = true;
          this.showQR = false;

          this.showToast('Thanh toán thành công!', 'success');
        });
      }

      if (msg.type === 'update_trang_thai_thanh_toan') {

        if (Number(msg.payload.ma_hoa_don) !== Number(this.hoaDon.ma_hd)) return;

        this.hoaDon = {
          ...this.hoaDon,
          trang_thai_thanh_toan: msg.payload.trang_thai_thanh_toan
        };

        // ⭐ FIX QUAN TRỌNG
        if (msg.payload.trang_thai_thanh_toan === 'da_thanh_toan') {
          this.showQR = false;
          this.showSuccessModal = true;
        }
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

  moThanhToan() {
    if (!this.hoaDon?.ma_hd) return;

    this.maHoaDonDangThanhToan = this.hoaDon.ma_hd;

    const amount = this.hoaDon.tong_tien;

    const content = `HD${this.hoaDon.ma_hd}`;

    this.qrUrl =
      `https://qr.sepay.vn/img?acc=0123456789&bank=MBBank` +
      `&amount=${amount}&des=${encodeURIComponent(content)}`;

    this.showQR = true;
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