import { Component } from '@angular/core';
import { AuthService } from '../../core/services/auth.service';
import { MATERIAL } from '../../Shared/material';
import { Router } from '@angular/router';
import { ToastMessageComponent } from '../../Shared/toasts_message/toast-message/toast-message';

@Component({
  selector: 'app-forgot-password',
  imports: [MATERIAL, ToastMessageComponent],
  templateUrl: './forgot-password.html',
  styleUrl: './forgot-password.scss'
})
export class ForgotPassword {
  step: number = 1; // 1 = nhập email, 2 = nhập OTP + mật khẩu

  email = '';
  otp = '';
  newPassword = '';
  loadingSendOtp = false;

  toast = {
    show: false,
    message: '',
    type: 'success' as 'success' | 'warn' | 'error'
  };

  constructor(
    private authService: AuthService,
    private router: Router) { }

  showToast(message: string, type: 'success' | 'warn' | 'error') {
    this.toast.show = true;
    this.toast.message = message;
    this.toast.type = type;
    setTimeout(() => (this.toast.show = false), 3000);
  }

  // STEP 1: gửi OTP
  // STEP 1: gửi OTP
  sendOtp() {
    if (!this.email) {
      this.showToast('Vui lòng nhập email', 'warn');
      return;
    }

    this.loadingSendOtp = true;

    this.authService.sendOtp(this.email).subscribe({
      next: () => {
        this.showToast('Đã gửi OTP về email', 'success');
        this.step = 2;
        this.loadingSendOtp = false;
      },
      error: (err) => {
        this.showToast(err.error?.error || 'Lỗi gửi OTP', 'error');
        this.loadingSendOtp = false;
      }
    });
  }

  // STEP 2: reset password
  resetPassword() {
    if (!this.otp || !this.newPassword) {
      this.showToast('Vui lòng nhập đầy đủ thông tin', 'warn');
      return;
    }

    this.authService.resetPassword({
      email: this.email,
      otp: this.otp,
      mat_khau_moi: this.newPassword
    }).subscribe({
      next: () => {
        this.showToast('Đổi mật khẩu thành công', 'success');

        this.step = 1;
        this.email = '';
        this.otp = '';
        this.newPassword = '';
      },
      error: (err) => {
        this.showToast(err.error?.error || 'Lỗi reset mật khẩu', 'error');
      }
    });
  }
  goToLogin() {
    this.router.navigate(['/login']);
  }
}
