import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class BinhLuanService {

  constructor(private http: HttpClient) {}

  // lấy bình luận theo món
  getByMonAn(maMonAn: number) {
    return this.http.get(`${environment.apiUrl}/binh-luan/mon-an/${maMonAn}`);
  }

  // tạo bình luận
  create(data: any) {
    return this.http.post(`${environment.apiUrl}/binh-luan`, data);
  }

  // xoá
  delete(id: number) {
    return this.http.delete(`${environment.apiUrl}/binh-luan/${id}`);
  }
}