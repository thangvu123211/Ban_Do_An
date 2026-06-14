import { Component, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { MATERIAL } from '../../../../Shared/material';
import { CartService } from '../../../../core/services/cart.service';
import { GioHang } from '../../../../features/guest/gio-hang/gio-hang';
import { MatDialog } from '@angular/material/dialog';
import { ToastMessageComponent } from '../../../../Shared/toasts_message/toast-message/toast-message';
import { YeuThich } from '../../../../features/guest/yeu-thich/yeu-thich';
import { YeuThichService } from '../../../services/YeuThich.service';
import { Observable } from 'rxjs';


@Component({
  selector: 'app-header',
  standalone: true,
  imports: [MATERIAL, RouterLink, ToastMessageComponent],
  templateUrl: './header.html',
  styleUrls: ['./header.scss']
})


export class HeaderComponent implements OnInit {

  isMobileMenuOpen = false;

  cartBadgeCount = 0;
  tongYeuThich$!: Observable<number>;

  toast = {
    show: false,
    message: '',
    type: 'success' as 'success' | 'warn' | 'error'
  };

  isMobile = false;

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

    const token = localStorage.getItem('token');
    const userId = Number(localStorage.getItem('ma_nguoi_dung'));

    // ================= CART =================
    if (token && userId) {
      this.cartService.loadCountFromDB(userId);
    } else {
      this.cartService.saveLocal(this.cartService.getLocal());
    }

    this.cartService.count$.subscribe(count => {
      this.cartBadgeCount = count;
    });

    // ================= YEUTHICH =================
    this.tongYeuThich$ = this.yeuThichService.count$;

    if (token && userId) {
      this.cartService.loadCountFromDB(userId);
    } else {
      this.cartService.setCount(this.cartService.getLocal().reduce(
        (s: number, i: any) => s + (i.soLuong || 0),
        0
      ));
    }
    this.initYeuThich();
    this.checkScreen();

    window.addEventListener('resize', () => {
      this.checkScreen();
    });
  }
  go(path: string) {
    this.router.navigate([path]);
    this.isMobileMenuOpen = false;
  }

  closeMobileMenu() {
    this.isMobileMenuOpen = false;
  }

  initYeuThich() {
    const token = localStorage.getItem('token');
    const userId = Number(localStorage.getItem('ma_nguoi_dung'));

    if (!token) {
      const local = this.yeuThichService.getLocal();
      this.yeuThichService.setCount(local.length); // 🔥 quan trọng
      return;
    }

    this.yeuThichService.getByUser(userId).subscribe(res => {
      this.yeuThichService.setCount(res?.length || 0); // 🔥 quan trọng
    });
  }


  goToHome() {
    this.router.navigate(['/']);
  }

  goToDatBan() {
    this.router.navigate(['/datban']);
  }

  moGioHang() {
    this.router.navigate(['/gio_hang']);
  }
  checkScreen() {
    this.isMobile = window.innerWidth < 768; // md breakpoint Tailwind
  }

  moYeuThich() {
    const token = localStorage.getItem('token');
    const userId = Number(localStorage.getItem('ma_nguoi_dung'));

    // ❌ CHƯA LOGIN → LOCAL
    if (!token) {
      const list = this.yeuThichService.getLocal();

      if (list.length === 0) {
        this.showToast('Chưa có món yêu thích', 'warn');
        return;
      }

      this.dialog.open(YeuThich, {
        width: '85vw',
        maxWidth: '900px',
        height: '80vh',
        data: list
      });
      return;
    }

    // ✅ ĐÃ LOGIN → DB
    this.yeuThichService.getByUser(userId).subscribe((res: any) => {
      if (!res || res.length === 0) {
        this.showToast('Chưa có món yêu thích', 'warn');
        return;
      }

      this.dialog.open(YeuThich, {
        width: '85vw',
        maxWidth: '900px',
        height: '80vh',
        data: res
          .filter((x: any) => x.mon_an)
          .map((x: any) => x.mon_an)
      });
    });
  }

  goToUserPage() {
    const role = localStorage.getItem('role');

    if (role === 'admin') {
      this.router.navigate(['/admin']);
    } else if (role === 'user') {
      this.router.navigate(['/user']);
    } else if (role === 'shipper') {
      this.router.navigate(['/shipper']);
    } else {
      this.router.navigate(['/login']);
    }
  }
}