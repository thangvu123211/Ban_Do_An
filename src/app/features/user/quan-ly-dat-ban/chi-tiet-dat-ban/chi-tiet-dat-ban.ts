import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { QuanLyBanAnService } from '../../../../core/services/QuanLyBanAn.service';
import { QuanLyDatBanService } from '../../../../core/services/QuanLyDatBan.service';
import { MATERIAL } from '../../../../Shared/material';
import { ToastMessageComponent } from '../../../../Shared/toasts_message/toast-message/toast-message';

@Component({
  selector: 'app-chi-tiet-dat-ban',
  imports: [MATERIAL,ToastMessageComponent],
  templateUrl: './chi-tiet-dat-ban.html',
  styleUrl: './chi-tiet-dat-ban.scss'
})
export class ChiTietDatBan implements OnInit {

  BanAnMap: { [key: number]: string } = {};

  constructor(
    public dialogRef: MatDialogRef<ChiTietDatBan>,
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

  
  close(): void {
    this.dialogRef.close();
  }
  ngOnInit(): void {
    this.loadBanAnMap();
  }
}