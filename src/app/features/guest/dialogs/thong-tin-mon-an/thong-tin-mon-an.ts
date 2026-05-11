import { Component, Inject, OnInit } from '@angular/core';
import { MATERIAL } from '../../../../Shared/material';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { CartService } from '../../../../core/services/cart.service';
import { ToastMessageComponent } from '../../../../Shared/toasts_message/toast-message/toast-message';
import { BinhLuanService } from '../../../../core/services/BinhLuan.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-thong-tin-mon-an',
  standalone: true,
  imports: [MATERIAL, ToastMessageComponent, FormsModule],
  templateUrl: './thong-tin-mon-an.html',
  styleUrl: './thong-tin-mon-an.scss'
})
export class ThongTinMonAn implements OnInit {

  toast = {
    show: false,
    message: '',
    type: 'success' as 'success' | 'warn' | 'error'
  };

  // ===== TAB =====
  activeTab: 'info' | 'comment' | 'rating' = 'info';

  // ===== COMMENT =====
  binhLuans: any[] = [];
  noiDungBinhLuan = '';

  // ===== RATING =====
  ratings: any[] = [];
  diemDanhGia = 5;
  noiDungDanhGia = '';

  constructor(
    public dialogRef: MatDialogRef<ThongTinMonAn>,
    private cartService: CartService,
    private binhLuanService: BinhLuanService,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) { }

  ngOnInit(): void {
    this.loadBinhLuan();
  }

  // ================= TAB =================
  setTab(tab: 'info' | 'comment' | 'rating') {
    this.activeTab = tab;

    if (tab === 'comment') this.loadBinhLuan();
    if (tab === 'rating') this.loadDanhGia();
  }

  // ================= TOAST =================
  showToast(message: string, type: 'success' | 'warn' | 'error') {
    this.toast.show = true;
    this.toast.message = message;
    this.toast.type = type;
    setTimeout(() => this.toast.show = false, 3000);
  }

  close() {
    this.dialogRef.close();
  }

  // ================= GIỎ HÀNG =================
  addToGioHang(mon: any): void {
    this.cartService.addItem({
      id: mon.ma_mon_an,
      ma_mon_an: mon.ma_mon_an,
      ten_mon_an: mon.ten_mon_an,
      gia_tien: mon.gia_tien,
      anh_mon_an: mon.anh_mon_an
    });

    this.dialogRef.close({
      success: true,
      message: `Thêm thành công món ${mon.ten_mon_an} vào giỏ hàng`
    });
  }

  // ================= COMMENT =================
  guiBinhLuan() {

    const payload = {
      ma_nguoi_dung: Number(localStorage.getItem('ma_nguoi_dung')),
      ma_mon_an: this.data.ma_mon_an,
      noi_dung: this.noiDungBinhLuan
    };

    this.binhLuanService.create(payload).subscribe(() => {
      this.noiDungBinhLuan = '';
      this.loadBinhLuan();
    });
  }

  loadBinhLuan() {
    this.binhLuanService.getByMonAn(this.data.ma_mon_an)
      .subscribe((res: any) => {
        this.binhLuans = res.data || [];
      });
  }

  // ================= RATING =================
  guiDanhGia() {
    const payload = {
      ma_nguoi_dung: Number(localStorage.getItem('ma_nguoi_dung')),
      ma_mon_an: this.data.ma_mon_an,
      so_sao: this.diemDanhGia,
      noi_dung: this.noiDungDanhGia
    };

    // nếu bạn chưa có service thì comment lại
    // this.danhGiaService.create(payload).subscribe(() => {
    //   this.noiDungDanhGia = '';
    //   this.loadDanhGia();
    // });

    console.log('rating:', payload);
  }

  loadDanhGia() {
    // this.danhGiaService.getByMonAn(this.data.ma_mon_an)
    //   .subscribe((res: any) => {
    //     this.ratings = res.data || [];
    //   });
  }
}