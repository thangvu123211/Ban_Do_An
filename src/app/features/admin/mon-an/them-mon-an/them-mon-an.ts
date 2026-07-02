import { Component, Inject, OnInit } from '@angular/core';
import { MATERIAL } from '../../../../Shared/material';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { QuanLyLoaiMonAn } from '../../../../core/services/QuanLyLoaiMonAnService';
import { QuanLyMonAn } from '../../../../core/services/QuanLyMonAn.service';
import { MoneyFormatService } from '../../../../core/services/WebService/money-format.service';
import { ToastMessageComponent } from '../../../../Shared/toasts_message/toast-message/toast-message';


@Component({
  selector: 'app-them-mon-an',
  imports: [MATERIAL,ToastMessageComponent],
  templateUrl: './them-mon-an.html',
  styleUrl: './them-mon-an.scss'
})
export class ThemMonAn implements OnInit {
  MonAn: any = {
    ma_loai_mon_an: '',
    ten_mon_an: '',
    gia_tien: 0,
    trang_thai: 1,
    mo_ta: '',
    gia_giam: 0,
  }
  giaTienDisplay: string = '';
  giaTienGiamDisplay: string = '';

  loading = false;
  danhSachLoaiMonAn: any[] = [];
  selectedFile: File | null = null;
  previewUrl: string | null = null;

  toast = {
    show: false,
    message: '',
    type: 'success' as 'success' | 'warn' | 'error'
  };

  constructor(
    private dialogRef: MatDialogRef<ThemMonAn>,
    private QuanLyMonAn: QuanLyMonAn,
    private QuanLyLoaiMonAn: QuanLyLoaiMonAn,
    private money: MoneyFormatService,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) { }

  showToast(message: string, type: 'success' | 'warn' | 'error') {
    this.toast.show = true;
    this.toast.message = message;
    this.toast.type = type;
    setTimeout(() => this.toast.show = false, 3000);
  }

  addMonAn() {
  this.loading = true;

  const formData = new FormData();

  formData.append('ma_loai_mon_an', String(this.MonAn.ma_loai_mon_an));
  formData.append('ten_mon_an', this.MonAn.ten_mon_an);
  formData.append('gia_tien', String(this.MonAn.gia_tien));
  formData.append('trang_thai', String(this.MonAn.trang_thai));
  formData.append('mo_ta', this.MonAn.mo_ta);
  formData.append('gia_giam', String(this.MonAn.gia_giam));

  if (this.selectedFile) {
    formData.append('image', this.selectedFile);
  }

  this.QuanLyMonAn.ThemMonAn(formData).subscribe({
    next: (res: any) => {
      this.loading = false;
      this.dialogRef.close(res?.data || true);
    },
    error: (err) => {
      this.loading = false;

      // 🔥 LẤY LỖI BACKEND
      const msg = err?.error?.error || 'Thêm món ăn thất bại';

      // 👉 TUỲ BẠN DÙNG TOAST GÌ
      this.showToast(msg, 'error');
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
  onGiaTienInput(event: any) {
    const value = event.target.value;

    // convert raw number
    const raw = this.money.rawNumber(value);
    this.MonAn.gia_tien = raw;

    // format lại
    this.giaTienDisplay = this.money.formatVND(raw);
  }
  onGiaTienGiamInput(event: any) {
    const value = event.target.value;

    // convert raw number
    const raw = this.money.rawNumber(value);
    this.MonAn.gia_giam = raw;

    // format lại
    this.giaTienGiamDisplay = this.money.formatVND(raw);
  }

  ngOnInit(): void {
    this.QuanLyLoaiMonAn.LayTatCaLoaiMonAn().subscribe((res: any) => {
      this.danhSachLoaiMonAn = res.data; // tùy backend trả về gì
    });
  }
}
