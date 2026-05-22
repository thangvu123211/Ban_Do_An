import { Component, Inject, OnInit } from '@angular/core';
import { MATERIAL } from '../../../../Shared/material';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { CartService } from '../../../../core/services/cart.service';
import { ToastMessageComponent } from '../../../../Shared/toasts_message/toast-message/toast-message';
import { BinhLuanService } from '../../../../core/services/BinhLuan.service';
import { FormsModule } from '@angular/forms';
import { WebsocketService } from '../../../../core/services/websocket.service';
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
  replyText: { [key: number]: string } = {};
  replyingId: number | null = null;

  // ===== RATING =====
  ratings: any[] = [];
  diemDanhGia = 5;
  noiDungDanhGia = '';

  constructor(
    public dialogRef: MatDialogRef<ThongTinMonAn>,
    private cartService: CartService,
    private binhLuanService: BinhLuanService,
    private wsService: WebsocketService,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) { }

  ngOnInit(): void {
    this.loadBinhLuan();
    this.loadBinhLuan();

    // join room realtime
    this.wsService.connect();

    // listen event
    this.wsService.messages$.subscribe((msg: any) => {

      if (msg.type === 'new_binh_luan') {
        this.binhLuans.unshift(msg.payload);
      }

      if (msg.type === 'update_binh_luan') {
        const index = this.binhLuans.findIndex(x => x.id === msg.payload.id);
        if (index !== -1) this.binhLuans[index] = msg.payload;
      }

      if (msg.type === 'delete_binh_luan') {
        this.binhLuans = this.binhLuans.filter(x => x.id != msg.payload.id);
      }

    });
  }
  ngOnDestroy(): void {
    this.wsService.disconnect();
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

    const token = localStorage.getItem('token');
    const userId = Number(localStorage.getItem('ma_nguoi_dung'));

    const item = {
      ma_mon_an: mon.ma_mon_an,
      ten_mon_an: mon.ten_mon_an,
      gia_tien: mon.gia_tien,
      anh_mon_an: mon.anh_mon_an
    };

    // =========================
    // ❌ GUEST → LOCAL
    // =========================
    if (!token) {

      this.cartService.addLocal(item);

      this.dialogRef.close({
        success: true,
        message: `Đã thêm ${mon.ten_mon_an} vào giỏ hàng`
      });

      return;
    }

    // =========================
    // 🔥 LOGIN → DB
    // =========================
    this.cartService.addDB({
      ma_mon_an: mon.ma_mon_an,
      so_luong: 1,
      options: []   // không có option thì để mảng rỗng
    }).subscribe(() => {
      this.cartService.loadCountFromDB(userId);
      this.showToast('Đã thêm vào giỏ hàng', 'success');
    });
  }

  // ================= COMMENT =================
  guiBinhLuan(parentId?: number) {

    const token = localStorage.getItem('token');
    const maNguoiDung = localStorage.getItem('ma_nguoi_dung');

    if (!token || !maNguoiDung) {
      this.showToast('Vui lòng đăng nhập', 'warn');
      return;
    }

    const text = parentId
      ? this.replyText[parentId]
      : this.noiDungBinhLuan;

    if (!text?.trim()) {
      this.showToast('Nội dung trống', 'warn');
      return;
    }

    const payload = {
      ma_mon_an: this.data.ma_mon_an,
      noi_dung: text.trim(),
      parent_id: parentId || null
    };

    this.binhLuanService.create(payload).subscribe(() => {

      if (parentId) {
        this.replyText[parentId] = '';
        this.replyingId = null;
      } else {
        this.noiDungBinhLuan = '';
      }

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