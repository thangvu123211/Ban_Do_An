import { Component, Input, Output, EventEmitter } from '@angular/core';
import { MATERIAL } from '../../../../../Shared/material';
import { GoogleMapsModule } from '@angular/google-maps';

@Component({
  selector: 'app-step-thong-tin',
  standalone: true,
  imports: [MATERIAL, GoogleMapsModule],
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

  openMap = false;

  mapCenter = {
    lat: 10.762622,
    lng: 106.660172
  };

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

  onMapClick(event: google.maps.MapMouseEvent) {
    if (!event.latLng) return;

    const lat = event.latLng.lat();
    const lng = event.latLng.lng();

    this.newDiaChi.latitude = lat;
    this.newDiaChi.longitude = lng;

    this.mapCenter = { lat, lng };
  }
}