import { Component, Inject, OnInit } from '@angular/core';
import { MATERIAL } from '../../../../Shared/material';
import { ToastMessageComponent } from '../../../../Shared/toasts_message/toast-message/toast-message';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { BookingDialog } from '../../../guest/dialogs/booking-dialog/booking-dialog';
import { QuanLyBanAnService } from '../../../../core/services/QuanLyBanAn.service';
import { QuanLyDatBanService } from '../../../../core/services/QuanLyDatBan.service';
import { error } from 'console';

@Component({
  selector: 'app-chi-tiet-khach-hang-dat-ban',
  imports: [MATERIAL, ToastMessageComponent],
  templateUrl: './chi-tiet-khach-hang-dat-ban.html',
  styleUrl: './chi-tiet-khach-hang-dat-ban.scss'
})
export class ChiTietKhachHangDatBan implements OnInit {

  BanAnMap: { [key: number]: string } = {};

  constructor(
    public dialogRef: MatDialogRef<BookingDialog>,
    private dialog: MatDialog,
    private quanlibanan: QuanLyBanAnService,
    private quanlidatban: QuanLyDatBanService,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
  }
  toast = {
    show: false,
    message: '',
    type: 'success' as 'success' | 'warn' | 'error'
  };

  showToast(message: string, type: 'success' | 'warn' | 'error') {
    this.toast.show = true;
    this.toast.message = message;
    this.toast.type = type;
    setTimeout(() => this.toast.show = false, 3000);
  }

  loadBanAnMap() {
    this.quanlibanan.LayTatCaBanAn().subscribe((res: any) => {
      if (Array.isArray(res.data)) {
        res.data.forEach((item: any) => {
          this.BanAnMap[item.ma_ban] = item.ten_ban;
        });
      }
    });
  }

  xacNhanDatBan() {
    console.log("DATA:", this.data);

    const id = this.data.id;

    if (!id) {
      this.showToast('Không tìm thấy id đặt bàn', 'error');
      return;
    }

    this.quanlidatban.XacNhanDatBan(id).subscribe({
      next: (res: any) => {
        console.log("SUCCESS", res);
        this.showToast('Xác nhận đặt bàn thành công', 'success');

        setTimeout(() => {
          this.dialogRef.close(true);
        }, 1000);
      },
      error: (err) => {
        console.error("API ERROR:", err);
        this.showToast('Xác nhận thất bại', 'error');
      }
    });
  }

  close(): void {
    this.dialogRef.close();
  }
  ngOnInit(): void {
    this.loadBanAnMap();
  }
}
