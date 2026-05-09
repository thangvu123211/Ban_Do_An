import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
@Injectable({
  providedIn: 'root'
})
export class QuanLyNhanVienService {


  constructor(private http: HttpClient) { }

  /** 🔹 Lấy token từ localStorage để dùng cho API cần xác thực */
  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    return new HttpHeaders({
      'Authorization': `Bearer ${token || ''}`
    });
  }

  /** 🟩 Lấy danh sách tất cả nhân viên (có token) */
  LayTatCaNhanVien(): Observable<any> {
    return this.http.get(`${environment.apiUrl}/nhanvien/layTatCa`, {headers: this.getAuthHeaders()});
  }

  /** 🟩 Lấy nhân viên theo ID (có token) */
  LayNhanVienTheoID(ma_nguoi_dung: number): Observable<any> {
    return this.http.get(`${environment.apiUrl}/nhanvien/layRaThongTinNhanVien/${ma_nguoi_dung}`, {
      headers: this.getAuthHeaders()
    });
  }

  /** 🟩 Thêm nhân viên (có token) */
  ThemNhanVien(formData: FormData): Observable<any> {
    return this.http.post(`${environment.apiUrl}/nhanvien/create`, formData, {
      headers: this.getAuthHeaders()
    });
  }

  /** 🟩 Xóa nhân viên (có token) */
  XoaNhanVien(ma_nguoi_dung: number): Observable<any> {
    return this.http.delete(`${environment.apiUrl}/nhanvien/delete/${ma_nguoi_dung}`, {
      headers: this.getAuthHeaders()
    });
  }

  /** 🟩 Cập nhật thông tin nhân viên (có token) */
  CapNhatNhanVien(ma_nguoi_dung: number, userData: any, selectedFile?: File): Observable<any> {
    const formData = new FormData();

    // Gán tất cả trường, bao gồm mat_khau nếu có
    Object.entries(userData).forEach(([key, value]) => {
      if (value !== null && value !== undefined) {
        formData.append(key, value as string);
      }
    });

    // Nếu có ảnh mới, thêm vào formData
    if (selectedFile) {
      formData.append('image', selectedFile);
    }

    return this.http.patch(`${environment.apiUrl}/nhanvien/update/${ma_nguoi_dung}`, formData, {
      headers: this.getAuthHeaders()
    });
  }
}
