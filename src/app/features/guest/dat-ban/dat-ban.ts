import { Component, OnInit, signal } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';

// Import dialog
import { BookingDialog } from '../../../features/guest/dialogs/booking-dialog/booking-dialog';
import { ToastMessageComponent } from '../../../Shared/toasts_message/toast-message/toast-message';
import { QuanLyBanAnService } from '../../../core/services/QuanLyBanAn.service';
import { MATERIAL } from '../../../Shared/material';
import { AuthService } from '../../../core/services/auth.service';
import { QuanLyDatBanService } from '../../../core/services/QuanLyDatBan.service';
import { WebsocketService } from '../../../core/services/websocket.service';
import { ConfirmDialogComponent } from '../../../Shared/dialogs/confirm-dialog/confirm-dialog';

@Component({
  selector: 'app-dat-ban',
  standalone: true,
  imports: [
    MATERIAL,
    ToastMessageComponent,
  ],
  templateUrl: './dat-ban.html',
  styleUrls: ['./dat-ban.scss']
})
export class DatBan implements OnInit {
  BanAn: any[] = [];
  selectedDate: Date | null = null;
  selectedHour: string | null = null;
  selectedTableId: number | null = null;
  readonly panelOpenState = signal(false);
  minDate!: Date;


  // state toast
  toast = {
    show: false,
    message: '',
    type: 'success' as 'success' | 'warn' | 'error'
  };

  get isLoggedIn(): boolean {
    return this.authService.isLoggedIn();
  }
  khungGio: {
    gio: string;
    da_dat: boolean;
    qua_gio?: boolean;
  }[] = [];


  constructor(
    private dialog: MatDialog,
    private QuanLyBanAnService: QuanLyBanAnService,
    private QuanLyDatBanService: QuanLyDatBanService,
    private authService: AuthService,
    private wsService: WebsocketService,
  ) { }



  ngOnInit(): void {
    this.loadBanAn();
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    this.minDate = today;
    this.connectRealtime();
  }

  connectRealtime() {
    this.wsService.connect();

    this.wsService.messages$.subscribe((msg: any) => {

      console.log("🔥 WS RECEIVED:", msg);

      const type = msg?.type || msg?.Type;
      const data = msg?.payload;

      if (!data) return;

      switch (type) {

        case 'khung_gio_updated': {
          const maBan = Number(data.ma_ban_an);
          const ngay = data.ngay;

          if (this.selectedTableId !== maBan) return;
          if (!this.selectedDate) return;

          if (this.formatDate(this.selectedDate) !== ngay) return;

          // 🔥 QUAN TRỌNG: reload full lại từ backend
          this.loadKhungGio(ngay, maBan);

          this.showToast('Có một khung giờ vừa được khách hàng đặt mới', 'success');
          break;
        }
      }
    });
  }



  showToast(message: string, type: 'success' | 'warn' | 'error') {
    this.toast.show = true;
    this.toast.message = message;
    this.toast.type = type;
    setTimeout(() => this.toast.show = false, 3000);
  }

  loadBanAn() {
    this.QuanLyBanAnService.LayTatCaBanAn().subscribe({
      next: (res: any) => {
        if (Array.isArray(res.data)) {
          this.BanAn = res.data.map((u: any) => ({
            ...u,
            anh_ban_url: u.anh_ban?.length ? u.anh_ban[0].url : null,
            anh_qr_url: u.anh_qr || null
          }));
        }
      },
      error: (err) => {
        console.error('Lỗi khi load bàn ăn:', err);
      }
    });
  }

  loadKhungGio(ngay: string, maBan: number) {
    this.QuanLyDatBanService.getKhungGioBan(ngay, maBan).subscribe({
      next: (res) => {

        const now = new Date();
        const todayStr = this.formatDate(now);

        this.khungGio = res.data.map((g: any) => {

          let quaGio = false;

          // chỉ check nếu ngày đang chọn = hôm nay
          if (ngay === todayStr) {
            const [h, m] = g.gio.split(':').map(Number);

            const slotTime = new Date();
            slotTime.setHours(h, m ?? 0, 0, 0);

            quaGio = slotTime.getTime() <= now.getTime();
          }

          return {
            ...g,
            qua_gio: quaGio
          };
        });

        const stillValid = this.khungGio.some(g => g.gio === this.selectedHour);

        if (!stillValid) {
          this.selectedHour = null;
        }
      },
      error: (err) => console.error(err)
    });
  }

