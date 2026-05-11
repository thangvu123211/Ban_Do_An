import { Component, EventEmitter, Input, Output, output } from '@angular/core';
import { MATERIAL } from '../../../../../Shared/material';

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
  @Output() thanhToan = new EventEmitter<void>();
}