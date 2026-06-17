import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { MATERIAL } from '../../../../../Shared/material';
import { AdminService } from '../../../../services/admin.service';

@Component({
  selector: 'app-bao-cao',
  imports: [MATERIAL],
  templateUrl: './bao-cao.html',
  styleUrl: './bao-cao.scss'
})
export class BaoCao implements OnInit {
  data = {
    type: 'ngay',
    ngay: '',
    thang: '',
    nam: ''
  };

  isOpenType: boolean = false;
  isOpenNgay: boolean = false;

  danhSachNgay: string[] = [];

  danhSachThang: string[] = [];
  danhSachNam: string[] = [];

  isOpenThang = false;
  isOpenNam = false;

  constructor(
    private dialogRef: MatDialogRef<BaoCao>,
    private AdminService: AdminService
  ) { }

  submit() {
    this.dialogRef.close(this.data);
  }

  ngOnInit(): void {
    this.AdminService.LayDanhSachNgayDoanhThu()
      .subscribe(res => {
        this.danhSachNgay = res.data || [];
      });
    this.AdminService.LayDanhSachThangDoanhThu()
      .subscribe(res => this.danhSachThang = res.data || []);

    this.AdminService.LayDanhSachNamDoanhThu()
      .subscribe(res => this.danhSachNam = res.data || []);
  }
  formatThang(value: string): string {
    // value: "2026-06"
    if (!value) return '';

    const [year, month] = value.split('-');
    return `${month}/${year}`; // 👉 Tháng trước năm sau
  }
}
