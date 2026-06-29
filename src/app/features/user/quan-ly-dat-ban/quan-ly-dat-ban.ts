import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { QuanLyDatBanService } from '../../../core/services/QuanLyDatBan.service';
import { QuanLyBanAnService } from '../../../core/services/QuanLyBanAn.service';
import { ChiTietKhachHangDatBan } from '../../admin/khach-hang-dat-ban/chi-tiet-khach-hang-dat-ban/chi-tiet-khach-hang-dat-ban';
import { ConfirmDialogComponent } from '../../../Shared/dialogs/confirm-dialog/confirm-dialog';
import { MATERIAL } from '../../../Shared/material';
import { ToastMessageComponent } from '../../../Shared/toasts_message/toast-message/toast-message';
import { ChiTietDatBan } from './chi-tiet-dat-ban/chi-tiet-dat-ban';
import { WebsocketService } from '../../../core/services/websocket.service';

@Component({
  selector: 'app-quan-ly-dat-ban',
  imports: [MATERIAL, ToastMessageComponent],
  templateUrl: './quan-ly-dat-ban.html',
  styleUrl: './quan-ly-dat-ban.scss'
})
export class QuanLyDatBan implements OnInit {
  danhsachdatban: any[] = [];
  BanAnMap: { [key: number]: string } = {};

  toast = {
    show: false,
    message: '',
    type: 'success' as 'success' | 'warn' | 'error'
  };

  showToast(message: string, type: 'success' | 'warn' | 'error') {
    this.toast.show = true;
    this.toast.message = message;
    this.toast.type = type;
    setTimeout(() => this.toast.show = false, 3000);
  }

  constructor(
    private dialog: MatDialog,
    private quanlidatban: QuanLyDatBanService,
    private quanlibanan: QuanLyBanAnService,
    private wsService: WebsocketService
  ) { }

  ngOnInit(): void {
    this.loadListDatBan();
    this.loadBanAnMap();
    this.connectRealtime()
  }

  connectRealtime() {
    this.wsService.connect();

    this.wsService.messages$.subscribe((msg: any) => {

      console.log("WS MSG:", msg);

      const type = msg?.type || msg?.Type;
      const data = msg?.payload;

      if (!data) return;

      switch (type) {

        case 'dat_ban_confirmed':   // 👈 event backend gửi

          this.danhsachdatban = this.danhsachdatban.map(x =>
            Number(x.id) === Number(data.id)
              ? { ...x, trang_thai: data.trang_thai ?? 'da_xac_nhan' }
              : x
          );
          break;

        case 'dat_ban_cancelled_user':   // 👈 event backend gửi

          this.danhsachdatban = this.danhsachdatban.map(x =>
            Number(x.id) === Number(data.id)
              ? { ...x, trang_thai: data.trang_thai ?? 'da_huy' }
              : x
          );

          // ✅ TOAST thông báo
          this.showToast('Đặt bàn đã được hủy', 'success');

          break;

        case 'dat_ban_cancelled': {

          this.danhsachdatban = this.danhsachdatban.map(x =>
            Number(x.id) === Number(data.id)
              ? { ...x, trang_thai: 'da_huy' }
              : x
          );
          break;
        }
        
      }
    });
  }
  handleNewDatBan(data: any) {

    const newItem = {
      id: data.id,
      ma_ban_an: data.ma_ban_an,
      ten_khach_hang: data.ten_khach_hang,
      sdt: data.sdt,
      email: data.email,
      ghi_chu: data.ghi_chu,
      ngay: data.ngay,
      gio: data.gio,
      trang_thai: data.trang_thai,
      ma_nguoi_dung: data.ma_nguoi_dung
    };

    // 🔥 giống HoaDon: unshift + spread để trigger UI
    this.danhsachdatban = [newItem, ...this.danhsachdatban];
  }

  loadListDatBan() {
    this.quanlidatban.LayDanhSachDatBanCuaNguoiDung().subscribe({
      next: (res) => {
        this.danhsachdatban = res.data || res;
      },
      error: (err) => {
        console.error('Lỗi load đặt bàn', err);
      }
    });
  }

  hienThiTrangThai(trangThai: string): string {
    switch (trangThai) {
      case 'dang_xu_ly':
        return 'Đang chờ xử lý';
      case 'da_xac_nhan':
        return 'Đã xác nhận';
      case 'da_huy':
        return 'Đã hủy';
      default:
        return 'Không xác định';
    }
  }

  loadBanAnMap() {
    this.quanlibanan.LayTatCaBanAn().subscribe((res: any) => {
      if (Array.isArray(res.data)) {
        res.data.forEach((item: any) => {
          this.BanAnMap[item.ma_ban] = item.ten_ban;
        });
      }
    });
  }

  xemChiTiet(datBan: any): void {
    const dialogRef = this.dialog.open(ChiTietDatBan, {
      width: '600px',
      maxWidth: '95vw',
      panelClass: 'custom-dialog',
      data: datBan
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loadListDatBan(); // reload lại danh sách
      }
    });
  }



  openDialogHuy(id: number) {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '400px',
      data: { message: 'Bạn có chắc chắn muốn hủy đặt bàn này?' }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.quanlidatban.HuyDatBan(id).subscribe({
          next: () => {
            this.showToast('Hủy đặt bàn thành công', 'success');
            this.loadListDatBan();
          },
          error: (err) => {
            const msg = err?.error?.error || 'Hủy đặt bàn không thành công';
            this.showToast(msg, 'error');
          }
        });
      }
    });
  }

  ngOnDestroy() {
    this.wsService.disconnect();
  }
}