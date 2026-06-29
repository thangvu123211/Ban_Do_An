import { Component, OnInit } from '@angular/core';
import { HoaDonService } from '../../../core/services/HoaDon.Service';
import { MATERIAL } from '../../../Shared/material';
import { MatDialog } from '@angular/material/dialog';
import { ThongTinDonHang } from '../dialogs/thong-tin-don-hang/thong-tin-don-hang';
import { WebsocketService } from '../../../core/services/websocket.service';
import { ToastMessageComponent } from '../../../Shared/toasts_message/toast-message/toast-message';
import { ConfirmDialogComponent } from '../../../Shared/dialogs/confirm-dialog/confirm-dialog';
import { ActivatedRoute, Router } from '@angular/router';


@Component({
  selector: 'app-don-hang',
  imports: [MATERIAL, ToastMessageComponent],
  templateUrl: './don-hang.html',
  styleUrl: './don-hang.scss'
})
export class DonHang implements OnInit {
  hoaDons: any[] = [];
  loading = false;
  expandedHoaDonId: number | null = null;

  trangDangChon: 'ALL' | 'CHO_XAC_NHAN' | 'CHUA_THANH_TOAN' | 'DA_HUY' | 'DANG_XU_LY' = 'CHO_XAC_NHAN';

  toast = {
    show: false,
    message: '',
    type: 'success' as 'success' | 'warn' | 'error'
  };

  constructor(
    private hoaDonService: HoaDonService,
    private dialog: MatDialog,
    private wsService: WebsocketService,
    private route: ActivatedRoute,
    private router: Router) { }

  showToast(message: string, type: 'success' | 'warn' | 'error') {
    this.toast.show = true;
    this.toast.message = message;
    this.toast.type = type;
    setTimeout(() => this.toast.show = false, 3000);
  }

