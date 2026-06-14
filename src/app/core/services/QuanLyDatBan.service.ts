import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment.prod';

@Injectable({
  providedIn: 'root'
})
export class QuanLyDatBanService {

  constructor(private http: HttpClient) {}

  /** 🔹 Lấy token từ localStorage để thêm vào Header */
  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    return new HttpHeaders({
      Authorization: `Bearer ${token || ''}`
    });
  }

  /** 🟢 KHÁCH / USER: Tạo đặt bàn */
  TaoDatBan(data: any): Observable<any> {
    return this.http.post(
      `${environment.apiUrl}/dat-ban`,
      data,
      { headers: this.getAuthHeaders() }
    );
  }

  /** 🔵 ADMIN: Lấy danh sách đặt bàn */
  LayDanhSachDatBan(): Observable<any> {
    return this.http.get(
      `${environment.apiUrl}/dat-ban`,
    );
  }

  /** 🔵 ADMIN: Lấy chi tiết đặt bàn */
  LayDatBanTheoID(id: number): Observable<any> {
    return this.http.get(
      `${environment.apiUrl}/dat-ban/${id}`,
      { headers: this.getAuthHeaders() }
    );
  }

  /** 🟡 ADMIN: Cập nhật đặt bàn */
  CapNhatDatBan(id: number, data: any): Observable<any> {
    return this.http.put(
      `${environment.apiUrl}/dat-ban/${id}`,
      data,
      { headers: this.getAuthHeaders() }
    );
  }

  /** 🟣 NHÂN VIÊN: Xác nhận đặt bàn */
  XacNhanDatBan(id: number): Observable<any> {
    return this.http.put(
      `${environment.apiUrl}/dat-ban/${id}/xac-nhan`,
      {},
      { headers: this.getAuthHeaders() }
    );
  }

  /** 🔴 ADMIN: Xóa đặt bàn */
  XoaDatBan(id: number): Observable<any> {
    return this.http.delete(
      `${environment.apiUrl}/dat-ban/${id}`,
      { headers: this.getAuthHeaders() }
    );
  }

  LayDanhSachDatBanCuaNguoiDung(): Observable<any> {
    return this.http.get(
      `${environment.apiUrl}/dat-ban/lay-danh-sach-dat-ban-cua-nguoi-dung`,
    );
  }

  HuyDatBan(id: number): Observable<any> {
    return this.http.put(`${environment.apiUrl}/dat-ban/huy-dat-ban/${id}`, {});
  }
}
