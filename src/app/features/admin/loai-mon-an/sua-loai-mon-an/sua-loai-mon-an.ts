import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { QuanLyLoaiMonAn } from '../../../../core/services/QuanLyLoaiMonAnService';
import { MATERIAL } from '../../../../Shared/material';
import { ToastMessageComponent } from '../../../../Shared/toasts_message/toast-message/toast-message';

@Component({
  selector: 'app-sua-loai-mon-an',
  imports: [MATERIAL, ToastMessageComponent],
  templateUrl: './sua-loai-mon-an.html',
  styleUrl: './sua-loai-mon-an.scss'
})
export class SuaLoaiMonAn implements OnInit {
  isLoading = false;
  LoaiMonAn: any = {};
  selectedFile?: File;
  previewImage: string | ArrayBuffer | null = null;

  toast = {
    show: false,
    message: '',
    type: 'success' as 'success' | 'warn' | 'error'
  };

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dialogRef: MatDialogRef<SuaLoaiMonAn>,
    private QuanLyLoaiMonAn: QuanLyLoaiMonAn
  ) { }

  showToast(message: string, type: 'success' | 'warn' | 'error') {
    this.toast.show = true;
    this.toast.message = message;
    this.toast.type = type;
    setTimeout(() => this.toast.show = false, 3000);
  }

  ngOnInit(): void {
    this.QuanLyLoaiMonAn.LayLoaiMonAnTheoID(this.data.ma_loai_mon_an).subscribe((res: any) => {
      this.LoaiMonAn = res.data ?? res;

      if (this.LoaiMonAn.anh_loai_mon_an) {
        this.previewImage = this.LoaiMonAn.anh_loai_mon_an;
      } else {
        this.previewImage = 'assets/user.jpg';
      }
    });
  }

  CapNhatLoaiMonAn() {
  this.isLoading = true;

  const payload = {
    ten_loai_mon_an: this.LoaiMonAn.ten_loai_mon_an?.trim(),
  };

  this.QuanLyLoaiMonAn.CapNhatLoaiMonAn(
    this.data.ma_loai_mon_an,
    payload,
    this.selectedFile
  ).subscribe({
    next: () => {
      this.isLoading = false;
      this.showToast('Cập nhật thành công', 'success');
      this.dialogRef.close(true);
    },
    error: err => {
      this.isLoading = false;
      this.showToast(err.error?.error || 'Lỗi cập nhật', 'error');
    }
  });
}

  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.selectedFile = file;

      const reader = new FileReader();
      reader.onload = e => this.previewImage = reader.result;
      reader.readAsDataURL(file);
    }
  }


  close() {
    this.dialogRef.close(false);
  }
}
