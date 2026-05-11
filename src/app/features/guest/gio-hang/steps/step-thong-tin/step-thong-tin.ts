import { Component, Input, Output, EventEmitter } from '@angular/core';
import { MATERIAL } from '../../../../../Shared/material';

@Component({
  selector: 'app-step-thong-tin',
  standalone: true,
  imports: [MATERIAL],
  templateUrl: './step-thong-tin.html'
})
export class StepThongTincomponent {

  @Input() isLoggedIn = false;

  @Input() tenNguoiNhan = '';
  @Input() soDienThoai = '';
  @Input() diaChi = '';

  @Input() danhSachDiaChi: any[] = [];
  @Input() selectedDiaChi: any;

  @Input() showAddAddress = false;
  @Input() newDiaChi: any;

  @Output() chonDiaChi = new EventEmitter<any>();
  @Output() themDiaChi = new EventEmitter<void>();
  @Output() toggleAdd = new EventEmitter<void>();
  @Output() goToLogin = new EventEmitter<void>();
  @Input() editingDiaChiId: number | null = null;
  @Input() editDiaChiForm: any;

  @Output() tenNguoiNhanChange = new EventEmitter<string>();
  @Output() soDienThoaiChange = new EventEmitter<string>();
  @Output() diaChiChange = new EventEmitter<string>();
  @Output() showAddAddressChange = new EventEmitter<boolean>();
  @Output() datMacDinh = new EventEmitter<number>();
  @Output() suaDiaChi = new EventEmitter<any>();
  @Output() capNhatDiaChi = new EventEmitter<void>();


}