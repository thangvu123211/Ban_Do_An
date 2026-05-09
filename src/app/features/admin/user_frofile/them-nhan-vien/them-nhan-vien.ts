
import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { QuanLyNhanVienService } from '../../../../core/services/QuanLyNhanVien.service';
import { MATERIAL } from '../../../../Shared/material';

@Component({
  selector: 'app-them-nhan-vien',
  standalone: true,
  imports: [
    MATERIAL
  ],
  templateUrl: './them-nhan-vien.html',
  styleUrls: ['./them-nhan-vien.scss'],
})
export class ThemNhanVien implements OnInit {
  // ✅ Đặt tên class khác với tên biến để tránh xung đột
  NhanVien: any = {
    ho_ten: '',
    email: '',
    mat_khau: '',
    gioi_tinh: 'Nam',
    dia_chi: '',
    ngay_sinh: null,
    loai_nguoi_dung: 'user',
  };

  selectedFile: File | null = null;
  previewUrl: string | null = null;

  constructor(
    private dialogRef: MatDialogRef<ThemNhanVien>,
    private QuanLyNhanVienService: QuanLyNhanVienService,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  ngOnInit(): void {}

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
    const formData = new FormData();
    Object.entries(this.NhanVien).forEach(([key, value]) =>
      formData.append(key, value as string)
    );
    if (this.selectedFile) formData.append('image', this.selectedFile);

    this.QuanLyNhanVienService.ThemNhanVien(formData).subscribe({
      next: (res) => {
        this.dialogRef.close(true);
        return;
      }
    });
  }

  close() {
    this.dialogRef.close(false);
  }
}
