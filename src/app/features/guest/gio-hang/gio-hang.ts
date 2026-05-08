import { Component, OnInit } from "@angular/core";
import { MatDialogRef } from "@angular/material/dialog";
import { CartService } from "../../../core/services/cart.service";
import { MATERIAL } from "../../../Shared/material";
import { ToastMessageComponent } from "../../../Shared/toasts_message/toast-message/toast-message";

@Component({
  selector: 'gio-hang',
  standalone: true,
  imports: [MATERIAL, ToastMessageComponent],
  templateUrl: './gio-hang.html',
  styleUrl: './gio-hang.scss'
})
export class GioHang implements OnInit {

  gioHang: any[] = [];
  tongTien = 0;

  toast = {
    show: false,
    message: '',
    type: 'success' as 'success' | 'warn' | 'error'
  };

  constructor(
    private dialogRef: MatDialogRef<GioHang>,
    private cartService: CartService
  ) {}

  ngOnInit() {
    this.cartService.gioHang$.subscribe(gio => {
      this.gioHang = gio;
      this.tinhTong();

      // 🔥 GIỎ TRỐNG → ĐÓNG LUÔN
      if (gio.length === 0) {
        this.dialogRef.close();
      }
    });
  }

  tangSoLuong(item: any) {
    this.cartService.tangSoLuong(item);
  }

  giamSoLuong(item: any) {
    this.cartService.giamSoLuong(item);
  }

  removeFromGioHang(item: any) {
    this.cartService.removeItem(item);
  }

  tinhTong() {
    this.tongTien = this.gioHang.reduce(
      (s, i) => s + i.soLuong * i.gia_tien,
      0
    );
  }

  get tongSoMon(): number {
  return this.gioHang.reduce((sum, item) => sum + item.soLuong, 0);
}

  close() {
    this.dialogRef.close();
  }
}