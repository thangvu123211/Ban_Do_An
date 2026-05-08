import { Component, Inject, OnInit } from '@angular/core';
import { MATERIAL } from '../../../../Shared/material';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { QuanLyLoaiMonAn } from '../../../../core/services/QuanLyLoaiMonAnService';
import { QuanLyMonAn } from '../../../../core/services/QuanLyMonAn.service';
import { MoneyFormatService } from '../../../../core/services/WebService/money-format.service';


@Component({
  selector: 'app-them-mon-an',
  imports: [MATERIAL],
  templateUrl: './them-mon-an.html',
  styleUrl: './them-mon-an.scss'
})
export class ThemMonAn implements OnInit {
  MonAn: any = {
    ma_loai_mon_an: '',
    ten_mon_an: '',
    gia_tien: 0,
    trang_thai: '',
    mo_ta:'',
  }
  danhSachLoaiMonAn: any[] = [];
  selectedFile: File | null = null;
  previewUrl: string | null = null;

  constructor(
    private dialogRef: MatDialogRef<ThemMonAn>,
    private QuanLyMonAn: QuanLyMonAn,
    private QuanLyLoaiMonAn: QuanLyLoaiMonAn,
    private moneyFormat: MoneyFormatService,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) { }

  addMonAn() {
  const formData = new FormData();

  formData.append('ma_loai_mon_an', String(this.MonAn.ma_loai_mon_an));
  formData.append('ten_mon_an', this.MonAn.ten_mon_an);
  formData.append('gia_tien', String(this.MonAn.gia_tien));
  formData.append('trang_thai', String(this.MonAn.trang_thai));
  formData.append('mo_ta', String(this.MonAn.mo_ta));

  if (this.selectedFile) {
    formData.append('image', this.selectedFile);
  }

  this.QuanLyMonAn.ThemMonAn(formData).subscribe({
    next: (res: any) => {
      console.log('Thêm món ăn thành công:', res);

      // backend trả { data: [...] }
      if (res?.data) {
        this.dialogRef.close(res.data); // trả danh sách mới cho component cha
      } else {
        this.dialogRef.close(true);
      }
    },
    error: (err) => {
      console.error('Lỗi thêm món ăn', err);
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
  onGiaTienChange(event: any) {
  const raw = this.moneyFormat.rawNumber(event.target.value);
  this.MonAn.gia_tien = raw;

  event.target.value = this.moneyFormat.formatVND(raw);
}

  ngOnInit(): void {
    this.QuanLyLoaiMonAn.LayTatCaLoaiMonAn().subscribe((res: any) => {
      this.danhSachLoaiMonAn = res.data; // tùy backend trả về gì
    });
  }
}
