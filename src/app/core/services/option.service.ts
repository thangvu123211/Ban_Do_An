import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment.prod';
@Injectable({
  providedIn: 'root'
})
export class OptionService {

  // ⚠️ đổi nếu backend khác port

  constructor(private http: HttpClient) {}

  /* ================== NHÓM OPTION ================== */

  // Tạo nhóm option
  createNhomOption(payload: {
    ma_mon_an: number;
    ten_nhom: string;
    bat_buoc: boolean;
    chon_nhieu: boolean;
    so_luong_toi_da: number;
    so_luong_toi_thieu: number;
  }): Observable<any> {
    return this.http.post(`${environment.apiUrl}/option/nhom`, payload);
  }

  // Lấy tất cả nhóm option
  getAllNhomOption(): Observable<any> {
    return this.http.get(`${environment.apiUrl}/option/nhom`);
  }

  // Lấy nhóm option theo ID
  getNhomOptionById(id: number): Observable<any> {
    return this.http.get(`${environment.apiUrl}/option/nhom/${id}`);
  }

  // Cập nhật nhóm option
  updateNhomOption(id: number, payload: any): Observable<any> {
    return this.http.put(`${environment.apiUrl}/option/nhom/${id}`, payload);
  }

  // Xoá nhóm option
  deleteNhomOption(id: number): Observable<any> {
    return this.http.delete(`${environment.apiUrl}/option/nhom/${id}`);
  }

  /* ================== OPTION ITEM ================== */

  // Tạo option item
  createOptionItem(payload: {
    ma_nhom_option: number;
    ten_option: string;
    gia_them: number;
  }): Observable<any> {
    return this.http.post(`${environment.apiUrl}/option/item`, payload);
  }

  // Lấy tất cả option item
  getAllOptionItem(): Observable<any> {
    return this.http.get(`${environment.apiUrl}/option/item`);
  }

  // Lấy option item theo ID
  getOptionItemById(id: number): Observable<any> {
    return this.http.get(`${environment.apiUrl}/option/item/${id}`);
  }

  // Cập nhật option item
  updateOptionItem(id: number, payload: any): Observable<any> {
    return this.http.put(`${environment.apiUrl}/option/item/${id}`, payload);
  }

  // Xoá option item
  deleteOptionItem(id: number): Observable<any> {
    return this.http.delete(`${environment.apiUrl}/option/item/${id}`);
  }
}