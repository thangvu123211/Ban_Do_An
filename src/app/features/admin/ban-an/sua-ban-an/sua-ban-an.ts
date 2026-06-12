
import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { QuanLyBanAnService } from '../../../../core/services/QuanLyBanAn.service';
import { MATERIAL } from '../../../../Shared/material';

@Component({
  selector: 'app-sua-ban-an',
  imports: [
    MATERIAL
  ],
  templateUrl: './sua-ban-an.html',
  styleUrl: './sua-ban-an.scss'
})
export class SuaBanAn implements OnInit {
  banAn: any = {};
  selectedFile?: File;
  previewImage: string | ArrayBuffer | null = null;
  isLoading = false;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dialogRef: MatDialogRef<SuaBanAn>,
    private QuanLyBanAnService: QuanLyBanAnService
  ) { }

  ngOnInit() {
    this.banAn = this.data.banAn;

    if (this.banAn?.anh_ban?.length) {
      this.previewImage = this.banAn.anh_ban[0].url;
    } else {
      this.previewImage = 'assets/user.jpg';
    }
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
    this.isLoading = true;

    const payload = {
      ten_ban: this.banAn.ten_ban,
      so_cho_ngoi: this.banAn.so_cho_ngoi,
      trang_thai: this.banAn.trang_thai
    };

    this.QuanLyBanAnService
      .CapNhatBanAn(this.banAn.ma_ban, payload, this.selectedFile) // ✅ SỬA Ở ĐÂY
      .subscribe({
        next: () => {
          this.isLoading = false;
          this.dialogRef.close(true);
        },
        error: (err) => {
          console.log(err);
          this.isLoading = false;
          alert('Lỗi cập nhật');
        }
      });
  }

  close() {
    this.dialogRef.close(false);
  }
}
