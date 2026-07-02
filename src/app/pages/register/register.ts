import { Component } from '@angular/core';
import { Router } from '@angular/router';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule
} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../core/services/auth.service';
import { ToastMessageComponent } from '../../Shared/toasts_message/toast-message/toast-message';
import { MATERIAL } from '../../Shared/material';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, ToastMessageComponent, MATERIAL],
  templateUrl: './register.html',
  styleUrls: ['./register.scss']
})
export class Register {

  registerForm: FormGroup;
  isLoading = false;
  isOtpLoading = false;

  step: number = 1;
  otp: string = '';
  pendingData: any = {};

  toast = {
    show: false,
    message: '',
    type: 'success' as 'success' | 'warn' | 'error'
  };

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private authService: AuthService
  ) {
    this.registerForm = this.fb.group({
      hoten: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      sdt: ['', [Validators.required, Validators.pattern(/^0\d{9}$/)]],
      matkhau: ['', [Validators.required, Validators.minLength(6)]],
      confirmMatkhau: ['', Validators.required]
    }, {
      validators: this.passwordMatchValidator,
      updateOn: 'change'
    });
  }

  // ✅ PASSWORD MATCH VALIDATOR (CHUẨN)
  passwordMatchValidator(group: any) {
    const pass = group.get('matkhau');
    const confirm = group.get('confirmMatkhau');

    if (!pass || !confirm) return null;

    const passValue = pass.value;
    const confirmValue = confirm.value;

    if (passValue !== confirmValue) {
      confirm.setErrors({ notMatched: true });
    } else {
      if (confirm.errors) {
        delete confirm.errors['notMatched'];
        if (Object.keys(confirm.errors).length === 0) {
          confirm.setErrors(null);
        }
      }
    }

    return null;
  }

  // ======================
  // TOAST
  // ======================
  showToast(message: string, type: 'success' | 'warn' | 'error') {
    this.toast = { show: true, message, type };
    setTimeout(() => this.toast.show = false, 3000);
  }

  // ======================
  // STEP 1: SEND OTP
  // ======================
  TaoTaiKhoan() {
    this.registerForm.markAllAsTouched();
    if (this.registerForm.invalid) return;

    this.isLoading = true;

    const { hoten, email, sdt, matkhau } = this.registerForm.value;

    this.pendingData = {
      ho_ten: hoten,
      email: email.trim().toLowerCase(),
      mat_khau: matkhau,
      so_dien_thoai: sdt
    };

    this.authService.registerSendOtp(this.pendingData).subscribe({
      next: () => {
        this.step = 2;
        this.showToast('Đã gửi OTP', 'success');
        this.isLoading = false;
      },
      error: (err) => {
        this.showToast(err.error?.error || 'Gửi OTP thất bại', 'error');
        this.isLoading = false;
      }
    });
  }

  // ======================
  // STEP 2: VERIFY OTP
  // ======================
  verifyOtp() {
    if (!this.otp) {
      this.showToast('Vui lòng nhập OTP', 'warn');
      return;
    }

    this.isOtpLoading = true;

    this.authService.verifyRegisterOtp({
      email: this.pendingData.email,
      otp: this.otp
    }).subscribe({
      next: () => {
        this.showToast('Đăng ký thành công', 'success');
        this.isOtpLoading = false;
        setTimeout(() => this.router.navigate(['/login']), 1000);
      },
      error: (err) => {
        this.showToast(err.error?.error || 'OTP sai hoặc hết hạn', 'error');
        this.isOtpLoading = false;
      }
    });
  }

  goToLogin() {
    this.router.navigate(['/login']);
  }
}