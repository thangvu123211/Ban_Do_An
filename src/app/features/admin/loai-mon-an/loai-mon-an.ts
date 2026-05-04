
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialogComponent } from '../../../Shared/dialogs/confirm-dialog/confirm-dialog';
import { MATERIAL } from '../../../Shared/material';
import { ToastMessageComponent } from '../../../Shared/toasts_message/toast-message/toast-message';
import { QuanLyLoaiMonAn } from '../../../core/services/QuanLyLoaiMonAnService';
import { ThemLoaiMonAn } from './them-loai-mon-an/them-loai-mon-an';
import { SuaLoaiMonAn } from './sua-loai-mon-an/sua-loai-mon-an';

export interface LoaiMonAn {
  ma_loai_mon_an: number;
  ten_loai_mon_an: string;
  anh_loai_mon_an: string;
}

@Component({
  selector: 'app-loai-mon-an',
  imports: [MATERIAL, ToastMessageComponent],
  templateUrl: './loai-mon-an.html',
  styleUrl: './loai-mon-an.scss'
})

export class LoaiMonAn implements OnInit {
  loaimonan: any[] = [];
  toast = {
    show: false,
    message: '',
    type: 'success' as 'success' | 'warn' | 'error'
  };
  @ViewChild('fileInput') fileInput!: ElementRef;
  constructor(
    private http: HttpClient,
    private dialog: MatDialog,
    private QuanLyLoaiMonAn: QuanLyLoaiMonAn

  ) { }
  showToast(message: string, type: 'success' | 'warn' | 'error') {
    this.toast.show = true;
    this.toast.message = message;
    this.toast.type = type;
    setTimeout(() => this.toast.show = false, 3000);
  }

  load_list_loai_mon_an() {
    this.QuanLyLoaiMonAn.LayTatCaLoaiMonAn().subscribe({
      next: (res: any) => {
        if (Array.isArray(res.data)) {
          this.loaimonan = res.data.map((u: LoaiMonAn) => ({
            ...u,
            anh_loai_mon_an_url: u.anh_loai_mon_an
          }));

        }
      }
    });
  }
  ThemLoaiMonAn() {
    const dialogRef = this.dialog.open(ThemLoaiMonAn, {
      width: '900px',
      maxWidth: '110vw',
      panelClass: 'custom-dialog'
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.showToast('Thêm loại món ăn thành công!', 'success');
        this.load_list_loai_mon_an(); // load lại danh sách
      } else {
        this.showToast('Bạn đã hủy thêm loại món ăn', 'warn');
      }
    });
  }

  SuaLoaiMonAn(ma_loai_mon_an: number) {
    const dialogRef = this.dialog.open(SuaLoaiMonAn, {
      width: '900px',
      maxWidth: '110vw',
      data: {
        ma_loai_mon_an
      },
      panelClass: 'custom-dialog'
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.showToast('Cập nhật loại món ăn thành công', 'success');
        this.load_list_loai_mon_an();
      } else {
        this.showToast('Bạn đã hủy sửa loại món ăn', 'warn');
      }
    });
  }

  openDialogXoa(ma_loai_mon_an: number) {
      const dialogRef = this.dialog.open(ConfirmDialogComponent, {
        width: '400px',
        data: { message: 'Bạn có chắc muốn xóa loại món ăn này?' }
      });
      dialogRef.afterClosed().subscribe(result => {
        if (result) {
          this.showToast('Xóa loại món ăn thành công', 'success');
          this.QuanLyLoaiMonAn.XoaLoaiMonAn(ma_loai_mon_an).subscribe({
  
            next: () => this.load_list_loai_mon_an(),
            error: (err) => {
              this.showToast('Xóa loại món ăn không thành công', 'error');
            }
          });
        }
      });
    }

  ngOnInit(): void {
    this.load_list_loai_mon_an();
  }
}


