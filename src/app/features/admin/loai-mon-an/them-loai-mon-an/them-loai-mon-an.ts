import { Component, Inject, OnInit } from '@angular/core';
import { MATERIAL } from '../../../../Shared/material';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { QuanLyLoaiMonAn } from '../../../../core/services/QuanLyLoaiMonAnService';
import { ToastMessageComponent } from '../../../../Shared/toasts_message/toast-message/toast-message';

@Component({
  selector: 'app-them-loai-mon-an',
  imports: [MATERIAL,ToastMessageComponent],
  templateUrl: './them-loai-mon-an.html',
  styleUrl: './them-loai-mon-an.scss'
})
export class ThemLoaiMonAn implements OnInit {
  LoaiMonAn: any = {
    ten_loai_mon_an: '',
  };
  isLoading = false;
  selectedFile: File | null = null;
  previewUrl: string | null = null;

  toast = {
    show: false,
    message: '',
    type: 'success' as 'success' | 'warn' | 'error'
  };
  constructor(
    private dialogRef: MatDialogRef<ThemLoaiMonAn>,
    private QuanLyLoaiMonAn: QuanLyLoaiMonAn,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) { }

  showToast(message: string, type: 'success' | 'warn' | 'error') {
    this.toast.show = true;
    this.toast.message = message;
    this.toast.type = type;
    setTimeout(() => this.toast.show = false, 3000);
  }
  ngOnInit(): void {

  }
  addLoaiMonAn() {
  this.isLoading = true;

  const formData = new FormData();
  Object.entries(this.LoaiMonAn).forEach(([key, value]) =>
    formData.append(key, value as string)
  );

  if (this.selectedFile) {
    formData.append('image', this.selectedFile);
  }

  this.QuanLyLoaiMonAn.ThemLoaiMonAn(formData).subscribe({
    next: () => {
      this.isLoading = false;
      this.showToast('Thêm loại món ăn thành công', 'success');
      this.dialogRef.close(true);
    },
    error: err => {
      this.isLoading = false;
      this.showToast(err.error?.error || 'Thêm thất bại', 'error');
    }
  });
}
  chonAnh(input: HTMLInputElement) {
    input.click();
  }
  onFileSelected(event: any) {
    this.selectedFile = event.target.files[0];
    if (this.selectedFile) {
      const reader = new FileReader();
      reader.onload = (e) => (this.previewUrl = e.target?.result as string);
      reader.readAsDataURL(this.selectedFile);
    }
  }
  close() {
    this.dialogRef.close(false);
  }
}
