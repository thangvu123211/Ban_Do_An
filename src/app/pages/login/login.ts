import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { ToastMessageComponent } from '../../Shared/toasts_message/toast-message/toast-message';
import { AuthService } from '../../core/services/auth.service';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MATERIAL } from '../../Shared/material';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    MATERIAL,
    ToastMessageComponent,
    ReactiveFormsModule,
  ],
  templateUrl: './login.html',
  styleUrls: ['./login.scss']
})
export class LoginComponent {
  loginForm: FormGroup;
  toast = {
    show: false,
    message: '',
    type: 'success' as 'success' | 'warn' | 'error'
  };

  constructor(
    private fb: FormBuilder,
     private router: Router, 
     private http: HttpClient,
      private authService: AuthService

    ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
      showPassword: [false]
    });
  }

  showToast(message: string, type: 'success' | 'warn' | 'error') {
    this.toast.show = true;
    this.toast.message = message;
    this.toast.type = type;
    setTimeout(() => this.toast.show = false, 3000);
  }

  onSubmit() {
    // 1️⃣ Kiểm tra validation client-side
    if (this.loginForm.invalid) {
      if (this.loginForm.get('email')?.hasError('required')) {
        this.showToast('Vui lòng nhập email!', 'warn');
        return;
      }
      if (this.loginForm.get('email')?.hasError('email')) {
        this.showToast('Email không hợp lệ!', 'warn');
        return;
      }
      if (this.loginForm.get('password')?.hasError('required')) {
        this.showToast('Vui lòng nhập mật khẩu!', 'warn');
        return;
      }
      if (this.loginForm.get('password')?.hasError('minlength')) {
        this.showToast('Mật khẩu phải ít nhất 6 ký tự!', 'warn');
        return;
      }
    }

    // 2️⃣ Chuẩn bị dữ liệu gửi lên backend
    const data = {
      email: this.loginForm.value.email,
      password: this.loginForm.value.password
    };

    // 3️⃣ Gọi authService.login()
    this.authService.login(data).subscribe({
      next: (res: any) => {
        this.authService.redirectByRole(res.role);
        //location.reload();
      },
      error: (err: any) => {
        console.error('❌ Lỗi đăng nhập:', err);

        // 4️⃣ Lấy thông báo lỗi từ backend
        const message = err.error?.error || 'Đăng nhập thất bại';
        this.showToast(message, 'error');
      }
    });
  }

  goToRegister() {
    this.router.navigate(['/register']);
  }
}