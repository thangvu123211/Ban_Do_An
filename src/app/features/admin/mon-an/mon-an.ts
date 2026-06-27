import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ViewChild, ElementRef } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialogComponent } from '../../../Shared/dialogs/confirm-dialog/confirm-dialog';
import { MATERIAL } from '../../../Shared/material';
import { ToastMessageComponent } from '../../../Shared/toasts_message/toast-message/toast-message';
import { QuanLyMonAn } from '../../../core/services/QuanLyMonAn.service';
import { ThemMonAn } from './them-mon-an/them-mon-an';
import { SuaMonAn } from './sua-mon-an/sua-mon-an';
import { QuanLyLoaiMonAn } from '../../../core/services/QuanLyLoaiMonAnService';


export interface MonAn {
  ma_mon_an: number;
  ma_loai_mon_an: number;
  ten_mon_an: string;
  gia_tien: number;
  trang_thai: string;
  anh_mon_an: string;
  mo_ta: string;
  gia_giam:number;
}

@Component({
  selector: 'app-mon-an',
  imports: [MATERIAL, ToastMessageComponent],
  templateUrl: './mon-an.html',
  styleUrl: './mon-an.scss'
})
export class MonAn implements OnInit {
  MonAn: any[] = [];
  LoaiMonAnMap: any = {};
  toast = {
    show: false,
    message: '',
    type: 'success' as 'success' | 'warn' | 'error'
  };

  editingMonAnId: number | null = null;

  constructor(
    private http: HttpClient,
    private dialog: MatDialog,
    private QuanLyMonAn: QuanLyMonAn,
    private QuanLyLoaiMonAn: QuanLyLoaiMonAn) { }

  showToast(message: string, type: 'success' | 'warn' | 'error') {
    this.toast.show = true;
    this.toast.message = message;
    this.toast.type = type;
    setTimeout(() => this.toast.show = false, 3000);
  }

  load_list_mon_an() {
    this.QuanLyMonAn.LayTatCaMonAn().subscribe({
      next: (res: any) => {
        if (Array.isArray(res.data)) {
          this.MonAn = res.data.map((u: MonAn) => ({
            ...u,
            anh_mon_an_url: u.anh_mon_an
          }));
        }
      }
    });
  }
  loadLoaiMonAn() {
    this.QuanLyLoaiMonAn.LayTatCaLoaiMonAn().subscribe((res: any) => {
      res.data.forEach((item: any) => {
        this.LoaiMonAnMap[item.ma_loai_mon_an] = item.ten_loai_mon_an;
      });
    });
  }

  ThemMonAn() {
    const dialogRef = this.dialog.open(ThemMonAn, {
      width: '900px',
      maxWidth: '110vw',
      panelClass: 'custom-dialog'
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.showToast('Thêm món ăn thành công!', 'success');
        this.load_list_mon_an(); // load lại danh sách
      } else {
        this.showToast('Bạn đã hủy thêm món ăn', 'warn');
      }
    });
  }

  suaMonAn(ma_mon_an: number) {
    const dialogRef = this.dialog.open(SuaMonAn, {
      width: '900px',
      maxWidth: '110vw',
      data: {
        ma_mon_an
      },
      panelClass: 'custom-dialog'
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.showToast('Cập nhật món ăn thành công', 'success');
        this.load_list_mon_an();
        const payload = {
        };
      } else {
        this.showToast('Bạn đã hủy sửa món ăn', 'warn');
      }
    });
  }
  toggleOption(monan: any) {
    monan.showOption = !monan.showOption;
  }

  ngOnInit(): void {
    this.load_list_mon_an();
    this.loadLoaiMonAn();
  }
}
