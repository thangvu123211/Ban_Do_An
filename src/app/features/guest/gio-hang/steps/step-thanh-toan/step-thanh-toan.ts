import { Component, EventEmitter, Input, Output, output } from '@angular/core';
import { MATERIAL } from '../../../../../Shared/material';
import { SafeHtml } from '@angular/platform-browser';

@Component({
  selector: 'app-step-thanh-toan',
  standalone: true,
  imports: [MATERIAL],
  templateUrl: './step-thanh-toan.html'
})
export class StepThanhToanComponent {

  @Input() gioHang: any[] = [];
  @Input() tongTien = 0;

  @Input() tenNguoiNhan = '';
  @Input() soDienThoai = '';
  @Input() diaChi = '';
  @Input() ghiChu = '';
  @Input() tongSauGiam = 0;
  @Input() maGiamGiaChon: any;
  @Input() qrUrl: string = '';
@Input() maHoaDonDangThanhToan: number | null = null;
  

  onThanhToan() {
    this.submitThanhToan.emit();
  }

  @Input() showQR = false;
  @Input() qrHtml: SafeHtml | null = null;
  @Input() isCreatingPayment = false;

  // ⬇️ CHỈ PHÁT EVENT
  @Output() submitThanhToan = new EventEmitter<void>();
}