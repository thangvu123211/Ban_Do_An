import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MATERIAL } from '../../../../Shared/material';
import { CartService } from '../../../../core/services/cart.service';
import { AuthService } from '../../../../core/services/auth.service';

@Component({
  selector: 'app-them-gio-hang-dialog',
  standalone: true,
  imports: [MATERIAL],
  templateUrl: './them-gio-hang-dialog.html',
  styleUrl: './them-gio-hang-dialog.scss'
})
export class ThemGioHangDialog {

  mon: any = null;
  soLuong = 1;
  selectedOptions: any[] = [];
  selectedByGroup: { [key: number]: any[] } = {};

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dialogRef: MatDialogRef<ThemGioHangDialog>,
    private cartService: CartService,
    private authService: AuthService
  ) {
    this.mon = data?.mon ?? null;
  }

  tinhTongTien() {

    let optionTotal = 0;

    Object.values(this.selectedByGroup).forEach((list: any[]) => {
      list.forEach(opt => {
        optionTotal += opt.gia_them || 0;
      });
    });

    const giaMon = this.mon?.gia_tien || 0;

    return (giaMon + optionTotal) * this.soLuong;
  }

  tangSoLuong() {
    this.soLuong++;
  }

  giamSoLuong() {
    if (this.soLuong > 1) this.soLuong--;
  }

  get tongTien() {
    return this.tinhTongTien()
  }

  xacNhan() {

    const selectedOptions = Object.values(this.selectedByGroup)
      .flat()
      .map((opt: any) => ({
        ma_option_item: opt.ma_option_item,
        ten_option: opt.ten_option,
        gia_them: opt.gia_them
      }));

    this.dialogRef.close({
      mon: {
        ma_mon_an: this.mon.ma_mon_an,
        ten_mon_an: this.mon.ten_mon_an,
        gia_tien: this.mon.gia_tien,
        anh_mon_an: this.mon.anh_mon_an,
      },
      soLuong: this.soLuong,
      selectedOptions   
    });
  }

  huy() {
    this.dialogRef.close();
  }
  toggleOption(nhom: any, opt: any, event: any) {
  const key = nhom.ma_nhom_option;

  if (!this.selectedByGroup[key]) {
    this.selectedByGroup[key] = [];
  }

  const checked = event.target.checked;

  // CHỌN 1 => RADIO
  if (!nhom.chon_nhieu) {
    this.selectedByGroup[key] = checked ? [opt] : [];
    return;
  }

  // CHỌN NHIỀU => CHECKBOX
  const list = this.selectedByGroup[key];

  if (checked) {
    list.push(opt);
  } else {
    this.selectedByGroup[key] =
      list.filter(x => x.ma_option_item !== opt.ma_option_item);
  }
}
  isChecked(nhom: any, opt: any): boolean {
    return (this.selectedByGroup[nhom.ma_nhom_option] || [])
      .some(x => x.ma_option_item === opt.ma_option_item);
  }

}