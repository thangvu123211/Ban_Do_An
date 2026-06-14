import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment.prod';
@Injectable({
  providedIn: 'root'
})
export class QuanLyMonAn {


  constructor(private http: HttpClient) { }

  LayTatCaMonAn(): Observable<any> {
    return this.http.get(`${environment.apiUrl}/mon_an/all`);
  }
  ThemMonAn(formData: FormData): Observable<any> {
    return this.http.post(`${environment.apiUrl}/mon_an/create`, formData);
  }
  LayMonAnTheoID(ma_mon_an: number): Observable<any> {
    return this.http.get(`${environment.apiUrl}/mon_an/${ma_mon_an}`);
  }
  XoaBanAn(ma_mon_an: number): Observable<any> {
    return this.http.delete(`${environment.apiUrl}/mon_an/delete/${ma_mon_an}`);
  }

  CapNhatMonAn(
    ma_mon_an: number,
    monAn: any,
    selectedFile?: File
  ): Observable<any> {

    const formData = new FormData();

    Object.entries(monAn).forEach(([key, value]) => {
      if (value !== null && value !== undefined) {
        formData.append(key, String(value));
      }
    });

    // 🔥 KEY PHẢI KHỚP BACKEND
    if (selectedFile) {
      formData.append('image', selectedFile, selectedFile.name);

    }

    return this.http.patch(
      `${environment.apiUrl}/mon_an/update/${ma_mon_an}`,
      formData
    );
  }

  getMonAnDetail(id: number): Observable<any> {
    return this.http.get(`${environment.apiUrl}/mon_an/${id}/detail`);
  }

  searchMonAn(keyword: string) {
    return this.http.get<any>(`${environment.apiUrl}mon_an/search?q=${keyword}`);
  }

  getMonAnCoBinhLuanVaDanhGia(): Observable<any> {
    return this.http.get(`${environment.apiUrl}/mon_an/get-mon-an-co-binh-luan-va-danh-gia`);
  }
  getMonAnCoBinhLuanVaDanhGiaCuaNguoiDung(): Observable<any> {
    return this.http.get(`${environment.apiUrl}/mon_an/get-mon-an-co-binh-luan-va-danh-gia-cua-nguoi-dung`);
  }
}
