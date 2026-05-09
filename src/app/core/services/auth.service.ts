import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { Router } from '@angular/router';
import { environment } from '../../../environments/environment.prod';



@Injectable({
  providedIn: 'root'
})
export class AuthService {


  constructor(private http: HttpClient, private router: Router) { }

  // 🔹 Đăng nhập
  login(data: any): Observable<any> {
    return this.http.post(`${environment.apiUrl}/login`, data).pipe(
      tap((res: any) => {
        if (res.token) {
          localStorage.setItem('token', res.token);

          localStorage.setItem('role', res.role || '');

          // 🔥 lưu full user
          localStorage.setItem('user', JSON.stringify(res.data));

          // 🔥 FIX QUAN TRỌNG: lưu user id riêng
          localStorage.setItem(
            'ma_nguoi_dung',
            res.data?.ma_nguoi_dung || res.data?.id
          );
        }
      })
    );
  }



  // 🔹 Đăng ký
  register(data: any): Observable<any> {
    return this.http.post(`${environment.apiUrl}/register`, data);
  }

  // 🔹 Lưu token thủ công (nếu cần)
  saveToken(token: string) {
    localStorage.setItem('token', token);
  }

  // 🔹 Lấy token hiện tại
  getToken() {
    return localStorage.getItem('token');
  }

  // 🔹 Lấy thông tin user
  getUser() {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  }


  // 🔹 Lấy vai trò hiện tại
  getRole(): string | null {
    return localStorage.getItem('role');
  }

  // 🔹 Kiểm tra đã đăng nhập hay chưa
  isLoggedIn(): boolean {
    return !!localStorage.getItem('token');
  }

  // 🔹 Đăng xuất
  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('role');
    this.router.navigate(['/login']);
  }

  // 🔹 Chuyển hướng theo role
  redirectByRole(role: string) {
    role = role?.toLowerCase();
    if (role === 'admin') {
      this.router.navigate(['/admin']);
    } else if (role === 'user') {
      this.router.navigate(['/user']);
    } else {
      this.router.navigate(['/login']);
    }
  }
}
