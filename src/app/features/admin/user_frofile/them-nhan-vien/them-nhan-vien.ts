
import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { QuanLyNhanVienService } from '../../../../core/services/QuanLyNhanVien.service';
import { MATERIAL } from '../../../../Shared/material';
import { ToastMessageComponent } from '../../../../Shared/toasts_message/toast-message/toast-message';

@Component({
  selector: 'app-them-nhan-vien',
  standalone: true,
  imports: [
    MATERIAL,
    ToastMessageComponent
  ],
  templateUrl: './them-nhan-vien.html',
  styleUrls: ['./them-nhan-vien.scss'],
})
export class ThemNhanVien implements OnInit {
  today = new Date();
  maxNgaySinh!: Date;
  // ✅ Đặt tên class khác với tên biến để tránh xung đột
  NhanVien: any = {
    ho_ten: '',
    email: '',
    mat_khau: '',
    gioi_tinh: 'Nam',
    dia_chi: '',
    ngay_sinh: null,
    loai_nguoi_dung: 'user',
    trang_thai: 'hoat_dong',
    sdt: ''
  };
  loading = false;

  toast = {
    show: false,
    message: '',
    type: 'success' as 'success' | 'warn' | 'error'
  };

  selectedFile: File | null = null;
  previewUrl: string | null = null;

  constructor(
    private dialogRef: MatDialogRef<ThemNhanVien>,
    private QuanLyNhanVienService: QuanLyNhanVienService,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) { }

  showToast(message: string, type: 'success' | 'warn' | 'error') {
    this.toast.show = true;
    this.toast.message = message;
    this.toast.type = type;
    setTimeout(() => this.toast.show = false, 3000);
  }

  ngOnInit(): void {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    today.setDate(today.getDate() - 1);

    this.maxNgaySinh = today;
  }

  // ✅ Mở chọn file ảnh
  chonAnh(input: HTMLInputElement) {
    input.click();
  }

  // ✅ Khi chọn file
  onFileSelected(event: any) {
    this.selectedFile = event.target.files[0];
    if (this.selectedFile) {
      const reader = new FileReader();
      reader.onload = (e) => (this.previewUrl = e.target?.result as string);
      reader.readAsDataURL(this.selectedFile);
    }
  }

  // ✅ Gửi form thêm nhân viên
  addNhanVien() {
    // Check ngày sinh
    if (this.NhanVien.ngay_sinh && new Date(this.NhanVien.ngay_sinh) >= new Date()) {
      this.showToast('Ngày sinh phải nhỏ hơn ngày hiện tại', 'error');
      return;
    }

    this.loading = true;

    const formData = new FormData();

    Object.entries(this.NhanVien).forEach(([key, value]) => {
      if (value !== null && value !== undefined) {

        // 🔥 CHUYỂN NGÀY
        if (key === 'ngay_sinh' && value instanceof Date) {
          const formattedDate =
            value.toISOString().split('T')[0]; // YYYY-MM-DD
          formData.append(key, formattedDate);
        } else {
          formData.append(key, value as string);
        }
      }
    });

    if (this.selectedFile) {
      formData.append('image', this.selectedFile);
    }

    this.QuanLyNhanVienService.ThemNhanVien(formData).subscribe({
      next: () => {
        this.loading = false;
        this.showToast('Thêm nhân viên thành công', 'success');
        this.dialogRef.close(true);
      },
      error: (err) => {
        this.loading = false;
        this.showToast(err?.error?.error || 'Thêm thất bại', 'error');
      }
    });
  }

  close() {
    this.dialogRef.close(false);
  }
}
