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
import { environment } from '../../../../../environments/environment.prod';

const base = environment.payment.qrBaseUrl;
const acc = environment.payment.qrAcc;
const bank = environment.payment.qrBank;

@Component({
  selector: 'app-thong-tin-don-hang',
  standalone: true,
  imports: [MATERIAL, ToastMessageComponent],
  templateUrl: './thong-tin-don-hang.html',
  styleUrl: './thong-tin-don-hang.scss'
})

export class ThongTinDonHang implements OnInit {

  bankName = environment.payment.qrBank;
  accountName = environment.payment.qrName;
  accountNumber = environment.payment.qrAcc;

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
    { key: 'da_giao_shipper', label: 'Shipper đã lấy hàng' },
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

      // ⚠️ chỉ xử lý đúng hóa đơn đang xem
      if (
        payload?.ma_hoa_don &&
        Number(payload.ma_hoa_don) !== Number(this.hoaDon.ma_hd)
      ) return;

      switch (msg.type) {

        // 🔄 User cập nhật trạng thái đơn
        case 'update_trang_thai_hoa_don_user': {
          this.hoaDon = {
            ...this.hoaDon,
            trang_thai: payload.trang_thai
          };
          break;
        }

        // ❌ User hủy đơn
        case 'cancel_hoa_don_user': {
          this.hoaDon = {
            ...this.hoaDon,
            trang_thai: 'da_huy'
          };
          break;
        }

        // 💳 Thanh toán thành công
        case 'payment_success': {
          const hdId =
            payload?.hoa_don_id ||
            payload?.ma_hoa_don ||
            payload?.id;

          if (Number(hdId) !== Number(this.hoaDon.ma_hd)) return;
          if (this.daXuLyThanhToan) return;

          this.daXuLyThanhToan = true;

          this.hoaDonService
            .getHoaDonById(this.hoaDon.ma_hd)
            .subscribe((res: any) => {

              this.hoaDon = res.data || res;
              this.daThanhToan = true;
              this.showQR = false;

              this.showToast('Thanh toán thành công!', 'success');
            });
          break;
        }

        // 💰 Update trạng thái thanh toán
        case 'update_trang_thai_thanh_toan': {
          this.hoaDon = {
            ...this.hoaDon,
            trang_thai_thanh_toan: payload.trang_thai_thanh_toan
          };

          if (payload.trang_thai_thanh_toan === 'da_thanh_toan') {
            this.showQR = false;
            this.showSuccessModal = true;
          }
          break;
        }

        // 🚚 Admin gán shipper (realtime cho user)
        case 'assign_shipper_user': {
          this.hoaDon = {
            ...this.hoaDon,
            shipper: payload.shipper,
            trang_thai: payload.trang_thai ?? 'da_giao_shipper' // 🔥 THÊM DÒNG NÀY
          };

          this.showToast('Đơn hàng đã được điều phối tài xế 🚚', 'success');
          break;
        }

        default:
          break;
      }
    });
  }

  openDanhGia(item: any) {

    if (item.da_danh_gia) {
      this.showToast('Bạn đã đánh giá món này rồi', 'warn');
      return;
    }

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

      this.showToast(result.message, result.success ? 'success' : 'error');

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
        ma_hoa_don: this.hoaDon.ma_hd,   // 🔥 FIX 100% đúng key
        ma_nguoi_dung: user.ma_nguoi_dung,
        ma_mon_an: item.ma_mon_an
      }).subscribe((res: any) => {
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
      `${base}?acc=${acc}&bank=${bank}` +
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
    const order = ['cho_xac_nhan', 'da_xac_nhan', 'da_giao_shipper', 'dang_giao', 'da_giao'];
    return order.indexOf(this.hoaDon.trang_thai) >= order.indexOf(stepKey);
  }

  close() {
    this.dialogRef.close();
  }
}