// goi-mon.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment.prod';

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
    return this.http.get<any[]>(`${environment.apiUrl}/hoa-don`);
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
    return this.http.put(`${environment.apiUrl}/${id}/hoa-don/trang-thai`, {
      trang_thai: trangThai
    });
  }

  // 🔹 Hủy hóa đơn
  huyHoaDon(id: number): Observable<any> {
    return this.http.put(`${environment.apiUrl}/${id}/hoa-don/huy`, {});
  }

  // 🔹 Xóa hóa đơn
  xoaHoaDon(id: number): Observable<any> {
    return this.http.delete(`${environment.apiUrl}/hoa-don/${id}`);
  }
}