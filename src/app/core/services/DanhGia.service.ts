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
}