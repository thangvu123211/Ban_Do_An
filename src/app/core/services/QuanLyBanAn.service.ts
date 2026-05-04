import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment.prod';

@Injectable({
  providedIn: 'root'
})
export class QuanLyBanAnService {

  constructor(private http: HttpClient) { }


  LayTatCaBanAn(): Observable<any> {
    return this.http.get(`${environment.apiUrl}/banan/layTatCa`);
  }

  LayBanAnTheoID(ma_ban: number): Observable<any> {
    return this.http.get(`${environment.apiUrl}/banan/layRaThongTinBanan/${ma_ban}`);
  }

  ThemBanAn(formData: FormData): Observable<any> {
    return this.http.post(`${environment.apiUrl}/banan/create`, formData);
  }

  XoaBanAn(ma_ban: number): Observable<any> {
    return this.http.delete(`${environment.apiUrl}/banan/delete/${ma_ban}`);
  }

  CapNhatBanAn(ma_ban: number, BanAn: any, selectedFile?: File): Observable<any> {
    const formData = new FormData();

    // 🔥 Convert tất cả field sang string để backend bind được
    Object.entries(BanAn).forEach(([key, value]) => {
      if (value !== null && value !== undefined) {
        formData.append(key, String(value));
      }
    });

    // 🔥 Nếu có ảnh thì gửi chung form-data
    if (selectedFile) {
      formData.append("image", selectedFile, selectedFile.name);
    }

    return this.http.patch(`${environment.apiUrl}/banan/update/${ma_ban}`, formData);
  }

}
