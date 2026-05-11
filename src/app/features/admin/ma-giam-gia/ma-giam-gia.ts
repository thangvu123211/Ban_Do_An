import { Component, OnInit } from '@angular/core';
import { MATERIAL } from '../../../Shared/material';
import { ToastMessageComponent } from '../../../Shared/toasts_message/toast-message/toast-message';
import { QuanLyGiamGiaService } from '../../../core/services/QuanLyGiamGia';
import { MatDialog } from '@angular/material/dialog';
import { ThemGiamGia } from './them-giam-gia/them-giam-gia';
import { MoneyFormatService } from '../../../core/services/WebService/money-format.service';
import { SuaGiamGia } from './sua-giam-gia/sua-giam-gia';
import { ConfirmDialogComponent } from '../../../Shared/dialogs/confirm-dialog/confirm-dialog';

@Component({
  selector: 'app-ma-giam-gia',
  standalone: true,
  imports: [MATERIAL, ToastMessageComponent],
  templateUrl: './ma-giam-gia.html',
  styleUrl: './ma-giam-gia.scss'
})
export class MaGiamGia implements OnInit {

  danhSachGiamGia: any[] = [];

  toast = {
    show: false,
    message: '',
    type: 'success' as 'success' | 'warn' | 'error'
  };

  constructor(
    private giamGiaService: QuanLyGiamGiaService,
    private dialog: MatDialog,
    public money: MoneyFormatService
  ) { }

  ngOnInit(): void {
    this.loadGiamGia();
  }

  loadGiamGia() {
    this.giamGiaService.LayTatCaGiamGia()
      .subscribe({
        next: (res) => {
          console.log('DATA API:', res); // 👈 test
          this.danhSachGiamGia = res.data;
        },
        error: (err) => {
          console.error(err);
          this.showToast('Không thể tải danh sách mã giảm giá', 'error');
        }
      });
  }
  ThemGiamGia() {
    const dialogRef = this.dialog.open(ThemGiamGia, {
      width: '900px',
      maxWidth: '110vw',
      panelClass: 'custom-dialog'
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.showToast('Thêm mã giảm giá thành công!', 'success');
        this.loadGiamGia(); // load lại danh sách
      } else {
        this.showToast('Bạn đã hủy thêm giảm giá', 'warn');
      }
    });
  }

  SuaGiamGia(gg: any) {
    const dialogRef = this.dialog.open(SuaGiamGia, {
      width: '900px',
      maxWidth: '110vw',
      panelClass: 'custom-dialog',
      data: gg   // 🔥 truyền thẳng object giảm giá
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.showToast('Cập nhật giảm giá thành công', 'success');
        this.loadGiamGia();
      } else {
        this.showToast('Bạn đã hủy sửa giảm giá', 'warn');
      }
    });
  }

  XoaMaGiamGia(ma_giam_gia: number) {
      const dialogRef = this.dialog.open(ConfirmDialogComponent, {
        width: '400px',
        data: { message: 'Bạn có chắc muốn xóa mã giảm giá này?' }
      });
      dialogRef.afterClosed().subscribe(result => {
        if (result) {
          this.showToast('Xóa giảm giá thành công.', 'success');
          this.giamGiaService.XoaGiamGia(ma_giam_gia).subscribe({
  
            next: () => this.loadGiamGia(),
            error: (err) => {
              this.showToast('Xóa mã giảm giá không thành công.', 'error');
            }
          });
        }
      });
    }
  showToast(message: string, type: 'success' | 'warn' | 'error') {
    this.toast.show = true;
    this.toast.message = message;
    this.toast.type = type;
    setTimeout(() => this.toast.show = false, 3000);
  }
}