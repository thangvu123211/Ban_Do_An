import { Component, OnInit } from '@angular/core';
import { AdminService } from '../../../core/services/admin.service';
import { ToastMessageComponent } from '../../../Shared/toasts_message/toast-message/toast-message';
import { MatDialog } from '@angular/material/dialog';
import { DoiMatKhau } from './doi-mat-khau/doi-mat-khau';
import { MATERIAL } from '../../../Shared/material';
import { UserService } from '../../../core/services/user.service';
import { QuanLyNhanVienService } from '../../../core/services/QuanLyNhanVien.service';

@Component({
  selector: 'app-account',
  standalone: true,
  imports: [ToastMessageComponent, MATERIAL],
  templateUrl: './account_admin.html',
  styleUrls: ['./account_admin.scss']
})
export class Account_admincomponent implements OnInit {
  admin: any = null;
  selectedFile?: File;
  previewUrl: string = 'assets/user.jpg';
  isLoading = false;
  isUploading = false;
  toast = {
    show: false,
    message: '',
    type: 'success' as 'success' | 'warn' | 'error'
  };

  Anhnguoidung: string = 'assets/user.jpg';

  maxNgaySinh!: Date;

  constructor(
    private adminService: AdminService,
    private doimatkhau: MatDialog,
    private userService: QuanLyNhanVienService
  ) { }

  ngOnInit(): void {
    this.loadAdmin();
  }

  showToast(message: string, type: 'success' | 'warn' | 'error') {
    this.toast.show = true;
    this.toast.message = message;
    this.toast.type = type;
    setTimeout(() => (this.toast.show = false), 3000);
  }

  /** ✅ Lấy thông tin admin bằng ID từ token JWT */
  loadAdmin() {
    const token = localStorage.getItem('token');
    const payload = token ? JSON.parse(atob(token.split('.')[1])) : null;
    const userId = payload?.id; // ID của admin trong token

    if (!userId) {
      console.error('Không tìm thấy ID trong token');
      this.showToast('Không tìm thấy thông tin người dùng!', 'error');
      return;
    }

    this.adminService.Laythongtinadmin(userId).subscribe({
      next: (res) => {
        this.admin = res.data ?? res;
        this.previewUrl = this.admin?.anh_nguoi_dung?.length
          ? this.admin.anh_nguoi_dung[0].url
          : 'assets/user.jpg';

        // ✅ Cập nhật cho các component khác (Navbar, v.v.)
        this.adminService.setAdminInfo(this.admin);
      },
      error: (err) => console.error('Lỗi khi lấy thông tin admin:', err)
    });
  }

  /** 🖼️ Chọn ảnh mới */
  onFileSelected(event: any) {
  const file = event.target.files[0];
  if (!file) return;

  this.selectedFile = file;

  const reader = new FileReader();
  reader.onload = () => {
    this.previewUrl = reader.result as string; // ✅ đúng biến HTML đang dùng
  };
  reader.readAsDataURL(file);
}

  formatDateToYMD(date: any): string {
    if (!date) return '';

    const d = new Date(date);
    const year = d.getFullYear();
    const month = ('0' + (d.getMonth() + 1)).slice(-2);
    const day = ('0' + d.getDate()).slice(-2);

    return `${year}-${month}-${day}`;
  }

  /** ✅ Cập nhật thông tin admin */
  capNhatAdmin() {
    const ma = Number(localStorage.getItem('ma_nguoi_dung'));
    const formData = new FormData();

    formData.append('ho_ten', this.admin.ho_ten || '');
    formData.append('email', this.admin.email || '');
    formData.append('sdt', this.admin.sdt || '');
    formData.append(
      'ngay_sinh',
      this.formatDateToYMD(this.admin.ngay_sinh)
    );

    this.userService.updateThongTinCaNhanUserShipper(formData).subscribe({
      next: (res) => {
        this.showToast(res.message || 'Cập nhật thành công', 'success');
        this.loadAdmin(); // load lại từ /me
      },
      error: (err) => {
        this.showToast(
          err?.error?.error || 'Cập nhật thất bại',
          'error'
        );
      }
    });
  }

  validateAdmin(): boolean {
    if (!this.admin) {
      this.showToast('Không có dữ liệu admin', 'error');
      return false;
    }

    // ===== HỌ TÊN =====
    if (!this.admin.ho_ten || this.admin.ho_ten.trim() === '') {
      this.showToast('Họ tên không được để trống', 'warn');
      return false;
    }

    if (this.admin.ho_ten.trim().length < 3) {
      this.showToast('Họ tên phải có ít nhất 3 ký tự', 'warn');
      return false;
    }

    // ===== EMAIL =====
    if (!this.admin.email || this.admin.email.trim() === '') {
      this.showToast('Email không được để trống', 'warn');
      return false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(this.admin.email)) {
      this.showToast('Email không đúng định dạng', 'warn');
      return false;
    }


    return true;
  }

  uploadAvatar() {
  if (!this.selectedFile) return;

  const ma = Number(localStorage.getItem('ma_nguoi_dung'));

  const formData = new FormData();
  formData.append('image', this.selectedFile);

  this.isUploading = true;

  this.userService.doiAnhDaiDien(ma, formData).subscribe({
    next: (res: any) => {
      this.showToast(res.message || 'Cập nhật ảnh thành công', 'success');

      // ✅ cập nhật avatar ngay
      this.previewUrl =
        res.data?.anh_nhan_vien?.[0]?.url || this.previewUrl;

      this.selectedFile = undefined;
      this.isUploading = false;
    },
    error: (err) => {
      this.showToast(
        err?.error?.error || 'Upload ảnh thất bại',
        'error'
      );
      this.isUploading = false;
    }
  });
}


  /** 🔑 Mở dialog đổi mật khẩu */
  DoiMatKhau() {
    if (!this.admin?.ma_nguoi_dung) {
      this.showToast('Không tìm thấy ID nhân viên', 'error');
      return;
    }

    const dialogRef = this.doimatkhau.open(DoiMatKhau, {
      width: '500px',
      maxWidth: '110vw',
      panelClass: 'custom-dialog',
      data: { ma_nguoi_dung: this.admin.ma_nguoi_dung }  // ✅ truyền ID nhân viên
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.showToast('Đổi mật khẩu thành công', 'success');
      } else {
        this.showToast('Bạn đã hủy đổi mật khẩu', 'warn');
      }
    });
  }

}
