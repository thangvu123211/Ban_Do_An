import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private baseUrl = 'http://localhost:3000/api/user';

  constructor(private http: HttpClient) {}

  // Lấy thông tin admin
  LayThongTinUser(): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/info`);
  }

//   CapNhatAdmin(id: number, userData: any): Observable<any> {
//     const formData = new FormData();
//     Object.entries(userData).forEach(([key, value]) => {
//       if (value !== undefined && value !== null) formData.append(key, value.toString());
//     });
//     return this.http.put(`${this.baseUrl}/updateAccountAdmin/${id}`, userData);
//   }


//   // Upload ảnh admin (giữ logic y như trong component)
//   uploadAvatar(maNV: string, file: File): Observable<any> {
//     const formData = new FormData();
//     formData.append('anhnv', file);
//     return this.http.post<any>(`${this.baseUrl}/upload/${maNV}`, formData);
//   }
}
