import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../core/services/auth.service';
import { ToastMessageComponent } from '../../Shared/toasts_message/toast-message/toast-message';
import { MATERIAL } from '../../Shared/material';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MatIconModule, MatButtonModule, ToastMessageComponent,MATERIAL],
  templateUrl: './register.html',
  styleUrls: ['./register.scss']
})
export class Register {
  registerForm: FormGroup;

  // ✅ Biến toast (giống login)
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
      sdt: ['', [Validators.required, Validators.pattern(/^\d{10,11}$/)]],
      matkhau: ['', [Validators.required, Validators.minLength(6)]],
      confirmMatkhau: ['', Validators.required]
    }, { validators: this.passwordMatchValidator });
  }

  passwordMatchValidator(control: AbstractControl): ValidationErrors | null {
    const password = control.get('matkhau');
    const confirm = control.get('confirmMatkhau');

    if (password && confirm && password.value !== confirm.value) {
      confirm.setErrors({ notMatched: true });
      return { notMatched: true };
    } else {
      confirm?.setErrors(null);
      return null;
    }
  }

  showToast(message: string, type: 'success' | 'warn' | 'error') {
    this.toast = { show: true, message, type };
    setTimeout(() => this.toast.show = false, 3000); // ẩn sau 3s
  }

  TaoTaiKhoan() {
    if (this.registerForm.invalid) {
      const controls = this.registerForm.controls;

      if (controls['hoten'].invalid) {
        this.showToast('Họ tên không được để trống và chỉ chứa chữ cái!', 'warn');
        return;
      }

      if (controls['email'].invalid) {
        this.showToast('Email không hợp lệ! Ví dụ: example@gmail.com', 'warn');
        return;
      }

      if (controls['matkhau'].invalid) {
        this.showToast('Mật khẩu tối thiểu 6 ký tự, gồm chữ hoa, thường, số và ký tự đặc biệt!', 'warn');
        return;
      }

      if (controls['confirmMatkhau'].invalid ||
        controls['matkhau'].value !== controls['confirmMatkhau'].value) {
        this.showToast('Mật khẩu xác nhận không khớp!', 'warn');
        return;
      }

      if (controls['sdt'].invalid) {
        this.showToast('Số điện thoại phải gồm 10-11 số, bắt đầu bằng 0!', 'warn');
        return;
      }
    }

    // ✅ Lấy giá trị từ form
    const { hoten, email, sdt, matkhau } = this.registerForm.value;

    // ✅ Đúng format backend Go đang yêu cầu
    const data = {
      name: hoten,
      email: email,
      password: matkhau,
      sdt: sdt
    };

    // ✅ Gọi API
    this.authService.register(data).subscribe({
      next: () => {
        // ✅ Không lấy message từ backend nữa → luôn hiển thị tiếng Việt
        this.showToast('Tạo tài khoản thành công!', 'success');
        
        setTimeout(() => this.router.navigate(['/login']), 1000);
      },
      error: (err) => {
        console.error(err);
        // ✅ Gọi lỗi tiếng Việt luôn
        this.showToast('Đăng ký thất bại! Email có thể đã tồn tại!', 'error');
      }
    });
  }


  goToLogin() {
    this.router.navigate(['/login']);
  }
}
