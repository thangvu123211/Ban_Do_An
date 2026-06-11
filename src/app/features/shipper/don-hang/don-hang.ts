import { Component, OnInit } from '@angular/core';
import { shipperService } from '../../../core/services/shipper.service';
import { MatDialog } from '@angular/material/dialog';
import { WebsocketService } from '../../../core/services/websocket.service';
import { MATERIAL } from '../../../Shared/material';
import { ThongTinDonHang } from '../dialogs/thong-tin-don-hang/thong-tin-don-hang';
import { HoaDonService } from '../../../core/services/HoaDon.Service';
import { ToastMessageComponent } from '../../../Shared/toasts_message/toast-message/toast-message';

@Component({
  selector: 'app-don-hang',
  imports: [MATERIAL, ToastMessageComponent],
  templateUrl: './don-hang.html',
  styleUrl: './don-hang.scss'
})
export class DonHang implements OnInit {

  hoaDons: any[] = [];
  loading = false;

  isShowDelivered = false;
  viewMode: 'all' | 'delivered' = 'all';

  expandedHoaDonId: number | null = null;

  toast = {
    show: false,
    message: '',
    type: 'success' as 'success' | 'warn' | 'error'
  };

  constructor(
    private hoaDonService: HoaDonService,
    private dialog: MatDialog,
    private wsService: WebsocketService
  ) { }

  showToast(message: string, type: 'success' | 'warn' | 'error') {
    this.toast.show = true;
    this.toast.message = message;
    this.toast.type = type;
    setTimeout(() => this.toast.show = false, 3000);
  }

  ngOnInit(): void {
    this.loadHoaDons();
    this.connectRealtime();
  }
  loadHoaDons() {
    this.loading = true;

    const api =
      this.viewMode === 'delivered'
        ? this.hoaDonService.getALLHoaDonByShipper()
        : this.hoaDonService.getHoaDonByShipper();

    api.subscribe({
      next: (res: any) => {
        this.hoaDons = res;
        this.loading = false;
      },
      error: () => {
        this.showToast('Lỗi tải dữ liệu', 'error');
        this.loading = false;
      }
    });
  }

  toggleDeliveredOrders() {
    this.viewMode =
      this.viewMode === 'all' ? 'delivered' : 'all';

    this.loadHoaDons();
  }

  loadALLHoaDons() {
    this.loading = true;
    this.hoaDonService.getALLHoaDonByShipper().subscribe({
      next: (res: any) => {
        this.hoaDons = res; // backend trả { data: [...] }
        this.loading = false;
        console.log(this.hoaDons);
      },
      error: () => {
        this.showToast('Lỗi không thể tải tất cả đơn hàng', 'error');
      }
    });
  }



  connectRealtime() {
    this.wsService.connect(); // tham số không dùng, giữ cho đúng interface

    this.wsService.messages$.subscribe((msg: any) => {

      switch (msg.type) {

        case 'shipper_new_order': {
          this.hoaDons = [msg.payload, ...this.hoaDons];

          this.showToast('Bạn có đơn hàng mới', 'success');
          break;
        }

        case 'update_trang_thai_hoa_don_user': {
          const index = this.hoaDons.findIndex(
            h => h.ma_hd === msg.payload.ma_hoa_don
          );

          if (index !== -1) {
            this.hoaDons[index].trang_thai = msg.payload.trang_thai;
          }
          break;
        }

        case 'cancel_hoa_don_user': {
          const index = this.hoaDons.findIndex(
            h => h.ma_hd === msg.payload.ma_hoa_don
          );

          if (index !== -1) {
            this.hoaDons[index].trang_thai = 'da_huy';
          }
          break;
        }
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
    da_giao_shipper: { label: 'Shipper đã lấy hàng', classes: 'bg-blue-100 text-blue-700' },
    dang_giao: { label: 'Đang giao', classes: 'bg-indigo-100 text-indigo-700' },
    da_giao: { label: 'Đã giao', classes: 'bg-green-100 text-green-700' },
    da_huy: { label: 'Đã hủy', classes: 'bg-red-100 text-red-700' },
  };

  trangThaiThanhToanMap: Record<string, any> = {
    da_thanh_toan: { label: 'Đã thanh toán', classes: 'bg-emerald-100 text-emerald-700' },
    chua_thanh_toan: { label: 'Chưa thanh toán', classes: 'bg-gray-100 text-gray-600' },
  };

  toggleExpand(ma_hd: number) {
    this.expandedHoaDonId =
      this.expandedHoaDonId === ma_hd ? null : ma_hd;
  }



}
