import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialog } from '@angular/material/dialog';
import { MATERIAL } from '../../../../Shared/material';
import { ToastMessageComponent } from '../../../../Shared/toasts_message/toast-message/toast-message';
import { PhongToAnh } from '../../../../Shared/phong_to_anh/phong-to-anh';
import { AuthService } from '../../../../core/services/auth.service';
import { FormsModule } from '@angular/forms';



@Component({
  selector: 'app-booking-dialog',
  standalone: true,
  imports: [MATERIAL, ToastMessageComponent, FormsModule],
  templateUrl: './booking-dialog.html',
  styleUrls: ['./booking-dialog.scss']
})
export class BookingDialog {
  TENKHACHHANG: string = '';
  SDT: string = '';
  GHICHU: string = '';
  EMAIL: string = '';

  // state toast
  toast = {
    show: false,
    message: '',
    type: 'success' as 'success' | 'warn' | 'error'
  };

  

  constructor(
    public dialogRef: MatDialogRef<BookingDialog>,
    private dialog: MatDialog,
    private authService: AuthService,
    @Inject(MAT_DIALOG_DATA) public data: {
      ngay: Date | null;
      gio: number | null;
      table: any;
    }
  ) {
    this.autoFillUserInfo();
  }



  showToast(message: string, type: 'success' | 'warn' | 'error') {
    this.toast.show = true;
    this.toast.message = message;
    this.toast.type = type;
    setTimeout(() => this.toast.show = false, 3000);
  }

  autoFillUserInfo() {
    const user = this.authService.getUser();

    if (!user) return;

    this.TENKHACHHANG ||= user.ho_ten || '';
    this.SDT ||= user.sdt || '';
    this.EMAIL ||= user.email || '';
  }



  confirm(): void {
    if (!this.TENKHACHHANG || !this.SDT || !this.EMAIL) {
      this.showToast('Vui lòng nhập đầy đủ thông tin khách hàng!', 'error');
      return;
    }

    if (!this.TENKHACHHANG || !this.SDT || !this.EMAIL) {
      this.showToast('Vui lòng nhập đầy đủ thông tin khách hàng!', 'error');
      return;
    }

    // ===== Validate SĐT =====
    const phoneRegex = /^0\d{9}$/;
    if (!phoneRegex.test(this.SDT)) {
      this.showToast('Số điện thoại phải gồm 10 số và bắt đầu bằng 0', 'error');
      return;
    }

    // ===== Validate Email =====
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(this.EMAIL)) {
      this.showToast('Email không đúng định dạng', 'error');
      return;
    }



    const bookingInfo = {
      ten_khach_hang: this.TENKHACHHANG,
      sdt: this.SDT,
      email: this.EMAIL,
      ghi_chu: this.GHICHU,
      ma_ban_an: this.data.table?.ma_ban,
      ngay: this.data.ngay
        ? `${this.data.ngay.getFullYear()}-${(this.data.ngay.getMonth() + 1)
          .toString().padStart(2, '0')}-${this.data.ngay.getDate()
            .toString().padStart(2, '0')}`
        : null,
      gio: this.data.gio !== null ? `${this.data.gio}:00` : null
    };

    this.dialogRef.close(bookingInfo);
  }


  // Mở modal ảnh
  openImageModal(url: string) {
    this.dialog.open(PhongToAnh, {
      data: { imageUrl: url },
      panelClass: 'custom-dialog',
      maxWidth: '90vw',
      maxHeight: '90vh'
    });
  }

  close(): void {
    this.dialogRef.close();
  }
}
