import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { AdminService } from '../../../../core/services/admin.service';
import { MATERIAL } from '../../../../Shared/material';

@Component({
  selector: 'app-doi-mat-khau',
  imports: [
    MATERIAL
  ],
  templateUrl: './doi-mat-khau.html',
  styleUrls: ['./doi-mat-khau.scss']
})
export class DoiMatKhau implements OnInit {
  isLoading = false;
  admin: any = {}; // 🔹 không để null, để object rỗng an toàn
  toast = {
    show: false,
    message: '',
    type: 'success' as 'success' | 'warn' | 'error'
  };

  error: string = '';

  constructor(
    private dialogRef: MatDialogRef<DoiMatKhau>,
    private adminService: AdminService,
    @Inject(MAT_DIALOG_DATA) public data: { ma_nguoi_dung: number }
  ) { }

  ngOnInit(): void {
    // 🔹 Lấy thông tin nhân viên theo ID truyền vào
    this.adminService.Laythongtinadmin(this.data.ma_nguoi_dung).subscribe({
      next: (res) => {
        this.admin = res.data ?? res;
      },
      error: (err) => {
        console.error('Lỗi khi tải thông tin nhân viên:', err);
        this.showToast('Không thể tải thông tin nhân viên.', 'error');
      }
    });
  }

  validate(): boolean {
    this.error = '';

    const password = this.admin?.mat_khau_moi?.trim();

    if (!password) {
      this.error = 'Vui lòng nhập mật khẩu mới';
      return false;
    }

    if (password.length < 6) {
      this.error = 'Mật khẩu phải có ít nhất 6 ký tự';
      return false;
    }

    if (password.length > 32) {
      this.error = 'Mật khẩu không được vượt quá 32 ký tự';
      return false;
    }

    // ❗ OPTIONAL – nếu muốn mạnh hơn
    /*
    const strongRegex = /^(?=.*[A-Za-z])(?=.*\d).+$/;
    if (!strongRegex.test(password)) {
      this.error = 'Mật khẩu phải gồm chữ và số';
      return false;
    }
    */

    return true;
  }

  showToast(message: string, type: 'success' | 'warn' | 'error') {
    this.toast.show = true;
    this.toast.message = message;
    this.toast.type = type;
    setTimeout(() => (this.toast.show = false), 3000);
  }

  doiMatKhau() {

    if (!this.validate()) {
      return;
    }

    this.isLoading = true;

    const updatedData: any = {
      mat_khau: this.admin.mat_khau_moi
    };

    this.adminService.CapNhatNhanVien(
      this.admin.ma_nguoi_dung,
      updatedData
    ).subscribe({
      next: () => {
        this.isLoading = false;

        this.showToast('Đổi mật khẩu thành công!', 'success');

        setTimeout(() => {
          this.dialogRef.close(true);
        }, 500);
      },
      error: (err) => {
        this.isLoading = false;

        console.error(err);
        this.showToast(
          err.error?.error || 'Đổi mật khẩu thất bại!',
          'error'
        );
      }
    });
  }


  close() {
    this.dialogRef.close(false);
  }
}