  chonTrang(trang: any) {
    this.trangDangChon = trang;

    if (trang === 'ALL') {
      this.loadHoaDons();
    }
  }

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      if (params['tab']) {
        this.trangDangChon = params['tab'];
      }
    });
    this.loadHoaDons();
    this.connectRealtime();
  }
  loadHoaDons() {
    this.loading = true;
    this.hoaDonService.getHoaDonCuaUser().subscribe({
      next: (res: any) => {
        this.hoaDons = res.data; // backend trả { data: [...] }
        this.loading = false;
      },
      error: () => {
        this.loading = false;
        alert('Không thể tải hóa đơn');
      }
    });
  }

  get hoaDonsDaLoc() {
    switch (this.trangDangChon) {
      case 'ALL':
        return this.hoaDons;

      case 'CHO_XAC_NHAN':
        return this.hoaDons.filter(          
          x => x.trang_thai === 'cho_xac_nhan' &&
          x.trang_thai_thanh_toan === 'da_thanh_toan'
        );

      case 'CHUA_THANH_TOAN':
        return this.hoaDons.filter(
          x => x.trang_thai_thanh_toan === 'chua_thanh_toan'
        );

      case 'DA_HUY':
        return this.hoaDons.filter(
          x => x.trang_thai === 'da_huy'
        );

      default:
        return this.hoaDons;
    }
  }



  connectRealtime() {
    this.wsService.connect();

    this.wsService.messages$
      .pipe()
      .subscribe((msg: any) => {

        if (!msg?.type) return;
        const payload = msg.payload;

        switch (msg.type) {

          // ===== NEW ORDER =====
          case 'new_hoa_don_user':
            this.hoaDons = [msg.payload, ...this.hoaDons];
            break;

          // ===== UPDATE STATUS =====
          case 'update_trang_thai_hoa_don_user': {
            const index = this.hoaDons.findIndex(
              h => h.ma_hd === msg.payload.ma_hoa_don
            );

            if (index !== -1) {
              this.hoaDons[index].trang_thai = msg.payload.trang_thai;
            }
            break;
          }

          // ===== CANCEL =====
          case 'cancel_hoa_don_user': {
            const index = this.hoaDons.findIndex(
              h => h.ma_hd === msg.payload.ma_hoa_don
            );

            if (index !== -1) {
              this.hoaDons[index] = {
                ...this.hoaDons[index],
                trang_thai: 'da_huy'
              };
            }
            break;
          }
          case 'hoa_don_bi_huy_user': {
            const index = this.hoaDons.findIndex(
              h => h.ma_hd === msg.payload.ma_hoa_don
            );

            if (index !== -1) {
              this.hoaDons[index] = {
                ...this.hoaDons[index],
                trang_thai: 'da_huy',
                trang_thai_thanh_toan: 'da_huy',
              };

              // ép change detection
              this.hoaDons = [...this.hoaDons];
            }
            break;
          }

          case 'update_trang_thai_thanh_toan': {
            const index = this.hoaDons.findIndex(
              h => h.ma_hd === msg.payload.ma_hoa_don
            );

            if (index !== -1) {
              this.hoaDons[index].trang_thai_thanh_toan =
                msg.payload.trang_thai_thanh_toan;

              // ép Angular render lại
              this.hoaDons = [...this.hoaDons];
            }
            break;
          }
          case 'assign_shipper_user': {
            const index = this.hoaDons.findIndex(
              h => h.ma_hd === msg.payload.ma_hoa_don
            );

            if (index !== -1) {
              this.hoaDons[index] = {
                ...this.hoaDons[index],
                shipper: msg.payload.shipper,
                trang_thai: 'da_giao_shipper'   // 🔥 THÊM DÒNG NÀY
              };

              this.hoaDons = [...this.hoaDons];
            }

            this.showToast('Đơn hàng đã được điều phối tài xế 🚚', 'success');
            break;
          }
          case 'payment_success': {

            const hdId =
              payload?.hoa_don_id ||
              payload?.ma_hoa_don ||
              payload?.id;

            const index = this.hoaDons.findIndex(
              h => Number(h.ma_hd) === Number(hdId)
            );

            if (index === -1) return;

            if (this.hoaDons[index].trang_thai_thanh_toan === 'da_thanh_toan') return;

            this.hoaDons[index] = {
              ...this.hoaDons[index],
              trang_thai_thanh_toan: 'da_thanh_toan'
            };

            this.hoaDons = [...this.hoaDons];

            this.showToast('Thanh toán thành công 💰', 'success');

            break;
          }

          default:
            break;
        }

      });
  }

  ngOnDestroy() {
    this.wsService.disconnect();
  }

  ThongTinDonHang(hoaDon: any) {
    this.dialog.open(ThongTinDonHang, {
      width: '1000px',
      maxWidth: '95vw',
      height: '85vh',
      data: hoaDon
    });
  }

  trangThaiDonHangMap: Record<string, any> = {
    cho_xac_nhan: { label: 'Chờ xác nhận', classes: 'bg-yellow-100 text-yellow-700' },
    da_xac_nhan: { label: 'Đã xác nhận', classes: 'bg-blue-100 text-blue-700' },
    dang_giao: { label: 'Đang giao', classes: 'bg-indigo-100 text-indigo-700' },
    da_giao_shipper: { label: 'Shipper đã lấy hàng', classes: 'bg-indigo-100 text-indigo-700' },
    da_giao: { label: 'Đã giao', classes: 'bg-green-100 text-green-700' },
    da_huy: { label: 'Đã hủy', classes: 'bg-red-100 text-red-700' },
  };

  trangThaiThanhToanMap: Record<string, any> = {
    da_thanh_toan: { label: 'Đã thanh toán', classes: 'bg-emerald-100 text-emerald-700' },
    chua_thanh_toan: { label: 'Chưa thanh toán', classes: 'bg-gray-100 text-gray-600' },
    da_huy: { label: 'Đã hủy', classes: 'bg-red-100 text-red-700' },
  };

  toggleExpand(ma_hd: number) {
    this.expandedHoaDonId =
      this.expandedHoaDonId === ma_hd ? null : ma_hd;
  }

  huyHoaDon(maHoaDon: number) {
    // 🔎 tìm hóa đơn
    const hoaDon = this.hoaDons.find(h => h.ma_hd === maHoaDon);

    if (!hoaDon) {
      this.showToast('Không tìm thấy hóa đơn', 'error');
      return;
    }

    // 🚫 đã thanh toán → không cho hủy
    if (hoaDon.trang_thai_thanh_toan === 'da_thanh_toan') {
      this.showToast(
        'Đơn hàng đã thanh toán, không thể hủy',
        'warn'
      );
      return;
    }

    // ✅ CHƯA thanh toán → cho hủy
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '400px',
      data: {
        message: 'Bạn có chắc chắn muốn hủy hóa đơn này không?'
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (!result) return;

      this.hoaDonService.huyThanhToan(maHoaDon).subscribe({
        next: () => {
          this.showToast('Hủy hóa đơn thành công', 'success');
        },
        error: (err) => {
          this.showToast(
            err.error?.error || 'Không thể hủy hóa đơn',
            'error'
          );
        }
      });
    });
  }


}
