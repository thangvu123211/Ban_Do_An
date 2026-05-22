import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MATERIAL } from '../../../../Shared/material';
import { OptionService } from '../../../../core/services/option.service';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-sua-gio-hang',
  standalone: true,
  imports: [MATERIAL],
  templateUrl: './sua-gio-hang.html',
  styleUrl: './sua-gio-hang.scss'
})
export class SuaGioHang implements OnInit {

  mon: any;
  soLuong = 1;

  optionsData: any[] = [];
  selectedOptionIds: number[] = [];

  tongTien = 0;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dialogRef: MatDialogRef<SuaGioHang>,
    private optionService: OptionService
  ) { }

  ngOnInit() {

    const item = this.data;

    this.mon = item;
    this.soLuong = item.soLuong || 1;

    // ===== OPTION ĐÃ CHỌN (từ giỏ hàng) =====
    this.selectedOptionIds = (item.options || [])
      .map((o: any) => o.ma_option_item)
      .filter(Boolean);

    // ===== LOAD LẠI OPTION THEO MÓN (BẮT BUỘC) =====
    this.optionService.getAllNhomOption().subscribe((res: any) => {

      const nhomOptions = (res.data || [])
        .filter((n: any) => n.ma_mon_an === this.mon.ma_mon_an)
        .map((n: any) => ({
          ...n,
          option_items: n.OptionItems || []
        }));

      this.optionsData = nhomOptions;

      this.tinhTien();
    });
  }

  isChecked(opt: any): boolean {
    return this.selectedOptionIds.includes(opt.ma_option_item);
  }

  // ================= TOGGLE =================
  toggleOption(nhom: any, opt: any, event: any) {

    const id = opt.ma_option_item;

    if (event.target.checked) {

      // nếu chọn 1 option
      if (!nhom.chon_nhieu) {

        const groupIds = nhom.option_items.map((x: any) => x.ma_option_item);

        this.selectedOptionIds =
          this.selectedOptionIds.filter(x => !groupIds.includes(x));
      }

      if (!this.selectedOptionIds.includes(id)) {
        this.selectedOptionIds.push(id);
      }

    } else {
      this.selectedOptionIds =
        this.selectedOptionIds.filter(x => x !== id);
    }

    this.tinhTien();
  }

  // ================= FLAT OPTIONS =================
  getAllOptions(): any[] {
    return this.optionsData.flatMap(x => x.option_items || []);
  }

  // ================= TÍNH TIỀN =================
  tinhTien() {

    const base = this.mon.gia_don || this.mon.gia_tien || 0;

    const optionTotal = this.getAllOptions()
      .filter(o => this.selectedOptionIds.includes(o.ma_option_item))
      .reduce((s, o) => s + (o.gia_them || 0), 0);

    this.tongTien = (base + optionTotal) * this.soLuong;
  }

  // ================= SỐ LƯỢNG =================
  tangSoLuong() {
    this.soLuong++;
    this.tinhTien();
  }

  giamSoLuong() {
    if (this.soLuong > 1) {
      this.soLuong--;
      this.tinhTien();
    }
  }

  // ================= XÁC NHẬN =================
  xacNhan() {

    const selectedOptions = this.getAllOptions()
      .filter(o => this.selectedOptionIds.includes(o.ma_option_item))
      .map(o => ({
        ma_option_item: o.ma_option_item,
        ten_option: o.ten_option,
        gia_them: o.gia_them
      }));

    this.dialogRef.close({
      ma_mon_an: this.mon.ma_mon_an,
      soLuong: this.soLuong,
      options: selectedOptions,
      ghi_chu: this.mon.ghi_chu || ''
    });
  }

  huy() {
    this.dialogRef.close(null);
  }
}