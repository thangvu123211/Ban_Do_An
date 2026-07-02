
import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { QuanLyNhanVienService } from '../../../../core/services/QuanLyNhanVien.service';
import { MATERIAL } from '../../../../Shared/material';
import { ToastMessageComponent } from '../../../../Shared/toasts_message/toast-message/toast-message';

@Component({
  selector: 'app-sua-nhan-vien',
  imports: [
    MATERIAL,
    ToastMessageComponent
  ],
  templateUrl: './sua-nhan-vien.html',
  styleUrl: './sua-nhan-vien.scss'
})
export class SuaNhanVien implements OnInit {

  NhanVien: any = {};
  selectedFile?: File;
  previewImage: string | ArrayBuffer | null = null;
  maxNgaySinh!: Date;
  loading = false;
  toast = {
    show: false,
    message: '',
    type: 'success' as 'success' | 'warn' | 'error'
  };

  constructor(
    private dialogRef: MatDialogRef<SuaNhanVien>,
    private QuanLyNhanVienService: QuanLyNhanVienService,
    @Inject(MAT_DIALOG_DATA) public data: {
      ma_nguoi_dung: number
    }
  ) { }

  showToast(message: string, type: 'success' | 'warn' | 'error') {
    this.toast.show = true;
    this.toast.message = message;
    this.toast.type = type;
    setTimeout(() => this.toast.show = false, 3000);
  }


  ngOnInit() {
    if (this.data.ma_nguoi_dung) {
      this.loadNhanVienById(this.data.ma_nguoi_dung);
    }
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    today.setDate(today.getDate() - 1);
    this.maxNgaySinh = today;
  }

  loadNhanVienById(ma_nguoi_dung: number) {
    this.QuanLyNhanVienService.LayNhanVienTheoID(ma_nguoi_dung).subscribe({
      next: (res) => {
        this.NhanVien = res.data ?? res;

        // 🔥 CHỈ THÊM 2 DÒNG NÀY
        if (this.NhanVien.ngay_sinh) {
          this.NhanVien.ngay_sinh = new Date(this.NhanVien.ngay_sinh);
        }

        if (this.NhanVien.anh_nguoi_dung?.length) {
          this.previewImage = this.NhanVien.anh_nguoi_dung[0].url;
        }
      }
    });
  }

  // ✅ Chọn ảnh mới
  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.selectedFile = file;

      // Hiển thị preview ảnh mới
      const reader = new FileReader();
      reader.onload = (e) => {
        this.previewImage = e.target?.result as string | ArrayBuffer;
      };
      reader.readAsDataURL(file);
    }
  }

  // ✅ Cập nhật nhân viên
  capNhatNhanVien() {
  if (!this.NhanVien) return;

  // ❌ validate ngày sinh FE
  if (this.NhanVien.ngay_sinh && this.NhanVien.ngay_sinh >= new Date()) {
    this.showToast('Ngày sinh phải nhỏ hơn ngày hiện tại', 'warn');
    return;
  }

  this.loading = true;

  const formData = new FormData();

  Object.entries({
    ho_ten: this.NhanVien.ho_ten,
    email: this.NhanVien.email,
    gioi_tinh: this.NhanVien.gioi_tinh,
    ngay_sinh: this.NhanVien.ngay_sinh,
    loai_nhan_vien: this.NhanVien.loai_nguoi_dung,
    trang_thai: this.NhanVien.trang_thai,
    sdt: this.NhanVien.sdt,
  }).forEach(([key, value]) => {
    if (value !== null && value !== undefined) {

      // 🔥 FORMAT NGÀY
      if (key === 'ngay_sinh' && value instanceof Date) {
        formData.append(
          key,
          value.toISOString().split('T')[0] // YYYY-MM-DD
        );
      } else {
        formData.append(key, value as string);
      }
    }
  });

  // mật khẩu mới
  if (this.NhanVien.mat_khau_moi?.trim()) {
    formData.append('mat_khau', this.NhanVien.mat_khau_moi);
  }

  // ảnh
  if (this.selectedFile) {
    formData.append('image', this.selectedFile);
  }

  this.QuanLyNhanVienService
    .CapNhatNhanVien(this.data.ma_nguoi_dung, formData)
    .subscribe({
      next: () => {
        this.loading = false;
        this.showToast('Cập nhật thành công!', 'success');
        this.dialogRef.close(true);
      },
      error: (err) => {
        this.loading = false;
        this.showToast(err?.error?.error || 'Cập nhật thất bại!', 'error');
      }
    });
}




  close() {
    this.dialogRef.close(false);
  }
}
