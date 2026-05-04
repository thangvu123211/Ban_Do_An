import { Component, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { MATERIAL } from '../../../../Shared/material';
import { CartService } from '../../../../core/services/cart.service';
import { GioHang } from '../../../../features/customer/gio-hang/gio-hang';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [MATERIAL, RouterLink],
  templateUrl: './header.html',
  styleUrls: ['./header.scss']
})
export class HeaderComponent implements OnInit {

  tongSoMon = 0;

  constructor(
    private router: Router,
    private cartService: CartService,
    private dialog: MatDialog,
  ) {}

  ngOnInit(): void {
    this.cartService.tongSoMon$.subscribe(value => {
      this.tongSoMon = value;
    });
  }

  goToHome() {
    this.router.navigate(['/']);
  }

  goToDatBan() {
    this.router.navigate(['/datban']);
  }

  moGioHang() {
    const gioHang = this.cartService.getGioHang();

    if (!gioHang.length) return;

    this.dialog.open(GioHang, {
      width: '90vw',
      maxWidth: '500px',
      maxHeight: '85vh',
      panelClass: 'gio-hang-dialog',
      data: {
        gioHang
      }
    });
  }

  goToUserPage() {
    const role = localStorage.getItem('role');

    if (role === 'guest') {
      this.router.navigate(['/account']);
    } else if (role === 'admin') {
      this.router.navigate(['/admin']);
    } else if (role === 'user') {
      this.router.navigate(['/user/XemHoaDon']);
    } else {
      this.router.navigate(['/login']);
    }
  }
}