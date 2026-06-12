import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { BinhLuanService } from '../../../../core/services/BinhLuan.service';
import { DanhGiaService } from '../../../../core/services/DanhGia.service';
import { MATERIAL } from '../../../../Shared/material';
import { ToastMessageComponent } from '../../../../Shared/toasts_message/toast-message/toast-message';
import { ConfirmDialogComponent } from '../../../../Shared/dialogs/confirm-dialog/confirm-dialog';
import { SuaDanhGia } from '../../dialogs/sua-danh-gia/sua-danh-gia';

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

  editId: number | null = null;
  editNoiDung = '';

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
    this.binhLuanService.getAllBinhLuanByNguoiDung(this.mon.ma_mon_an)
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
    this.danhGiaService.getAllDanhGiaByNguoiDung(this.mon.ma_mon_an)
      .subscribe(res => {

        const item = res.data.find(
          (x: any) => x.mon_an.ma_mon_an === this.mon.ma_mon_an
        );

        this.danhGias = item ? item.danh_gias : [];
      });
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

  openEditCMT(c: any) {
    this.editId = c.id;
    this.editNoiDung = c.noi_dung; // lấy nội dung cũ
  }

  cancelEditCMT() {
    this.editId = null;
    this.editNoiDung = '';
  }
  submitEdit(id: number) {
    if (!this.editNoiDung.trim()) {
      this.showToast('Nội dung bình luận không được để trống', 'warn');
      return;
    }

    this.binhLuanService.updateBinhLuan(id, {
      noi_dung: this.editNoiDung
    }).subscribe({
      next: () => {
        this.showToast('Sửa bình luận thành công', 'success');

        this.editId = null;
        this.editNoiDung = '';

        this.hasChanged = true;
        this.loadBinhLuan(); // reload lại danh sách
      },
      error: () => {
        this.showToast('Sửa bình luận không thành công', 'error');
      }
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

  openEdit(r: any) {
    const dialogRef = this.dialog.open(SuaDanhGia, {
      width: '500px',
      data: r
    });

    dialogRef.afterClosed().subscribe(result => {

      if (!result) return;

      this.showToast(result.message,
        result.success ? 'success' : 'error'
      );

      if (result.success) {
        this.loadDanhGia(); // reload list
      }
    });
  }

  close() {
    this.dialogRef.close(this.hasChanged);
  }
}
