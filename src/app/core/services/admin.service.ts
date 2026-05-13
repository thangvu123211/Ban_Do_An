import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
@Injectable({
  providedIn: 'root'
})
export class AdminService {


  private adminInfoSource = new BehaviorSubject<any>(null);
  adminInfo$ = this.adminInfoSource.asObservable();

  constructor(private http: HttpClient) { }

  /** 🔹 Lấy token từ localStorage để thêm vào Header */
  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    return new HttpHeaders({
      'Authorization': `Bearer ${token || ''}`
    });
  }

  /** 🟢 Cập nhật thông tin admin hiện tại trong BehaviorSubject */
  setAdminInfo(admin: any) {
    this.adminInfoSource.next(admin);
  }

  /** 🟩 Lấy thông tin admin theo ID (có xác thực) */
  Laythongtinadmin(id: number): Observable<any> {
    return this.http.get<any>(`${environment.apiUrl}/nhanvien/layRaThongTinNhanVien/${id}`, {
      headers: this.getAuthHeaders()
    });
  }

  /** 🟩 Lấy nhân viên theo ID (có xác thực) */
  LayNhanVienTheoID(ma_nguoi_dung: number): Observable<any> {
    return this.http.get(`${environment.apiUrl}/nhanvien/layRaThongTinNhanVien/${ma_nguoi_dung}`, {
      headers: this.getAuthHeaders()
    });
  }

  /** 🟩 Cập nhật thông tin nhân viên (có xác thực + có ảnh) */
  CapNhatNhanVien(ma_nguoi_dung: number, userData: any, selectedFile?: File): Observable<any> {
    const formData = new FormData();

    Object.entries(userData).forEach(([key, value]) => {
      if (value !== null && value !== undefined) {
        formData.append(key, value as string);
      }
    });

    if (selectedFile) formData.append('image', selectedFile);

    return this.http.patch(`${environment.apiUrl}/nhanvien/update/${ma_nguoi_dung}`, formData, {
      headers: this.getAuthHeaders()
    });
  }


  


}
