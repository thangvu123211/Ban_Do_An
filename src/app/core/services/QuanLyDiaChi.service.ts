import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment.prod';

@Injectable({
  providedIn: 'root'
})
export class DiaChiService {

  constructor(private http: HttpClient) { }

  private getHeaders() {
    const token = localStorage.getItem('token'); // nếu bạn dùng JWT
    return {
      headers: new HttpHeaders({
        'Authorization': `Bearer ${token}`
      })
    };
  }

  // Lấy danh sách địa chỉ theo user
  LayDiaChiTheoUser(ma_nguoi_dung: number): Observable<any> {
    return this.http.get(
      `${environment.apiUrl}/dia-chi/user/${ma_nguoi_dung}`,
      this.getHeaders()
    );
  }

  // Lấy chi tiết 1 địa chỉ
  LayDiaChiByID(id: number): Observable<any> {
    return this.http.get(
      `${environment.apiUrl}/dia-chi/${id}`,
      this.getHeaders()
    );
  }

  // Thêm địa chỉ
  ThemDiaChi(data: any): Observable<any> {
  return this.http.post(
    `${environment.apiUrl}/dia-chi/`,
    data,
    {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    }
  );
}

  // Cập nhật địa chỉ
  CapNhatDiaChi(id: number, data: any): Observable<any> {
    return this.http.patch(
      `${environment.apiUrl}/dia-chi/${id}`,
      data,
      this.getHeaders()
    );
  }

  // Xóa địa chỉ
  XoaDiaChi(id: number): Observable<any> {
    return this.http.delete(
      `${environment.apiUrl}/dia-chi/${id}`,
      this.getHeaders()
    );
  }
}