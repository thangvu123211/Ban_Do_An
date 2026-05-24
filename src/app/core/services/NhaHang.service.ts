import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
@Injectable({
  providedIn: 'root'
})
export class NhaHangService {
 // đổi theo backend

  constructor(private http: HttpClient) {}

  // ========================
  // HEADER CÓ TOKEN
  // ========================
  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('access_token');
    return new HttpHeaders({
      Authorization: `Bearer ${token}`
    });
  }

  // ========================
  // LẤY TẤT CẢ NHÀ HÀNG
  // GET /nha-hang/all
  // ========================
  getAllNhaHang(): Observable<any> {
    return this.http.get(`${environment.apiUrl}/nha-hang/all`);
  }

  // ========================
  // LẤY NHÀ HÀNG THEO USER
  // GET /nha-hang/user
  // ========================
  getNhaHangByUser(): Observable<any> {
    return this.http.get(`${environment.apiUrl}/nha-hang/user`);
  }

  // ========================
  // LẤY CHI TIẾT NHÀ HÀNG
  // GET /nha-hang/:id
  // ========================
  getNhaHangById(id: number): Observable<any> {
    return this.http.get(`${environment.apiUrl}/nha-hang/${id}`);
  }

  // ========================
  // TẠO NHÀ HÀNG (CÓ ẢNH)
  // POST /nha-hang/create
  // ========================
  createNhaHang(data: any, image?: File): Observable<any> {
    const formData = new FormData();

    formData.append('ten_nha_hang', data.ten_nha_hang);
    formData.append('trang_thai', data.trang_thai);
    formData.append('dia_chi', data.dia_chi);
    formData.append('so_tai_khoan', data.so_tai_khoan);
    formData.append('ngan_hang', data.ngan_hang);
    formData.append('ten_nguoi_nhan', data.ten_nguoi_nhan);

    if (image) {
      formData.append('image', image);
    }

    return this.http.post(`${environment.apiUrl}/nha-hang/create`, formData, {
      headers: this.getAuthHeaders()
    });
  }

  // ========================
  // UPDATE NHÀ HÀNG
  // PATCH /nha-hang/update/:id
  // ========================
  updateNhaHang(id: number, data: any, image?: File): Observable<any> {
    const formData = new FormData();

    if (data.ten_nha_hang) {
      formData.append('ten_nha_hang', data.ten_nha_hang);
    }
    if (data.dia_chi) {
      formData.append('dia_chi', data.dia_chi);
    }
    if (data.trang_thai !== undefined) {
      formData.append('trang_thai', data.trang_thai);
    }
    if (data.so_tai_khoan) {
      formData.append('so_tai_khoan', data.so_tai_khoan);
    }
    if (data.ngan_hang) {
      formData.append('ngan_hang', data.ngan_hang);
    }
    if (data.ten_nguoi_nhan) {
      formData.append('ten_nguoi_nhan', data.ten_nguoi_nhan);
    }

    if (image) {
      formData.append('image', image);
    }

    return this.http.patch(`${environment.apiUrl}/nha-hang/update/${id}`, formData, {
      headers: this.getAuthHeaders()
    });
  }

  // ========================
  // XÓA NHÀ HÀNG
  // DELETE /nha-hang/delete/:id
  // ========================
  deleteNhaHang(id: number): Observable<any> {
    return this.http.delete(`${environment.apiUrl}/nha-hang/delete/${id}`, {
      headers: this.getAuthHeaders()
    });
  }
}