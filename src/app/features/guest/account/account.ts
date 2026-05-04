import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { HeaderComponent } from '../../../core/layouts/guest/header/header';
import { Footer } from '../../../core/layouts/guest/footer/footer';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { ToastMessageComponent } from '../../../Shared/toasts_message/toast-message/toast-message';
import { MATERIAL } from '../../../Shared/material';

@Component({
  selector: 'app-account',
  standalone: true,
  imports: [CommonModule, MatSidenavModule, MatIconModule, MatListModule, ToastMessageComponent , MATERIAL],
  templateUrl: './account.html',
  styleUrls: ['./account.scss']
})

export class Account {
  email = '';
  hoten = '';
  sdt='';
  dia_chi='';
  mat_khau='';
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
  constructor(private router: Router) {
    const token = localStorage.getItem('token');
    const user = localStorage.getItem('user');
    const role = localStorage.getItem('role');
    // nhận state từ navigate
    const nav = this.router.getCurrentNavigation();
    const state = nav?.extras.state as { message?: string; type?: string };

    if (state?.message) {
      this.toast = { show: true, message: state.message, type: state.type as any };
      setTimeout(() => this.toast.show = false, 3000);
    }

    if (token && user && role === 'guest') {
      const data = JSON.parse(user);
      this.email = data.email;
      this.hoten = data.ho_ten;
      this.sdt=data.sdt;
      this.dia_chi=data.dia_chi;
      this.mat_khau=data.mat_khau;
    } else {
      this.router.navigate(['/login']);
    }
  }

  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('role');
    this.router.navigate(['/login']);
  }
}
