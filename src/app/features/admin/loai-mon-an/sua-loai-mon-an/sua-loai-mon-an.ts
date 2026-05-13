import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { QuanLyLoaiMonAn } from '../../../../core/services/QuanLyLoaiMonAnService';
import { MATERIAL } from '../../../../Shared/material';

@Component({
  selector: 'app-sua-loai-mon-an',
  imports: [MATERIAL],
  templateUrl: './sua-loai-mon-an.html',
  styleUrl: './sua-loai-mon-an.scss'
})
export class SuaLoaiMonAn implements OnInit {
  isLoading = false;
  LoaiMonAn: any = {};
  selectedFile?: File;
  previewImage: string | ArrayBuffer | null = null;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dialogRef: MatDialogRef<SuaLoaiMonAn>,
    private QuanLyLoaiMonAn: QuanLyLoaiMonAn
  ) { }

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
      ten_loai_mon_an: this.LoaiMonAn.ten_loai_mon_an,
    };

    this.QuanLyLoaiMonAn.CapNhatLoaiMonAn(
      this.data.ma_loai_mon_an,
      payload,
      this.selectedFile
    ).subscribe({
      next: () => {
        this.isLoading = false;
        this.dialogRef.close(true);
      },
      error: err => {
        console.log(err);
        this.isLoading = false;
        alert("Lỗi cập nhật");
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
