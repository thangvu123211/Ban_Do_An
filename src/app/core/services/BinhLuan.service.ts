import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class BinhLuanService {

  constructor(private http: HttpClient) { }

  getByMonAn(maMonAn: number) {
    return this.http.get(`${environment.apiUrl}/binh-luan/mon-an/${maMonAn}`);
  }

  create(data: any) {
    return this.http.post(`${environment.apiUrl}/binh-luan`, data);
  }

  reply(data: any) {
    return this.http.post(`${environment.apiUrl}/binh-luan`, data);
  }

  update(id: number, data: any) {
    return this.http.put(`${environment.apiUrl}/binh-luan/${id}`, data);
  }

  delete(id: number) {
    return this.http.delete(`${environment.apiUrl}/binh-luan/${id}`);
  }

  getAllBinhLuanByNguoiDung(maMonAn: number): Observable<any> {
    return this.http.get(`${environment.apiUrl}/binh-luan/get-all-binh-luan-by-nguoi-dung`, { params: { ma_mon_an: maMonAn } });
  }

  updateBinhLuan(id: number, data: { noi_dung: string }) {
    return this.http.put(
      `${environment.apiUrl}/binh-luan/${id}`,
      data
    );
  }
}