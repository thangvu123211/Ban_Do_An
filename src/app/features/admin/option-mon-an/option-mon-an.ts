import { Component, OnInit } from '@angular/core';
import { QuanLyMonAn } from '../../../core/services/QuanLyMonAn.service';
import { OptionService } from '../../../core/services/option.service';
import { MATERIAL } from '../../../Shared/material';

@Component({
  selector: 'app-option-mon-an',
  imports: [MATERIAL],
  templateUrl: './option-mon-an.html',
  styleUrl: './option-mon-an.scss'
})
export class OptionMonAn implements OnInit {

  MonAn: any[] = [];
  monAnDangChon: any = null;

  nhomOption = {
    ten_nhom: '',
    bat_buoc: false,
    chon_nhieu: false,
    so_luong_toi_da: 1,
    so_luong_toi_thieu: 0
  };

  optionItems: any[] = [];

  danhSachNhomOption: any[] = [];

  constructor(
    private monAnService: QuanLyMonAn,
    private optionService: OptionService
  ) {}

  ngOnInit() {
    this.load_list_mon_an();
     this.loadOptionItems();
  }

  load_list_mon_an() {
    this.monAnService.LayTatCaMonAn().subscribe((res: any) => {
      this.MonAn = res.data || [];
    });
  }

  chonMonAn(mon: any) {
    this.monAnDangChon = mon;
    this.loadNhomOption();
  }

  loadOptionItems() {
  this.optionService.getAllOptionItem().subscribe((res: any) => {
    this.optionItems = res.data || [];
  });
}

  /* ================= NHÓM OPTION ================= */

  themNhomOption() {
    if (!this.nhomOption.ten_nhom.trim()) {
      alert('Nhập tên nhóm option');
      return;
    }

    const payload = {
      ma_mon_an: this.monAnDangChon.ma_mon_an,
      ...this.nhomOption
    };

    this.optionService.createNhomOption(payload).subscribe(() => {
      this.nhomOption.ten_nhom = '';
      this.loadNhomOption();
    });
  }

  loadNhomOption() {
  this.optionService.getAllNhomOption().subscribe((res: any) => {

    this.danhSachNhomOption = (res.data || [])
      .filter((n: any) => n.ma_mon_an === this.monAnDangChon.ma_mon_an)
      .map((n: any) => ({
        ...n,

        // ✅ ĐÚNG FIELD JSON TỪ BACKEND
        option_items: (n.OptionItems || []).map((opt: any) => ({
          ten_option: opt.ten_option,
          gia_them: opt.gia_them
        })),

        newOption: {
          ten_option: '',
          gia_them: 0
        }
      }));

    console.log('NHÓM OPTION:', this.danhSachNhomOption);
  });
}
  /* ================= OPTION ITEM ================= */

  themOptionItem(nhom: any) {
    if (!nhom.newOption.ten_option.trim()) {
      alert('Nhập tên option');
      return;
    }

    const payload = {
      ma_nhom_option: nhom.ma_nhom_option,
      ten_option: nhom.newOption.ten_option,
      gia_them: nhom.newOption.gia_them
    };

    this.optionService.createOptionItem(payload).subscribe(() => {
      nhom.newOption.ten_option = '';
      nhom.newOption.gia_them = 0;
      this.loadNhomOption();
    });
  }
}