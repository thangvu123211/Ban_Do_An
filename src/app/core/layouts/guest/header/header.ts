import { Component, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { MATERIAL } from '../../../../Shared/material';
import { CartService } from '../../../../core/services/cart.service';
import { GioHang } from '../../../../features/guest/gio-hang/gio-hang';
import { MatDialog } from '@angular/material/dialog';
import { ToastMessageComponent } from '../../../../Shared/toasts_message/toast-message/toast-message';
import { YeuThichService } from '../../../services/YeuThich.service';
import { YeuThich } from '../../../../features/guest/yeu-thich/yeu-thich';


@Component({
  selector: 'app-header',
  standalone: true,
  imports: [MATERIAL, RouterLink, ToastMessageComponent],
  templateUrl: './header.html',
  styleUrls: ['./header.scss']
})


export class HeaderComponent implements OnInit {

  tongSoMon = 0;
  tongYeuThich = 0;

  toast = {
    show: false,
    message: '',
    type: 'success' as 'success' | 'warn' | 'error'
  };

  constructor(
    private router: Router,
    private cartService: CartService,
    private dialog: MatDialog,
    private yeuThichService: YeuThichService
  ) { }

  showToast(message: string, type: 'success' | 'warn' | 'error') {
    this.toast.show = true;
    this.toast.message = message;
    this.toast.type = type;
    setTimeout(() => (this.toast.show = false), 3000);
  }

  ngOnInit(): void {
    this.cartService.tongSoMon$.subscribe(value => {
      this.tongSoMon = value ?? 0;

    });
    this.yeuThichService.tongYeuThich$.subscribe(v => {
      this.tongYeuThich = v ?? 0;
    });
  }

  goToHome() {
    this.router.navigate(['/']);
  }

  goToDatBan() {
    this.router.navigate(['/datban']);
  }

  moGioHang() {
    const items = this.cartService.getItems();

    // ❌ Giỏ trống → báo toast, KHÔNG mở dialog
    if (!items || items.length === 0) {
      this.showToast('Không có gì trong giỏ hàng', 'warn');
      return;
    }

    // ✅ Có món → mở giỏ
    this.dialog.open(GioHang, {
      width: '85vw',
      maxWidth: '900px',
      height: '80vh',
      panelClass: 'gio-hang-dialog'
    });
  }

  moYeuThich() {
    const items = this.yeuThichService.getItems();

    // ❌ rỗng
    if (!items || items.length === 0) {
      this.showToast('Chưa có món nào trong yêu thích', 'warn');
      return;
    }

    // ✅ có dữ liệu → mở dialog
    this.dialog.open(YeuThich, {
      width: '85vw',
      maxWidth: '900px',
      height: '80vh',
      panelClass: 'yeu-thich-dialog',
      data: {
        items: items
      }
    });
  }

  goToUserPage() {
    const role = localStorage.getItem('role');

    if (role === 'admin') {
      this.router.navigate(['/admin']);
    } else if (role === 'user') {
      this.router.navigate(['/user']);
    } else {
      this.router.navigate(['/login']);
    }
  }
}