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
  selectedOptions: any[] = [];

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

    // 🔥 CHỈ LẤY OPTION CŨ → ĐỔ VÀO selectedOptions
    this.selectedOptions = (item.options || []).map((o: any) => ({
      ma_option_item: o.ma_option_item,
      gia_them: o.gia_them || 0,
      ma_nhom_option: o.ma_nhom_option,
      ten_option: o.ten_option
    }));

    // ❌ TUYỆT ĐỐI KHÔNG DÙNG item.options SAU DÒNG NÀY

    this.optionService.getAllNhomOption().subscribe((res: any) => {

      this.optionsData = (res.data || [])
        .filter((n: any) => n.ma_mon_an === this.mon.ma_mon_an)
        .map((n: any) => ({
          ...n,
          option_items: n.OptionItems || []
        }));

      // ✅ TÍNH TIỀN CHỈ DỰA TRÊN selectedOptions
      this.tinhTongTien();
    });
  }

  isChecked(opt: any): boolean {
    return this.selectedOptions.some(
      o => o.ma_option_item === opt.ma_option_item
    );
  }

  // ================= TOGGLE =================
  toggleOption(nhom: any, opt: any) {

    if (!nhom.chon_nhieu) {

      // 🔥 XOÁ HẾT OPTION CŨ CÙNG NHÓM (KỂ CẢ OPTION BỊ THIẾU ma_nhom_option)
      this.selectedOptions = this.selectedOptions.filter(
        o => o.ma_nhom_option && o.ma_nhom_option !== nhom.ma_nhom_option
      );

      // ✅ GHI ĐÈ OPTION MỚI
      this.selectedOptions.push({
        ma_option_item: opt.ma_option_item,
        gia_them: opt.gia_them || 0,
        ma_nhom_option: nhom.ma_nhom_option,
        ten_option: opt.ten_option
      });

    } else {

      // CHỌN NHIỀU → GIỮ NGUYÊN
      const exists = this.selectedOptions.some(
        o => o.ma_option_item === opt.ma_option_item
      );

      if (exists) {
        this.selectedOptions = this.selectedOptions.filter(
          o => o.ma_option_item !== opt.ma_option_item
        );
      } else {
        this.selectedOptions.push({
          ma_option_item: opt.ma_option_item,
          gia_them: opt.gia_them || 0,
          ma_nhom_option: nhom.ma_nhom_option,
          ten_option: opt.ten_option
        });
      }
    }

    this.tinhTongTien();
  }
  // ================= FLAT OPTIONS =================
  getAllOptions(): any[] {
    return this.optionsData.flatMap(x => x.option_items || []);
  }

  tinhTongTien() {
    const giaGoc = this.mon.gia_goc || this.mon.gia || 0;

    const tongOption = this.selectedOptions.reduce(
      (sum, o) => sum + (o.gia_them || 0),
      0
    );

    this.tongTien = (giaGoc + tongOption) * this.soLuong;
  }

  // ================= SỐ LƯỢNG =================
  tangSoLuong() {
    this.soLuong++;
    this.tinhTongTien();
  }

  giamSoLuong() {
    if (this.soLuong > 1) {
      this.soLuong--;
      this.tinhTongTien();
    }
  }

  // ================= XÁC NHẬN =================
  xacNhan() {

    const selectedOptions = this.getAllOptions()
      .filter(o => this.selectedOptions.includes(o.ma_option_item))
      .map(o => ({
        ma_option_item: o.ma_option_item,
        ten_option: o.ten_option,
        gia_them: o.gia_them
      }));

    this.dialogRef.close({
      soLuong: this.soLuong,
      options: this.selectedOptions,
    });
  }

  huy() {
    this.dialogRef.close(null);
  }
}