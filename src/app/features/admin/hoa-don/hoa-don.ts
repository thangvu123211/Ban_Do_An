import { HttpClient } from '@angular/common/http';
import { Component, OnInit, Pipe, PipeTransform } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MATERIAL } from '../../../Shared/material';
import { HoaDonService } from '../../../core/services/HoaDon.Service';
import { ToastMessageComponent } from '../../../Shared/toasts_message/toast-message/toast-message';
import { SuaHoaDon } from './sua-hoa-don/sua-hoa-don';
import { WebsocketService } from '../../../core/services/websocket.service';
import { ThongTinHoaDon } from './thong-tin-hoa-don/thong-tin-hoa-don';

@Component({
  selector: 'app-hoa-don',
  standalone: true, // dùng standalone
  imports: [MATERIAL, ToastMessageComponent], // thêm FormsModule để binding input
  templateUrl: './hoa-don.html',
  styleUrls: ['./hoa-don.scss']
})
export class HoaDon implements OnInit {

  trangDangChon: 'ALL' | 'CHO_XAC_NHAN' | 'CHUA_THANH_TOAN' | 'DA_HUY' | 'DANG_XU_LY' = 'CHO_XAC_NHAN';

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

  chonTrang(trang: any) {
    this.trangDangChon = trang;

    if (trang === 'ALL') {
      this.LoadAllHoaDon();
    } else {
      this.loadHoaDonTheoNgay();
    }
  }

  ngOnInit(): void {
    this.loadHoaDonTheoNgay();
    this.connectRealtime();
  }

  
  loadHoaDonTheoNgay() {
    this.loading = true;
    this.hoaDonService.getALLHoaDontheoNgay().subscribe({
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
  LoadAllHoaDon() {
    this.loading = true;
    this.hoaDonService.getAllHoaDon().subscribe({
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

        case 'new_hoa_don':
          this.hoaDons = [msg.payload, ...this.hoaDons];
          this.showToast('Có đơn hàng mới', 'success');
          break;

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
        case 'admin_assign_shipper': {
          const index = this.hoaDons.findIndex(
            h => h.ma_hd === msg.payload.ma_hd
          );

          if (index !== -1) {
            // 🔥 cập nhật toàn bộ hóa đơn
            this.hoaDons[index] = {
              ...this.hoaDons[index],
              ...msg.payload
            };

            // ép Angular render
            this.hoaDons = [...this.hoaDons];

            this.showToast('Đã phân công shipper', 'success');
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
        this.loadHoaDonTheoNgay();
      } else if (result === false) {
        this.showToast('Bạn đã hủy sửa đơn hàng', 'warn');
      }
    });
  }

  trangThaiDonHangMap: Record<string, any> = {
    cho_xac_nhan: { label: 'Chờ xác nhận', classes: 'bg-yellow-100 text-yellow-700' },
    da_xac_nhan: { label: 'Đã xác nhận', classes: 'bg-blue-100 text-blue-700' },
    dang_giao: { label: 'Đang giao', classes: 'bg-indigo-100 text-indigo-700' },
    da_giao: { label: 'Đã giao', classes: 'bg-green-100 text-green-700' },
    da_giao_shipper: { label: 'Shipper đã lấy hàng', classes: 'bg-green-100 text-green-700' },
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

  ThongTinHoaDon(hoaDon: any) {
    this.dialog.open(ThongTinHoaDon, {
      width: '1000px',
      maxWidth: '95vw',
      height: '85vh',
      data: hoaDon
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

      case 'DANG_XU_LY':
        return this.hoaDons.filter(
          x =>
            ['da_xac_nhan', 'dang_giao', 'da_giao','da_giao_shipper'].includes(x.trang_thai)
        );

      default:
        return this.hoaDons;
    }
  }

}

