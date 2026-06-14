import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment.prod';
@Injectable({
  providedIn: 'root'
})
export class QuanLyLoaiMonAn {

  constructor(private http: HttpClient) { }


  LayTatCaLoaiMonAn(): Observable<any> {
    return this.http.get(`${environment.apiUrl}/loaimonan/all`);
  }

  LayLoaiMonAnTheoID(ma_loai_mon_an: number): Observable<any> {
    return this.http.get(`${environment.apiUrl}/loaimonan/${ma_loai_mon_an}`);
  }

  ThemLoaiMonAn(formData: FormData): Observable<any> {
    return this.http.post(`${environment.apiUrl}/loaimonan/create`, formData);
  }

  CapNhatLoaiMonAn(ma_loai_mon_an: number, loaimonan: any, selectedFile?: File): Observable<any> {
    const formData = new FormData();
    Object.entries(loaimonan).forEach(([key, value]) => {
      if (value !== null && value !== undefined) {
        formData.append(key, String(value));
      }
    });
    if (selectedFile) {
      formData.append("image", selectedFile, selectedFile.name);
    }
    return this.http.patch(`${environment.apiUrl}/loaimonan/update/${ma_loai_mon_an}`, formData);
  }

  XoaLoaiMonAn(ma_loai_mon_an: number): Observable<any> {
    return this.http.delete(`${environment.apiUrl}/loaimonan/delete/${ma_loai_mon_an}`);
  }
}




