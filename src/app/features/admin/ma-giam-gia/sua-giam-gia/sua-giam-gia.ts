import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { QuanLyGiamGiaService } from '../../../../core/services/QuanLyGiamGia';
import { MATERIAL } from '../../../../Shared/material';
import { MoneyFormatService } from '../../../../core/services/WebService/money-format.service';

@Component({
  selector: 'app-sua-giam-gia',
  standalone: true,
  imports: [MATERIAL],
  templateUrl: './sua-giam-gia.html',
})
export class SuaGiamGia {

  giamGia: any;

  giaTriGiamDisplay = '';
  donToiThieuDisplay = '';
  giamToiDaDisplay = '';
  isLoading = false;

  constructor(
    private dialogRef: MatDialogRef<SuaGiamGia>,
    private giamGiaService: QuanLyGiamGiaService,
    public money: MoneyFormatService,
    @Inject(MAT_DIALOG_DATA) data: any
  ) {
    this.giamGia = { ...data };

    // 🔥 FIX DATE
    if (this.giamGia.ngay_bat_dau)
      this.giamGia.ngay_bat_dau = new Date(this.giamGia.ngay_bat_dau);

    if (this.giamGia.ngay_ket_thuc)
      this.giamGia.ngay_ket_thuc = new Date(this.giamGia.ngay_ket_thuc);

    this.initDisplay();
  }

  initDisplay() {
    this.giaTriGiamDisplay =
      this.giamGia.loai_giam_gia === 'percent'
        ? this.giamGia.gia_tri_giam + '%'
        : this.money.formatVND(this.giamGia.gia_tri_giam) + 'đ';

    this.donToiThieuDisplay =
      this.money.formatVND(this.giamGia.don_toi_thieu) + 'đ';

    this.giamToiDaDisplay =
      this.money.formatVND(this.giamGia.giam_toi_da) + 'đ';
  }

  onLoaiGiamGiaChange() {
    this.giamGia.gia_tri_giam = 0;
    this.giaTriGiamDisplay = '';
  }

  onGiaTriGiamInput(v: string) {
    if (this.giamGia.loai_giam_gia === 'percent') {
      const raw = v.replace(/\D/g, '');
      this.giamGia.gia_tri_giam = +raw;
      this.giaTriGiamDisplay = raw ? raw + '%' : '';
      return;
    }

    const raw = this.money.rawNumber(v);
    this.giamGia.gia_tri_giam = raw;
    this.giaTriGiamDisplay = raw ? this.money.formatVND(raw) + 'đ' : '';
  }

  onDonToiThieuInput(v: string) {
    const raw = this.money.rawNumber(v);
    this.giamGia.don_toi_thieu = raw;
    this.donToiThieuDisplay = raw ? this.money.formatVND(raw) + 'đ' : '';
  }

  onGiamToiDaInput(v: string) {
    const raw = this.money.rawNumber(v);
    this.giamGia.giam_toi_da = raw;
    this.giamToiDaDisplay = raw ? this.money.formatVND(raw) + 'đ' : '';
  }

  capNhat() {
  this.isLoading = true;

  const formData = new FormData();

  formData.append('code', this.giamGia.code);
  formData.append('ten_chuong_trinh', this.giamGia.ten_chuong_trinh);
  formData.append('loai_giam_gia', this.giamGia.loai_giam_gia);
  formData.append('gia_tri_giam', String(this.giamGia.gia_tri_giam));
  formData.append('don_toi_thieu', String(this.giamGia.don_toi_thieu));
  formData.append('giam_toi_da', String(this.giamGia.giam_toi_da));
  formData.append('gioi_han_su_dung', String(this.giamGia.gioi_han_su_dung));
  formData.append('gioi_han_moi_user', String(this.giamGia.gioi_han_moi_user));

  formData.append('ngay_bat_dau', this.formatDateRFC3339(this.giamGia.ngay_bat_dau));
  formData.append('ngay_ket_thuc', this.formatDateRFC3339(this.giamGia.ngay_ket_thuc));

  formData.append('is_active', this.giamGia.is_active ? 'true' : 'false');

  this.giamGiaService.CapNhatGiamGia(this.giamGia.id, formData)
    .subscribe({
      next: () => {
        this.isLoading = false;
        this.dialogRef.close(true);
      },
      error: () => {
        this.isLoading = false;
        this.dialogRef.close(false);
      }
    });
}
  formatDateRFC3339(date: any): string {
    return new Date(date).toISOString();
  }

  close() {
    this.dialogRef.close(false);
  }
}