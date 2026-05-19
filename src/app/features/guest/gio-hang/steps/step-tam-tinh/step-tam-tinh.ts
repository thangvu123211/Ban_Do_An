import { Component, Input, Output, EventEmitter } from '@angular/core';
import { MATERIAL } from '../../../../../Shared/material';

@Component({
  selector: 'app-step-tam-tinh',
  standalone: true,
  imports: [MATERIAL],
  templateUrl: './step-tam-tinh.html'
})
export class StepTamTinhComponent {

  @Input() tongTien = 0;
  @Input() tongSauGiam = 0;
  @Input() maGiamGiaChon: any = null;
  @Input() ghiChu = '';
  @Input() giamGiaList: any[] = [];
  maNhap: string = '';

  @Output() chonGiamGia = new EventEmitter<any>();
  @Output() apDungMa = new EventEmitter<string>();

  // ================= CHECK VOUCHER =================
  isVoucherValid(v: any): boolean {
    if (!v?.don_toi_thieu) return true;
    return this.tongTien >= v.don_toi_thieu;
  }
  
}