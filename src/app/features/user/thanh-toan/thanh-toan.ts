import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatIcon } from '@angular/material/icon';
import { HttpClient } from '@angular/common/http';
import { MatDialog } from '@angular/material/dialog';
import { ToastMessageComponent } from '../../../Shared/toasts_message/toast-message/toast-message';
import { Phuongthucthanhtoan } from '../../../features/user/dialogs/phuongthucthanhtoan/phuongthucthanhtoan';

@Component({
  selector: 'app-thanh-toan',
  standalone: true,
  imports: [CommonModule, FormsModule, ToastMessageComponent],
  templateUrl: './thanh-toan.html',
  styleUrls: ['./thanh-toan.scss']
})
export class ThanhToan implements OnInit {
  HoaDon: any[] = [];

  toastMessage = '';
  toastType: 'success' | 'warn' | 'error' = 'success';
  showToast = false;

  constructor(private http: HttpClient, private dialog: MatDialog) {}

  /** ✅ Hiển thị Toast message */
  showToastMessage(message: string, type: 'success' | 'warn' | 'error' = 'success') {
    this.toastMessage = message;
    this.toastType = type;
    this.showToast = true;
    setTimeout(() => (this.showToast = false), 4000);
  }

  /** ✅ Lấy danh sách hóa đơn */
  load_listHoaDon() {
    this.http.get<any>('http://localhost:3000/user/ThanhToan/listHoaDon').subscribe({
      next: (res) => {
        if (res && res.HoaDon) {
          this.HoaDon = res.HoaDon;
        } else {
          this.showToastMessage('Không có dữ liệu hóa đơn.', 'warn');
        }
      },
      error: (err) => {
        console.error('Lỗi lấy danh sách hóa đơn:', err);
        this.showToastMessage('Lỗi lấy danh sách hóa đơn', 'error');
      }
    });
  }

  /** ✅ Mở popup chọn phương thức thanh toán */
  openThanhToan(hd: any) {
    const dialogRef = this.dialog.open(Phuongthucthanhtoan, {
      width: '100%',
      maxWidth: '560px',
      panelClass: 'custom-dialog',
      data: hd
    });

    dialogRef.afterClosed().subscribe((thanhToanThanhCong: boolean) => {
      if (thanhToanThanhCong) {
        this.showToastMessage('Thanh toán thành công!', 'success');
        this.load_listHoaDon();
      }
    });
  }

  ngOnInit(): void {
    this.load_listHoaDon();
  }
}
