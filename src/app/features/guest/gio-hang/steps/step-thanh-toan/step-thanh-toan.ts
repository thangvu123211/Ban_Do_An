import { Component, EventEmitter, Input, Output, output } from '@angular/core';
import { MATERIAL } from '../../../../../Shared/material';
import { SafeHtml } from '@angular/platform-browser';
import { environment } from '../../../../../../environments/environment.prod';


@Component({
  selector: 'app-step-thanh-toan',
  standalone: true,
  imports: [MATERIAL],
  templateUrl: './step-thanh-toan.html'
})
export class StepThanhToanComponent {

  bankName = environment.payment.qrBank;
  accountName = environment.payment.qrName;
  accountNumber = environment.payment.qrAcc;

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
  @Output() huyHoaDon = new EventEmitter<void>();

  onHuyHoaDon() {
    this.huyHoaDon.emit();
  }
}