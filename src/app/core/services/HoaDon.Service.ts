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

  constructor(private http: HttpClient) {}



  // ================= THÊM HÓA ĐƠN (BẠN CẦN CÁI NÀY) =================
  taoHoaDon(data: DatHoaDonRequest): Observable<any> {
    return this.http.post(
      `${environment.apiUrl}/hoa-don`,
      data
    );
  }
}