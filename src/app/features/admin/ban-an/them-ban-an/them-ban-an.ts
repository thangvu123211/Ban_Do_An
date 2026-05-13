
import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { QuanLyBanAnService } from '../../../../core/services/QuanLyBanAn.service';
import { MATERIAL } from '../../../../Shared/material';

@Component({
  selector: 'app-them-ban-an',
  imports: [
    MATERIAL
  ],
  templateUrl: './them-ban-an.html',
  styleUrl: './them-ban-an.scss'
})
export class ThemBanAn implements OnInit {

  seatNumbers: number[] = Array.from({ length: 10 }, (_, i) => i + 1);
  isLoading = false;
  BanAn: any = {
    ten_ban: '',
    so_cho_ngoi: 1,
    trang_thai: '1'
  };

  selectedFile: File | null = null;
  previewUrl: string | null = null;

  constructor(
    private dialogRef: MatDialogRef<ThemBanAn>,
    private QuanLyBanAnService: QuanLyBanAnService,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) { }

  ngOnInit(): void { }

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
  addBanAn() {
    this.isLoading = true;

    const formData = new FormData();

    Object.entries(this.BanAn).forEach(([key, value]) =>
      formData.append(key, value as string)
    );

    if (this.selectedFile) {
      formData.append('image', this.selectedFile);
    }

    this.QuanLyBanAnService.ThemBanAn(formData).subscribe({
      next: (res) => {
        this.isLoading = false;

        this.dialogRef.close(true);
      },

      error: () => {
        this.isLoading = false;
      }
    });
  }

  close() {
    this.dialogRef.close(false);
  }
}
