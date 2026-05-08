
import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { QuanLyNhanVienService } from '../../../../core/services/QuanLyNhanVien.service';
import { MATERIAL } from '../../../../Shared/material';

@Component({
  selector: 'app-sua-nhan-vien',
  imports: [
    MATERIAL
  ],
  templateUrl: './sua-nhan-vien.html',
  styleUrl: './sua-nhan-vien.scss'
})
export class SuaNhanVien implements OnInit {

  NhanVien: any = {};
  selectedFile?: File;
  previewImage: string | ArrayBuffer | null = null;

  toast = {
    show: false,
    message: '',
    type: 'success' as 'success' | 'warn' | 'error'
  };

  constructor(
    private dialogRef: MatDialogRef<SuaNhanVien>,
    private QuanLyNhanVienService: QuanLyNhanVienService,
    @Inject(MAT_DIALOG_DATA) public data: {
      ma_nv: number
    }
  ) { }

  showToast(message: string, type: 'success' | 'warn' | 'error') {
    this.toast.show = true;
    this.toast.message = message;
    this.toast.type = type;
    setTimeout(() => this.toast.show = false, 3000);
  }


  ngOnInit() {
    if (this.data.ma_nv) {
      this.loadNhanVienById(this.data.ma_nv);
    }
  }

  loadNhanVienById(ma_nv: number) {
  this.QuanLyNhanVienService.LayNhanVienTheoID(ma_nv).subscribe({
    next: (res) => {
      this.NhanVien = res.data ?? res;

      // 🔥 CHỈ THÊM 2 DÒNG NÀY
      if (this.NhanVien.ngay_sinh) {
        this.NhanVien.ngay_sinh = new Date(this.NhanVien.ngay_sinh);
      }

      if (this.NhanVien.anh_nhan_vien?.length) {
        this.previewImage = this.NhanVien.anh_nhan_vien[0].url;
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

    const updatedNhanVien: any = {
      ho_ten: this.NhanVien.ho_ten,
      email: this.NhanVien.email,
      gioi_tinh: this.NhanVien.gioi_tinh,
      ngay_sinh: this.NhanVien.ngay_sinh,
      dia_chi: this.NhanVien.dia_chi,
      loai_nhan_vien: this.NhanVien.loai_nhan_vien,
      mat_khau:this.NhanVien.mat_khau_moi
    };


    this.QuanLyNhanVienService.CapNhatNhanVien(this.data.ma_nv, updatedNhanVien, this.selectedFile)
      .subscribe({
        next: () => {
          this.showToast('Cập nhật thành công!', 'success');
          this.dialogRef.close(true);
        },
        error: (err) => {
          console.error('Lỗi khi cập nhật:', err);
          this.showToast(err.error?.error || 'Cập nhật thất bại!', 'error');
        }
      });
  }




  close() {
    this.dialogRef.close(false);
  }
}
