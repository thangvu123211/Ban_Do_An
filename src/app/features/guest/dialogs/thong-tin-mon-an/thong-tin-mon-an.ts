import { Component, Inject, OnInit } from '@angular/core';
import { MATERIAL } from '../../../../Shared/material';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { CartService } from '../../../../core/services/cart.service';
import { ToastMessageComponent } from '../../../../Shared/toasts_message/toast-message/toast-message';
import { BinhLuanService } from '../../../../core/services/BinhLuan.service';
import { FormsModule } from '@angular/forms';
import { WebsocketService } from '../../../../core/services/websocket.service';
import { DanhGiaService } from '../../../../core/services/DanhGia.service';
import { ConfirmDialogComponent } from '../../../../Shared/dialogs/confirm-dialog/confirm-dialog';
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

  isSending = false;
  isSendingReply: { [key: number]: boolean } = {};

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

  currentUserId = Number(localStorage.getItem('ma_nguoi_dung'));

  constructor(
    public dialogRef: MatDialogRef<ThongTinMonAn>,
    private cartService: CartService,
    private binhLuanService: BinhLuanService,
    private wsService: WebsocketService,
    private danhGiaService: DanhGiaService,
    private dialog: MatDialog,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) { }

  ngOnInit(): void {
    this.loadBinhLuan();

    console.log('ANH MON:', this.data.anh_mon_an);

    this.activeTab = this.data.openTab || 'info';

    if (this.activeTab === 'rating') {
      this.loadDanhGia();
    }

    // connect websocket
    this.wsService.connect();

    // listen realtime
    this.wsService.messages$.subscribe((msg: any) => {

      if (
        msg.type === 'new_binh_luan' ||
        msg.type === 'update_binh_luan' ||
        msg.type === 'delete_binh_luan'
      ) {
        // ✅ QUAN TRỌNG: reload lại toàn bộ comment
        this.loadBinhLuan();
        return;
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
  // addToGioHang(mon: any): void {

  //   const token = localStorage.getItem('token');
  //   const userId = Number(localStorage.getItem('ma_nguoi_dung'));

  //   const item = {
  //     ma_mon_an: mon.ma_mon_an,
  //     ten_mon_an: mon.ten_mon_an,
  //     gia_tien: mon.gia_tien,
  //     anh_mon_an: mon.anh_mon_an,
  //     gia_giam: mon.gia_giam,
  //     gia_ban: mon.gia_ban,
  //   };

  //   // =========================
  //   // ❌ GUEST → LOCAL
  //   // =========================
  //   if (!token) {

  //     this.cartService.addLocal(item);

  //     this.dialogRef.close({
  //       success: true,
  //       message: `Đã thêm ${mon.ten_mon_an} vào giỏ hàng`
  //     });

  //     return;
  //   }

  //   // =========================
  //   // 🔥 LOGIN → DB
  //   // =========================
  //   this.cartService.addDB({
  //     ma_mon_an: mon.ma_mon_an,
  //     so_luong: 1,
  //     options: []   // không có option thì để mảng rỗng
  //   }).subscribe(() => {
  //     this.cartService.loadCountFromDB(userId);
  //     this.showToast('Đã thêm vào giỏ hàng', 'success');
  //   });
  // }

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

  if (!text || !text.trim()) {
    this.showToast('Nội dung trống', 'warn');
    return;
  }

  // ===== SET SENDING =====
  if (parentId) {
    this.isSendingReply[parentId] = true;
  } else {
    this.isSending = true;
  }

  const payload = {
    ma_mon_an: this.data.ma_mon_an,
    noi_dung: text.trim(),
    parent_id: parentId || null
  };

  this.binhLuanService.create(payload).subscribe({
    next: () => {
      if (parentId) {
        this.replyText[parentId] = '';
        this.replyingId = null;
      } else {
        this.noiDungBinhLuan = '';
      }

      this.loadBinhLuan();
    },
    error: () => {
      this.showToast('Gửi thất bại', 'error');
    },
    complete: () => {
      if (parentId) {
        this.isSendingReply[parentId] = false;
      } else {
        this.isSending = false;
      }
    }
  });
}

  loadBinhLuan() {
    this.binhLuanService.getByMonAn(this.data.ma_mon_an)
      .subscribe((res: any) => {
        this.binhLuans = res.data || [];
      });
  }



  loadDanhGia() {
    this.danhGiaService.getByMonAn(this.data.ma_mon_an)
      .subscribe((res: any) => {

        this.ratings = (res.data || []).map((x: any) => ({
          ...x,
          so_sao: Number(x.SoSao ?? x.so_sao)
        }));

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
          // reload lại danh sách
          this.loadBinhLuan();
        },
        error: () => {
          this.showToast('Xóa bình luận không thành công', 'error');
        }
      });
    });
  }



}