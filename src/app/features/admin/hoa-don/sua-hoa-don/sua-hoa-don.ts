import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MATERIAL } from '../../../../Shared/material';
import { MoneyFormatService } from '../../../../core/services/WebService/money-format.service';
import { DatePipe } from '@angular/common';
import { HoaDonService } from '../../../../core/services/HoaDon.Service';

@Component({
  selector: 'app-sua-hoa-don',
  imports: [MATERIAL],
  templateUrl: './sua-hoa-don.html',
  styleUrl: './sua-hoa-don.scss',
})
export class SuaHoaDon {
  isLoading = false;

  toast = {
    show: false,
    message: '',
    type: 'success' as 'success' | 'warn' | 'error'
  };

  constructor(
    private dialogRef: MatDialogRef<SuaHoaDon>,
    public money: MoneyFormatService,
    private hoaDonService: HoaDonService,
    @Inject(MAT_DIALOG_DATA) public donHang: any,
  ) { }

  showToast(message: string, type: 'success' | 'warn' | 'error') {
    this.toast.show = true;
    this.toast.message = message;
    this.toast.type = type;
    setTimeout(() => this.toast.show = false, 3000);
  }

  capNhatHoaDon() {
  this.isLoading = true;

  const id = this.donHang.ma_hd;

  this.hoaDonService.updateHoaDon(id, {
    ho_ten: this.donHang.ho_ten,
    sdt: this.donHang.sdt,
    dia_chi: this.donHang.dia_chi,
    ghi_chu: this.donHang.ghi_chu
  }).subscribe({
    next: () => {

      this.hoaDonService.updateTrangThai(
        id,
        this.donHang.trang_thai
      ).subscribe({
        next: () => {
          this.isLoading = false;
          this.dialogRef.close(true);
        },
        error: () => {
          this.isLoading = false;
          this.dialogRef.close(false);
        }
      });

    },
    error: () => {
      this.isLoading = false;
      this.dialogRef.close(false);
    }
  });
}

  close() {
    this.dialogRef.close(false);
  }
  formatNgay(date: any): string {
    if (!date) return '';
    const d = new Date(date);
    return d.toLocaleDateString('vi-VN');
  }
  ngOnInit() {

  }


}
