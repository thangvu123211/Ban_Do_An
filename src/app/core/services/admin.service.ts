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

  LayDoanhThuNgay(ngay?: string): Observable<any> {

    let url = `${environment.apiUrl}/hoa-don/doanh-thu-ngay`;

    if (ngay) {
      url += `?ngay=${ngay}`; // yyyy-mm-dd
    }

    return this.http.get(url, {
      headers: this.getAuthHeaders()
    });
  }

  exportExportDoanhThuNgay(ngay?: string) {
    let url = `${environment.apiUrl}/hoa-don/export-doanh-thu-ngay`;

    if (ngay) {
      url += `?ngay=${ngay}`;
    }

    return this.http.get(url, {
      headers: this.getAuthHeaders(),
      responseType: 'blob' // ⭐ quan trọng để download file Excel
    });
  }

  LayDanhSachNgayDoanhThu() {
    return this.http.get<any>(
      `${environment.apiUrl}/hoa-don/danh-sach-doanh-thu-ngay`,
      { headers: this.getAuthHeaders() }
    );
  }

  getDoanhThuThang(thang: number, nam: number) {
    return this.http.get<any>(
      `${environment.apiUrl}/hoa-don/doanh-thu-thang?thang=${thang}&nam=${nam}`,
      { headers: this.getAuthHeaders() }
    );
  }

  getDoanhThuNam(nam: number) {
    return this.http.get<any>(
      `${environment.apiUrl}/hoa-don/doanh-thu-nam?nam=${nam}`,
      { headers: this.getAuthHeaders() }
    );
  }

  getTiLeHoanThanhHomNay() {
    return this.http.get<any>(`${environment.apiUrl}/hoa-don/ti-le-hoan-thanh-hom-nay`);
  }

  getTopMonBanChay(limit = 9) {
    return this.http.get<any[]>(`${environment.apiUrl}/hoa-don/top-mon-ban-chay-nhat?limit=${limit}`
    );
  }
  getSoDonTheoNgay() {
    return this.http.get<any[]>(
      `${environment.apiUrl}/hoa-don/so-don-theo-ngay`
    );
  }
  getDonDaGiaoHomNay() {
    return this.http.get<any[]>(
      `${environment.apiUrl}/hoa-don/don-da-giao-hom-nay`
    );
  }
  assignShipper(maHoaDon: number, maShipper: number) {
    return this.http.post(`${environment.apiUrl}/nhanvien/assign-shipper`, {
      ma_hoa_don: maHoaDon,
      ma_shipper: maShipper
    });
  }
}
