import { Component, Inject, OnInit } from '@angular/core';
import { MATERIAL } from '../../../../Shared/material';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { QuanLyLoaiMonAn } from '../../../../core/services/QuanLyLoaiMonAnService';

@Component({
  selector: 'app-them-loai-mon-an',
  imports: [MATERIAL],
  templateUrl: './them-loai-mon-an.html',
  styleUrl: './them-loai-mon-an.scss'
})
export class ThemLoaiMonAn implements OnInit {
  LoaiMonAn: any = {
    ten_loai_mon_an: '',
  };
  selectedFile: File | null = null;
  previewUrl: string | null = null;
  constructor(
    private dialogRef: MatDialogRef<ThemLoaiMonAn>,
    private QuanLyLoaiMonAn: QuanLyLoaiMonAn,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) { }
  ngOnInit(): void {

  }
  addLoaiMonAn() {
    const formData = new FormData();
    Object.entries(this.LoaiMonAn).forEach(([key, value]) =>
      formData.append(key, value as string)
    );
    if (this.selectedFile) formData.append('image', this.selectedFile);

    this.QuanLyLoaiMonAn.ThemLoaiMonAn(formData).subscribe({
      next: (res) => {
        this.dialogRef.close(true);
        return;
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
