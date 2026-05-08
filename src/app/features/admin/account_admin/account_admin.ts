import { Component, OnInit } from '@angular/core';
import { AdminService } from '../../../core/services/admin.service';
import { ToastMessageComponent } from '../../../Shared/toasts_message/toast-message/toast-message';
import { MatDialog } from '@angular/material/dialog';
import { DoiMatKhau } from './doi-mat-khau/doi-mat-khau';
import { MATERIAL } from '../../../Shared/material';

@Component({
  selector: 'app-account',
  standalone: true,
  imports: [ToastMessageComponent,MATERIAL],
  templateUrl: './account_admin.html',
  styleUrls: ['./account_admin.scss']
})
export class Account_admincomponent implements OnInit {
  admin: any = null;
  selectedFile?: File;
  previewUrl: string = 'assets/user.jpg';

  toast = {
    show: false,
    message: '',
    type: 'success' as 'success' | 'warn' | 'error'
  };

  constructor(
    private adminService: AdminService,
    private doimatkhau: MatDialog
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
        this.previewUrl = this.admin?.anh_nhan_vien?.length
          ? this.admin.anh_nhan_vien[0].url
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
    if (file) {
      this.selectedFile = file;
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.previewUrl = e.target.result;
      };
      reader.readAsDataURL(file);
    }
  }

  /** ✅ Cập nhật thông tin admin */
  capNhatAdmin() {
    if (!this.admin) {
      this.showToast('Không tìm thấy thông tin nhân viên.', 'error');
      return;
    }

    // 🔹 Tạo object mới chứa tất cả field cần giữ hoặc update
    const updatedAdmin: any = {
      ho_ten: this.admin.ho_ten,
      email: this.admin.email,
      loai_nhan_vien: this.admin.loai_nhan_vien, // ✅ phải giữ loại nhân viên
      gioi_tinh: this.admin.gioi_tinh,
      ngay_sinh: this.admin.ngay_sinh,
      dia_chi: this.admin.dia_chi,
    };

    // 🔹 Nếu người dùng nhập mật khẩu mới thì thêm vào object
    if (this.admin.mat_khau_moi) {
      if (this.admin.mat_khau_moi !== this.admin.xac_nhan_mat_khau_moi) {
        this.showToast('Mật khẩu xác nhận không khớp!', 'error');
        return;
      }
      updatedAdmin.mat_khau = this.admin.mat_khau_moi;
    }

    this.adminService.CapNhatNhanVien(this.admin.ma_nv, updatedAdmin, this.selectedFile)
      .subscribe({
        next: (res) => {
          this.showToast('Cập nhật thành công!', 'success');
          this.loadAdmin();
          this.selectedFile = undefined;

          const fileInput = document.getElementById('fileInput') as HTMLInputElement;
          if (fileInput) fileInput.value = '';
        },
        error: (err) => {
          console.error('Lỗi khi cập nhật:', err);
          this.showToast('Cập nhật thất bại!', 'error');
        }
      });
  }


  /** 🔑 Mở dialog đổi mật khẩu */
  DoiMatKhau() {
    if (!this.admin?.ma_nv) {
      this.showToast('Không tìm thấy ID nhân viên', 'error');
      return;
    }

    const dialogRef = this.doimatkhau.open(DoiMatKhau, {
      width: '500px',
      maxWidth: '110vw',
      panelClass: 'custom-dialog',
      data: { ma_nv: this.admin.ma_nv }  // ✅ truyền ID nhân viên
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
