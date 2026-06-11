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
    thang: new Date().getMonth() + 1,
    nam: new Date().getFullYear()
  };

  isOpenType: boolean = false;
  isOpenNgay: boolean = false;

  danhSachNgay: string[] = [];

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
  }
}
