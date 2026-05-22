import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MATERIAL } from '../../../Shared/material';
import { HoaDonService } from '../../../core/services/HoaDon.Service';
import { ToastMessageComponent } from '../../../Shared/toasts_message/toast-message/toast-message';
import { SuaHoaDon } from './sua-hoa-don/sua-hoa-don';
import { WebsocketService } from '../../../core/services/websocket.service';

@Component({
  selector: 'app-hoa-don',
  standalone: true, // dùng standalone
  imports: [MATERIAL, ToastMessageComponent], // thêm FormsModule để binding input
  templateUrl: './hoa-don.html',
  styleUrls: ['./hoa-don.scss']
})
export class HoaDon implements OnInit {

  hoaDons: any[] = [];
  loading = false;

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
    this.hoaDonService.getAllHoaDon().subscribe({
      next: (res: any) => {
        this.hoaDons = res; // backend trả { data: [...] }
        this.loading = false;

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

        case 'new_hoa_don':
          this.hoaDons = [msg.payload, ...this.hoaDons];
          this.showToast('Có đơn hàng mới', 'success');
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

  SuaDonHang(donHang: any) {
    const dialogRef = this.dialog.open(SuaHoaDon, {
      width: '900px',
      maxWidth: '110vw',
      data: donHang,
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result === true) {
        this.showToast('Cập nhật đơn hàng thành công', 'success');
        this.loadHoaDons();
      } else if (result === false) {
        this.showToast('Bạn đã hủy sửa đơn hàng', 'warn');
      }
    });
  }

  trangThaiMap: Record<string, { label: string; classes: string }> = {
    cho_xac_nhan: {
      label: 'Chờ xác nhận',
      classes: 'bg-yellow-100 text-yellow-700'
    },
    da_xac_nhan: {
      label: 'Đã xác nhận',
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

  // ThongTinDonHang(hoaDon: any) {
  //   this.dialog.open(ThongTinDonHang, {
  //     width: '1000px',
  //     maxWidth: '95vw',
  //     height: '85vh',
  //     data: hoaDon
  //   });
  // }

  // huyHoaDon(id: number) {
  //   if (!confirm('Bạn có chắc muốn hủy hóa đơn này?')) return;

  //   this.hoaDonService.huyHoaDon(id).subscribe(() => {
  //     this.loadHoaDons();
  //   });
  // }

}