  updateKhungGio() {
    if (!this.selectedDate || !this.selectedTableId) return;

    this.selectedHour = null;

    this.QuanLyDatBanService.getKhungGioBan(
      this.formatDate(this.selectedDate),
      this.selectedTableId
    ).subscribe({
      next: (res) => {
        this.khungGio = res.data;
      }
    });
  }
  handleDateChange(date: Date) {
    this.selectedDate = date;

    this.tryLoadKhungGio();
  }
  tryLoadKhungGio() {
    if (!this.selectedDate || !this.selectedTableId) return;

    this.selectedHour = null;

    const ngayStr = this.formatDate(this.selectedDate);
    const now = new Date();
    const todayStr = this.formatDate(now);

    this.QuanLyDatBanService.getKhungGioBan(
      ngayStr,
      this.selectedTableId
    ).subscribe({
      next: (res) => {

        this.khungGio = res.data.map((g: any) => {

          let quaGio = false;

          // chỉ check khi chọn đúng hôm nay
          if (ngayStr === todayStr) {
            const [h, m] = g.gio.split(':').map(Number);

            const slotTime = new Date();
            slotTime.setFullYear(now.getFullYear(), now.getMonth(), now.getDate());
            slotTime.setHours(h, m ?? 0, 0, 0);

            quaGio = slotTime.getTime() <= now.getTime();
          }

          return {
            ...g,
            qua_gio: quaGio
          };
        });

        // reset nếu giờ đang chọn không hợp lệ
        const stillValid = this.khungGio.some(g => g.gio === this.selectedHour);

        if (!stillValid) {
          this.selectedHour = null;
        }
      }
    });
  }

  // Giờ từ 12h trưa -> 12h đêm
  GIODATBAN: number[] = Array.from({ length: 12 }, (_, i) => i + 12);

  getFullDateTime(): Date | null {
    if (!this.selectedDate || this.selectedHour === null) return null;

    const [hour] = this.selectedHour.split(':');

    const NGAYDATBAN = new Date(this.selectedDate);
    NGAYDATBAN.setHours(Number(hour), 0, 0);

    return NGAYDATBAN;
  }

  selectTable(tableId: number) {
    this.selectedTableId = tableId;
    this.tryLoadKhungGio();
  }


  openQuickView() {

    // ❌ CHƯA ĐĂNG NHẬP
    if (!this.authService.isLoggedIn()) {
      this.showToast('Vui lòng đăng nhập để đặt bàn!', 'warn');
      return;
    }

    // ❌ CHƯA CHỌN BÀN
    if (!this.selectedTableId) {
      this.showToast('Vui lòng chọn bàn trước khi đặt!', 'warn');
      return;
    }

    // ❌ CHƯA CHỌN NGÀY
    if (!this.selectedDate) {
      this.showToast('Vui lòng chọn ngày đặt bàn!', 'warn');
      return;
    }

    // ❌ CHƯA CHỌN GIỜ (check NULL, không dùng !selectedHour)
    if (this.selectedHour === null) {
      this.showToast('Vui lòng chọn giờ đặt bàn!', 'warn');
      return;
    }


    // ================== OK → MỞ DIALOG ==================
    const dialogRef = this.dialog.open(BookingDialog, {
      width: '900px',
      maxWidth: '95vw',
      maxHeight: '95vh',
      panelClass: 'custom-dialog',
      autoFocus: false,
      data: {
        ngay: this.selectedDate,
        gio: this.selectedHour,
        table: this.BanAn.find(t => t.ma_ban === this.selectedTableId)
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (!result) {
        this.showToast('Bạn đã hủy đặt bàn', 'warn');
        return;
      }

      const user = this.authService.getUser();

      const payload = {
        ten_khach_hang: result.ten_khach_hang ?? user?.ho_ten,
        email: user?.email,
        sdt: result.sdt ?? user?.sdt,
        ghi_chu: result.ghi_chu,
        ma_ban_an: this.selectedTableId,
        ngay: result.ngay,
        gio: result.gio
      };

      this.QuanLyDatBanService.TaoDatBan(payload).subscribe({
        next: () => {
          this.showToast('Đặt bàn thành công!', 'success');

          this.selectedHour = null;

          if (this.selectedDate && this.selectedTableId) {
            this.loadKhungGio(
              this.formatDate(this.selectedDate),
              this.selectedTableId
            );
          }

          this.loadBanAn();
        },
        error: err => {
          console.error(err);
          this.showToast(err?.error?.error || 'Đặt bàn thất bại!', 'error');
        }
      });
    });
  }

  onDateChange(date: Date) {
    this.selectedDate = date;

    if (this.selectedTableId) {
      this.updateKhungGio();
    }
  }

  chonGio(gio: string, daDat: boolean, quaGio: boolean) {
    if (daDat || quaGio) return;
    this.selectedHour = gio;
  }

  formatDate(date: Date): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  trackByTable(index: number, item: any) {
    return item.ma_ban;
  }

  get selectedTable() {
    return this.BanAn.find(b => b.ma_ban === this.selectedTableId);
  }

  

  ngOnDestroy() {
    this.wsService.disconnect();
  }

}
