import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { ConfirmDialogComponent } from '../../../Shared/dialogs/confirm-dialog/confirm-dialog';
import { MATERIAL } from '../../../Shared/material';
import { ToastMessageComponent } from '../../../Shared/toasts_message/toast-message/toast-message';
import { QuanLyDatBanService } from '../../../core/services/QuanLyDatBan.service';
import { ChiTietKhachHangDatBan } from './chi-tiet-khach-hang-dat-ban/chi-tiet-khach-hang-dat-ban';
import { QuanLyBanAnService } from '../../../core/services/QuanLyBanAn.service';
import { QuanLyNhanVienService } from '../../../core/services/QuanLyNhanVien.service';

@Component({
  selector: 'app-khach-hang-dat-ban',
  standalone: true,
  imports: [MATERIAL, ToastMessageComponent],
  templateUrl: './khach-hang-dat-ban.html',
  styleUrls: ['./khach-hang-dat-ban.scss']
})
export class KhachHangDatBan implements OnInit {
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
  ) { }

  ngOnInit(): void {
    this.loadListDatBan();
    this.loadBanAnMap();
  }

  loadListDatBan() {
    this.quanlidatban.LayDanhSachDatBan().subscribe({
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
    const dialogRef = this.dialog.open(ChiTietKhachHangDatBan, {
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



  openDialogXoa(id: number) {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '400px',
      data: { message: 'Bạn có chắc muốn xóa đặt bàn này?' }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.showToast('Xóa đặt bàn thành công', 'success');
        this.quanlidatban.XoaDatBan(id).subscribe({

          next: () => this.loadListDatBan(),
          error: (err) => {
            this.showToast('Xóa đặt bàn không thành công', 'error');
          }
        });
      }
    });
  }
}
