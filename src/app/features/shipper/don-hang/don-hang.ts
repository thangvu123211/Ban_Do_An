import { Component, OnInit } from '@angular/core';
import { shipperService } from '../../../core/services/shipper.service';
import { MatDialog } from '@angular/material/dialog';
import { WebsocketService } from '../../../core/services/websocket.service';
import { MATERIAL } from '../../../Shared/material';
import { ThongTinDonHang } from '../dialogs/thong-tin-don-hang/thong-tin-don-hang';
import { HoaDonService } from '../../../core/services/HoaDon.Service';

@Component({
  selector: 'app-don-hang',
  imports: [MATERIAL],
  templateUrl: './don-hang.html',
  styleUrl: './don-hang.scss'
})
export class DonHang implements OnInit {

  hoaDons: any[] = [];
  loading = false;

  expandedHoaDonId: number | null = null;

  toast = {
    show: false,
    message: '',
    type: 'success' as 'success' | 'warn' | 'error'
  };

  constructor(
    private shipperService: shipperService,
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
    this.shipperService.getAllHoaDon().subscribe({
      next: (data: any[]) => {
        this.hoaDons = data; // ✅ ĐÚNG
        this.loading = false;
      },
      error: () => {
        this.loading = false;
        this.showToast('Lỗi tải đơn hàng', 'error');
      }
    });
  }
  ThongTinDonHang(hoaDon: any) {
    this.dialog.open(ThongTinDonHang, {
      width: '1000px',
      maxWidth: '95vw',
      height: '85vh',
      data: hoaDon
    });
  }

  connectRealtime() {
    this.wsService.connect(0); // tham số không dùng, giữ cho đúng interface

    this.wsService.messages$.subscribe((msg: any) => {

      switch (msg.type) {

        case 'new_hoa_don':
          if (msg.payload?.ma_hd) {
            this.hoaDons = [msg.payload, ...this.hoaDons];
          }
          break;

        case 'update_trang_thai_hoa_don': {
          const index = this.hoaDons.findIndex(
            h => h.ma_hd === msg.payload.ma_hd
          );
          if (index !== -1) {
            this.hoaDons[index].trang_thai = msg.payload.trang_thai;
          }
          break;
        }

        case 'cancel_hoa_don': {
          const index = this.hoaDons.findIndex(
            h => h.ma_hd === msg.payload.ma_hd
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



  trangThaiMap: Record<string, { label: string; classes: string }> = {
    cho_xac_nhan: {
      label: 'Chờ xác nhận',
      classes: 'bg-yellow-100 text-yellow-700'
    },
    dang_chuan_bi: {
      label: 'Đang chuẩn bị',
      classes: 'bg-blue-100 text-blue-700'
    },
    dang_giao: {
      label: 'Đang giao',
      classes: 'bg-indigo-100 text-indigo-700'
    },
    da_giao: {
      label: 'Đã giao',
      classes: 'bg-green-100 text-green-700'
    },
    da_thanh_toan: {
      label: 'Đã thanh toán',
      classes: 'bg-emerald-100 text-emerald-700'
    },
    da_huy: {
      label: 'Đã hủy',
      classes: 'bg-red-100 text-red-700'
    }
  };

  toggleExpand(ma_hd: number) {
    this.expandedHoaDonId =
      this.expandedHoaDonId === ma_hd ? null : ma_hd;
  }
}
