// goi-mon.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment.prod';


@Injectable({
  providedIn: 'root'
})
export class DanhGiaService {

  constructor(private http: HttpClient) { }



  checkDanhGia(params: any) {
    return this.http.get<any>(`${environment.apiUrl}/danh-gia/check`, {
      params
    });
  }

  createDanhGia(data: any) {
    return this.http.post(`${environment.apiUrl}/danh-gia`, data);
  }

  getRatingByMon(): Observable<any> {
    return this.http.get(`${environment.apiUrl}/danh-gia/mon`);
  }

  getByMonAn(id: number): Observable<any> {
    return this.http.get(`${environment.apiUrl}/danh-gia/mon/${id}`);
  }

  getSoLuongDanhGia(): Observable<any> {
    return this.http.get(`${environment.apiUrl}/danh-gia/so_luong_danh_gia`);
  }

  delete(id: number) {
    return this.http.delete(`${environment.apiUrl}/danh-gia/${id}`);
  }
  AnDanhGia(id: number) {
    return this.http.put(
      `${environment.apiUrl}/danh-gia/an-danh-gia/${id}`,
      {}
    );
  }
  HienDanhGia(id: number) {
    return this.http.put(
      `${environment.apiUrl}/danh-gia/hien-danh-gia/${id}`,
      {}
    );
  }
  getAllDanhGiaByNguoiDung(maMonAn: number): Observable<any> {
    return this.http.get(`${environment.apiUrl}/danh-gia/get-all-danh-gia-by-nguoi-dung`, { params: { ma_mon_an: maMonAn } });
  }

  TatCaDanhGiaCuaAdmin(maMonAn: number): Observable<any> {
    return this.http.get(
      `${environment.apiUrl}/danh-gia/tat-ca-danh-gia/${maMonAn}`
    );
  }
  UpdateDanhGia(id: number, data: any) {
    return this.http.put(
      `${environment.apiUrl}/danh-gia/${id}`,
      data
    );
  }
}