import { Component, OnInit, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { MatDialog } from '@angular/material/dialog';

// Import dialog
import { BookingDialog } from '../../../features/guest/dialogs/booking-dialog/booking-dialog';
import { ToastMessageComponent } from '../../../Shared/toasts_message/toast-message/toast-message';
import { QuanLyBanAnService } from '../../../core/services/QuanLyBanAn.service';
import { MATERIAL } from '../../../Shared/material';
import { MatPaginatorIntl } from '@angular/material/paginator';
import { AuthService } from '../../../core/services/auth.service';
import { QuanLyDatBanService } from '../../../core/services/QuanLyDatBan.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-dat-ban',
  standalone: true,
  imports: [
    MATERIAL,
    ToastMessageComponent
  ],
  templateUrl: './dat-ban.html',
  styleUrls: ['./dat-ban.scss']
})
export class DatBan implements OnInit {
  BanAn: any[] = [];
  selectedDate: Date | null = null;
  selectedHour: number | null = null;
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

  constructor(
    private http: HttpClient,
    private dialog: MatDialog,
    private QuanLyBanAnService: QuanLyBanAnService,
    private QuanLyDatBanService: QuanLyDatBanService,
    private authService: AuthService,
    private router: Router
  ) { }



  ngOnInit(): void {
    this.loadBanAn();
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    this.minDate = today;
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

  // Giờ từ 12h trưa -> 12h đêm
  GIODATBAN: number[] = Array.from({ length: 12 }, (_, i) => i + 12);

  getFullDateTime(): Date | null {
    if (!this.selectedDate || this.selectedHour === null) return null;

    const NGAYDATBAN = new Date(this.selectedDate);
    NGAYDATBAN.setHours(this.selectedHour, 0, 0);
    return NGAYDATBAN;
  }

  selectTable(tableId: number) {
    this.selectedTableId = tableId;
  }

  openQuickView() {
    // ✅ check đăng nhập
    if (!this.authService.isLoggedIn()) {
      this.showToast('Vui lòng đăng nhập để đặt bàn!', 'warn');
      this.router.navigate(['/login']);
      return;
    }

    if (!this.selectedTableId || !this.selectedDate || this.selectedHour === null) {
      this.showToast('Vui lòng chọn bàn, ngày và giờ trước khi đặt bàn!', 'warn');
      return;
    }

    const dialogRef = this.dialog.open(BookingDialog, {
      width: '900px',          // desktop
      maxWidth: '95vw',        // mobile không tràn
      maxHeight: '95vh',       // không che nút
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
          this.selectedTableId = null;
          this.selectedDate = null;
          this.selectedHour = null;
          this.loadBanAn();
        },
        error: err => {
          console.error(err);
          this.showToast(err?.error?.error || 'Đặt bàn thất bại!', 'error');
        }
      });
    });
  }



}
