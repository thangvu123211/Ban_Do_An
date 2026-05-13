import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { QuanLyGiamGiaService } from '../../../../core/services/QuanLyGiamGia';
import { MATERIAL } from '../../../../Shared/material';
import { ToastMessageComponent } from '../../../../Shared/toasts_message/toast-message/toast-message';
import { MoneyFormatService } from '../../../../core/services/WebService/money-format.service';

@Component({
  selector: 'app-them-giam-gia',
  standalone: true,
  imports: [MATERIAL],
  templateUrl: './them-giam-gia.html',
  styleUrl: './them-giam-gia.scss'
})
export class ThemGiamGia {

  constructor(
    private dialogRef: MatDialogRef<ThemGiamGia>,
    private giamGiaService: QuanLyGiamGiaService,
    private money: MoneyFormatService
  ) { }

  // ===== MODEL =====
  giamGia = {
    code: '',
    ten_chuong_trinh: '',
    loai_giam_gia: 'percent',
    gia_tri_giam: 0,
    don_toi_thieu: 0,
    giam_toi_da: 0,
    gioi_han_su_dung: 100,
    gioi_han_moi_user: 1,
    ngay_bat_dau: null as Date | null,
    ngay_ket_thuc: null as Date | null,
    is_active: true
  };

  isLoading = false;
  giaTriGiamDisplay = '';
  donToiThieuDisplay = '';
  giamToiDaDisplay = '';


  // ===== ACTION =====
  themGiamGia() {
    this.isLoading = true;

    const formData = new FormData();

    Object.entries(this.giamGia).forEach(([key, value]) => {
      if (value === null || value === undefined) return;

      if (value instanceof Date) {
        formData.append(key, value.toISOString());
      } else {
        formData.append(key, String(value));
      }
    });

    this.giamGiaService.ThemGiamGia(formData).subscribe({
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

  oonGiaTriGiamInput(value: string) {

    // nếu là %
    if (this.giamGia.loai_giam_gia === 'percent') {
      const raw = value.replace(/\D/g, '');
      this.giamGia.gia_tri_giam = Number(raw);
      this.giaTriGiamDisplay = raw ? raw + '%' : '';
      return;
    }

    // nếu là tiền
    const raw = this.money.rawNumber(value);
    this.giamGia.gia_tri_giam = raw;
    this.giaTriGiamDisplay = raw ? this.money.formatVND(raw) + 'đ' : '';
  }

  onDonToiThieuInput(value: string) {
    const raw = this.money.rawNumber(value);
    this.giamGia.don_toi_thieu = raw;
    this.donToiThieuDisplay = raw ? this.money.formatVND(raw) + 'đ' : '';
  }

  onGiamToiDaInput(value: string) {
    const raw = this.money.rawNumber(value);
    this.giamGia.giam_toi_da = raw;
    this.giamToiDaDisplay = raw ? this.money.formatVND(raw) + 'đ' : '';
  }

  close() {
    this.dialogRef.close(false);
  }
}