// goi-mon.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment.prod';
import { map } from 'rxjs/operators';

export interface MonOrder {
  ma_mon_an: number;
  so_luong: number;
  ghi_chu?: string;
}

export interface DatHoaDonRequest {
  ho_ten: string;
  sdt: string;
  dia_chi: string;
  ghi_chu?: string;
  mon_ans: MonOrder[];
}

@Injectable({
  providedIn: 'root'
})
export class HoaDonService {

  constructor(private http: HttpClient) { }

  // ================= THÊM HÓA ĐƠN (BẠN CẦN CÁI NÀY) =================
  taoHoaDon(data: DatHoaDonRequest): Observable<any> {
    return this.http.post(
      `${environment.apiUrl}/hoa-don`,
      data
    );
  }

  getAllHoaDon(): Observable<any[]> {
    return this.http
      .get<any>(`${environment.apiUrl}/hoa-don`)
      .pipe(
        map(res => res.data) // 🔥 LẤY ĐÚNG data
      );
  }

  // 🔹 Lấy hóa đơn theo ID
  getHoaDonById(id: number): Observable<any> {
    return this.http.get<any>(`${environment.apiUrl}/${id}`);
  }

  // 🔹 Lấy hóa đơn theo trạng thái
  getHoaDonByTrangThai(trangThai: string): Observable<any[]> {
    return this.http.get<any[]>(`${environment.apiUrl}/hoa-don/trang-thai?trang_thai=${trangThai}`);
  }

  // 🔹 Cập nhật trạng thái hóa đơn
  updateTrangThai(id: number, trangThai: string): Observable<any> {
    return this.http.put(
      `${environment.apiUrl}/hoa-don/${id}/trang-thai`,
      { trang_thai: trangThai }
    );
  }

  // 🔹 Hủy hóa đơn
  huyHoaDon(id: number): Observable<any> {
    return this.http.put(`${environment.apiUrl}/${id}/hoa-don/huy`, {});
  }

  // 🔹 Xóa hóa đơn
  xoaHoaDon(id: number): Observable<any> {
    return this.http.delete(`${environment.apiUrl}/hoa-don/${id}`);
  }

  //LayHoaDonCuaNguoiDung
  getHoaDonCuaUser(): Observable<any> {
    return this.http.get<any>(
      `${environment.apiUrl}/hoa-don/user`
    );
  }

  updateHoaDon(id: number, data: {
    ho_ten: string;
    sdt: string;
    dia_chi: string;
    ghi_chu?: string;
  }): Observable<any> {
    return this.http.put(
      `${environment.apiUrl}/hoa-don/${id}`,
      data
    );
  }

  huyThanhToan(id: number) {
    return this.http.put(`${environment.apiUrl}/hoa-don/${id}/huy_thanh_toan`, {});
  }

  getHoaDonChoThanhToan(): Observable<any> {
    const token = localStorage.getItem('token');

    return this.http.get(`${environment.apiUrl}/hoa-don/cho-thanh-toan`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
  }
  

  getHoaDonByShipper(): Observable<any[]> {
    return this.http
      .get<any>(`${environment.apiUrl}/ship`)
      .pipe(
        map(res => res.data) // 🔥 LẤY ĐÚNG data
      );
  }
  getALLHoaDonByShipper(): Observable<any[]> {
    return this.http
      .get<any>(`${environment.apiUrl}/ship/all-hoa-don`)
      .pipe(
        map(res => res.data) // 🔥 LẤY ĐÚNG data
      );
  }

  getALLHoaDontheoNgay(): Observable<any[]> {
    return this.http
      .get<any>(`${environment.apiUrl}/hoa-don/lay-hoa-don-theo-ngay`)
      .pipe(
        map(res => res.data) // 🔥 LẤY ĐÚNG data
      );
  }
}