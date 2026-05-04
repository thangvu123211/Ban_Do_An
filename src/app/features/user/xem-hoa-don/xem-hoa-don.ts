import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatIcon } from '@angular/material/icon';
import { ToastMessageComponent } from '../../../Shared/toasts_message/toast-message/toast-message';
import { ConfirmDialogComponent } from '../../../Shared/dialogs/confirm-dialog/confirm-dialog';

@Component({
  selector: 'app-xem-hoa-don',
  standalone: true,
  imports: [CommonModule, MatIcon, FormsModule, ToastMessageComponent],
  templateUrl: './xem-hoa-don.html',
  styleUrls: ['./xem-hoa-don.scss']
})
export class XemHoaDon implements OnInit {
  HoaDon: any[] = [];
  chiTietHoaDon: any[] = [];
  selectedIndex: number | null = null;
  tongTienCT: number = 0;
  MonAn: any[] = [];

  // 🔔 Toast thông báo
  toastMessage = '';
  toastType: 'success' | 'warn' | 'error' = 'success';
  showToast = false;

  constructor(private http: HttpClient, private dialog: MatDialog) { }

  // ✅ Toast helper
  showToastMessage(message: string, type: 'success' | 'warn' | 'error' = 'success') {
    this.toastMessage = message;
    this.toastType = type;
    this.showToast = true;
    setTimeout(() => (this.showToast = false), 4000);
  }

  // ✅ Load danh sách hóa đơn
  load_listHoaDon() {
    this.http.get<any>('http://localhost:3000/api/user/listHoaDon').subscribe({
      next: (res) => {
        this.HoaDon = res.HoaDon;
      },
      error: () => this.showToastMessage('Lỗi lấy danh sách hóa đơn', 'error')
    });
  }

  // ✅ Load danh sách món ăn
  load_listMonAn() {
    this.http.get<any>('http://localhost:3000/api/user/DanhSachMonAn').subscribe({
      next: (res) => (this.MonAn = res.MonAn),
      error: () => this.showToastMessage('Lỗi lấy danh sách món ăn', 'error')
    });
  }

  // ✅ Xem chi tiết hóa đơn
  toggleChiTiet(index: number, mahd: number) {
    if (this.selectedIndex === index) {
      this.selectedIndex = null;
      this.chiTietHoaDon = [];
      this.tongTienCT = 0;
      return;
    }

    this.selectedIndex = index;
    this.http.get<any[]>(`http://localhost:3000/api/user/chitiethoadon/${mahd}`).subscribe({
      next: (data) => {
        this.chiTietHoaDon = data.map((ct) => {
          const mon = this.MonAn.find((m) => Number(m.MA_MON_AN) === Number(ct.MA_MON_AN));
          return {
            ...ct,
            TEN_MON: mon ? mon.TEN_MON : 'Không xác định',
            DON_GIA: mon ? mon.GIA : ct.DON_GIA,
            showEdit: false
          };
        });
        this.tinhTongTien();
      },
      error: () => this.showToastMessage('Lỗi khi tải chi tiết hóa đơn', 'error')
    });
  }

  // ✅ Khi thay đổi món ăn trong chi tiết
  onMonAnChange(ct: any) {
    const mon = this.MonAn.find((m) => Number(m.MA_MON_AN) === Number(ct.MA_MON_AN));
    if (mon) {
      ct.DON_GIA = parseFloat(mon.GIA);
      ct.TEN_MON = mon.TEN_MON;
      ct.THANH_TIEN = ct.SO_LUONG * ct.DON_GIA;
      this.tinhTongTien();
    } else {
      this.showToastMessage(`Không tìm thấy món có mã ${ct.MA_MON_AN}`, 'warn');
    }
  }

  // ✅ Tính tổng tiền chi tiết hóa đơn
  tinhTongTien() {
    this.tongTienCT = this.chiTietHoaDon.reduce((sum, item) => sum + Number(item.THANH_TIEN || 0), 0);
  }

  // ✅ Cho phép chỉnh sửa chi tiết
  toggleEdit(ct: any) {
    ct.showEdit = true;
    ct.oldData = { ...ct };
  }

  // ✅ Lưu thay đổi chi tiết hóa đơn
  saveCTHD(ct: any) {
    const payload = { MA_MON_AN: ct.MA_MON_AN, SO_LUONG: ct.SO_LUONG };
    this.http.put(`http://localhost:3000/api/user/updateCTHD/${ct.MA_CT}`, payload).subscribe({
      next: (res: any) => {
        ct.DON_GIA = res.DON_GIA;
        ct.THANH_TIEN = res.THANH_TIEN;
        ct.showEdit = false;
        this.tongTienCT = res.TONG_TIEN;
        this.load_listHoaDon();
        this.showToastMessage('Cập nhật chi tiết thành công', 'success');
      },
      error: () => this.showToastMessage('Cập nhật thất bại', 'error')
    });
  }

  // ✅ HỦY chỉnh sửa
  cancelEdit(ct: any) {
    Object.assign(ct, ct.oldData);
    ct.showEdit = false;
    this.tinhTongTien();
    this.showToastMessage('Đã hủy chỉnh sửa', 'warn');
  }

  // ✅ XÁC NHẬN hóa đơn (CÓ LƯU NHÂN VIÊN XÁC NHẬN)
  xacNhanHoaDon(mahd: number) {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '360px',
      data: { message: 'Bạn có chắc muốn xác nhận hóa đơn này không?' }
    });

    dialogRef.afterClosed().subscribe((confirmed) => {
      if (!confirmed) return;

      const user = JSON.parse(localStorage.getItem('user') || '{}');
      console.log('🔍 user localStorage:', user); // debug
      const manv = user?.id; // ✅ dùng id thay vì MANV

      if (!manv) {
        this.showToastMessage('Không xác định được nhân viên xác nhận!', 'error');
        return;
      }

      this.http.put(`http://localhost:3000/api/user/xacNhanHoaDon/${mahd}`, { manv })
        .subscribe({
          next: (res: any) => {
            const hoaDon = this.HoaDon.find(h => h.MA_HD === mahd);
            if (hoaDon) {
              hoaDon.TRANGTHAI = 1;
              hoaDon.MA_NV = manv;
            }

            this.showToastMessage(
              `Hóa đơn #${mahd} được xác nhận bởi ${user.hoten}`,
              'success'
            );
          },
          error: (err) => {
            console.error('Lỗi xác nhận hóa đơn:', err);
            this.showToastMessage('Lỗi xác nhận hóa đơn', 'error');
          }
        });
    });
  }



  // ✅ HỦY hóa đơn
  huyHoaDon(hd: any) {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: { message: `Bạn có chắc muốn hủy hóa đơn ${hd.MA_HD}?` }
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.http.put(`http://localhost:3000/api/user/HuyHoaDon/${hd.MA_HD}`, {}).subscribe({
          next: () => {
            this.showToastMessage('Hủy hóa đơn thành công', 'warn');
            hd.TRANGTHAI = 2;
          },
          error: () => this.showToastMessage('Lỗi khi hủy hóa đơn', 'error')
        });
      }
    });
  }

  ngOnInit(): void {
    this.load_listHoaDon();
    this.load_listMonAn();

    // // 🔔 Nếu cần, cũng nghe khi khách hàng được báo xác nhận
    // this.socketService.onOrderConfirmed((data) => {
    //   this.showToastMessage(`Hóa đơn #${data.mahd} đã được xác nhận!`, 'success');
    // });
  }
}
