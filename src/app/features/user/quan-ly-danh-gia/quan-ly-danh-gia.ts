import { Component, OnInit } from '@angular/core';
import { QuanLyMonAn } from '../../../core/services/QuanLyMonAn.service';
import { MatDialog } from '@angular/material/dialog';
import { ThongTin } from './thong-tin/thong-tin';
import { MATERIAL } from '../../../Shared/material';
import { ToastMessageComponent } from '../../../Shared/toasts_message/toast-message/toast-message';

@Component({
  selector: 'app-quan-ly-danh-gia',
  imports: [MATERIAL,ToastMessageComponent],
  templateUrl: './quan-ly-danh-gia.html',
  styleUrl: './quan-ly-danh-gia.scss'
})
export class QuanLyDanhGia implements OnInit {

  monAns: any[] = [];
  toast = {
    show: false,
    message: '',
    type: 'success' as 'success' | 'warn' | 'error'
  };
  constructor(
    private monAnService: QuanLyMonAn,
    private dialog: MatDialog
  ) { }

  ngOnInit(): void {
    this.load();
  }
  showToast(message: string, type: 'success' | 'warn' | 'error') {
    this.toast.show = true;
    this.toast.message = message;
    this.toast.type = type;
    setTimeout(() => this.toast.show = false, 3000);
  }

  load() {
    this.monAnService.getMonAnCoBinhLuanVaDanhGiaCuaNguoiDung()
      .subscribe(res => this.monAns = res.data || []);
  }

  open(mon: any) {
    const dialogRef = this.dialog.open(ThongTin, {
      width: '900px',
      height: '80vh',        // 👈 chiều cao cố định
      maxHeight: '80vh',
      data: mon
    });

    dialogRef.beforeClosed().subscribe(() => {
      if (dialogRef.componentInstance?.hasChanged) {
        this.load(); // ✅ cập nhật số bình luận & đánh giá
      }
    });
  }
}
