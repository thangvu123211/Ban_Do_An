import { Component, Inject, OnInit } from '@angular/core';
import { MATERIAL } from '../../../../Shared/material';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { QuanLyMonAn } from '../../../../core/services/QuanLyMonAn.service';
import { QuanLyLoaiMonAn } from '../../../../core/services/QuanLyLoaiMonAnService';

@Component({
  selector: 'app-sua-mon-an',
  imports: [MATERIAL],
  templateUrl: './sua-mon-an.html',
  styleUrl: './sua-mon-an.scss'
})
export class SuaMonAn implements OnInit {
  MonAn: any = {};
  selectedFile?: File;
  previewImage: string | ArrayBuffer | null = null;
  danhSachLoaiMonAn: any[] = [];
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dialogRef: MatDialogRef<SuaMonAn>,
    private QuanLyMonAn: QuanLyMonAn,
    private QuanLyLoaiMonAn:QuanLyLoaiMonAn
  ) { }

  ngOnInit() {
    this.QuanLyMonAn.LayMonAnTheoID(this.data.ma_mon_an).subscribe((res: any) => {
      this.MonAn = res.data ?? res;

      // ⭐ ĐÚNG KEY: anh_ban
      if (this.MonAn.anh_mon_an?.length) {
        this.previewImage = this.MonAn.anh_mon_an[0].url;
      } else {
        this.previewImage = 'assets/user.jpg';
      }
    });

    this.QuanLyLoaiMonAn.LayTatCaLoaiMonAn().subscribe((res: any) => {
      this.danhSachLoaiMonAn = res.data; // tùy backend trả về gì
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

capNhat() {
  const payload = {
    ten_mon_an: this.MonAn.ten_mon_an,
    gia_tien: this.MonAn.gia_tien,
    trang_thai: this.MonAn.trang_thai,
    ma_loai_mon_an: this.MonAn.ma_loai_mon_an
  };

  this.QuanLyMonAn.CapNhatMonAn(
    this.data.ma_mon_an,
    payload,
    this.selectedFile
  ).subscribe({
    next: () => this.dialogRef.close(true),
    error: err => {
      console.error(err);
      alert('Cập nhật món ăn thất bại');
    }
  });
}


close() {
  this.dialogRef.close(false);
}
  }
