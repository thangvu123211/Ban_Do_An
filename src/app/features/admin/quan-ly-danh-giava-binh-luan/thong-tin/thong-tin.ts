import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { BinhLuanService } from '../../../../core/services/BinhLuan.service';
import { DanhGiaService } from '../../../../core/services/DanhGia.service';
import { MATERIAL } from '../../../../Shared/material';
import { ToastMessageComponent } from '../../../../Shared/toasts_message/toast-message/toast-message';
import { ConfirmDialogComponent } from '../../../../Shared/dialogs/confirm-dialog/confirm-dialog';

@Component({
  selector: 'app-thong-tin',
  imports: [MATERIAL, ToastMessageComponent],
  templateUrl: './thong-tin.html',
  styleUrl: './thong-tin.scss'
})
export class ThongTin implements OnInit {
  toast = {
    show: false,
    message: '',
    type: 'success' as 'success' | 'warn' | 'error'
  };
  tab: 'comment' | 'rating' = 'comment';

  binhLuans: any[] = [];
  danhGias: any[] = [];
  hasChanged = false;

  constructor(
    @Inject(MAT_DIALOG_DATA) public mon: any,
    private dialogRef: MatDialogRef<ThongTin>,
    private binhLuanService: BinhLuanService,
    private danhGiaService: DanhGiaService,
    private dialog: MatDialog,
  ) { }

  ngOnInit(): void {
    this.loadBinhLuan();
    this.loadDanhGia();
  }
  showToast(message: string, type: 'success' | 'warn' | 'error') {
    this.toast.show = true;
    this.toast.message = message;
    this.toast.type = type;
    setTimeout(() => this.toast.show = false, 3000);
  }

  loadBinhLuan() {
    this.binhLuanService.getByMonAn(this.mon.ma_mon_an)
      .subscribe((res: any) => {
        console.log('BINH LUAN RESPONSE:', res);

        // Trường hợp backend trả mảng trực tiếp
        if (Array.isArray(res)) {
          this.binhLuans = res;
        }
        // Trường hợp có data
        else if (Array.isArray(res.data)) {
          this.binhLuans = res.data;
        }
        else {
          this.binhLuans = [];
        }
      });
  }

  loadDanhGia() {
    this.danhGiaService.TatCaDanhGiaCuaAdmin(this.mon.ma_mon_an)
      .subscribe(res => this.danhGias = res.data || []);
  }

  deleteBinhLuan(id: number) {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '400px',
      data: { message: 'Bạn có chắc muốn xóa bình luận này?' }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (!result) return;

      this.binhLuanService.delete(id).subscribe({
        next: () => {
          this.showToast('Xóa bình luận thành công', 'success');
          this.hasChanged = true;
          // reload lại danh sách
          this.loadBinhLuan();
        },
        error: () => {
          this.showToast('Xóa bình luận không thành công', 'error');
        }
      });
    });
  }

  AnDanhGia(id: number) {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '400px',
      data: { message: 'Bạn có chắc muốn ẩn đánh giá này?' }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (!result) return;

      this.danhGiaService.AnDanhGia(id).subscribe({
        next: () => {
          this.showToast('Ẩn đánh giá thành công', 'success');
          this.hasChanged = true;
          this.loadDanhGia();
        },
        error: () => {
          this.showToast('Ẩn đánh giá không thành công', 'error');
        }
      });
    });
  }
  HienDanhGia(id: number) {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '400px',
      data: { message: 'Bạn có chắc muốn hiện đánh giá này?' }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (!result) return;

      this.danhGiaService.HienDanhGia(id).subscribe({
        next: () => {
          this.showToast('Hiện đánh giá thành công', 'success');
          this.hasChanged = true;
          this.loadDanhGia();
        },
        error: () => {
          this.showToast('Hiện đánh giá không thành công', 'error');
        }
      });
    });
  }

  close() {
    this.dialogRef.close(this.hasChanged);
  }
}
