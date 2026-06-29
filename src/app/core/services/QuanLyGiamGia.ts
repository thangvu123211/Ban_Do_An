import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment.prod';

@Injectable({
    providedIn: 'root'
})
export class QuanLyGiamGiaService {

    constructor(private http: HttpClient) { }


    LayTatCaGiamGia(): Observable<any> {
        return this.http.get(`${environment.apiUrl}/giam-gia/`);
    }

    LayTatCaGiamGiaGuest(): Observable<any> {
        return this.http.get(`${environment.apiUrl}/giam-gia/guest`);
    }

    LayTatCaGiamGiaUser(): Observable<any> {
        return this.http.get(`${environment.apiUrl}/giam-gia/user`);
    }

    LayGiamGiaTheoID(id: number): Observable<any> {
        return this.http.get(`${environment.apiUrl}/giam-gia/${id}`);
    }

    ThemGiamGia(formData: FormData): Observable<any> {
        return this.http.post(`${environment.apiUrl}/giam-gia/`, formData);
    }

    XoaGiamGia(id: number): Observable<any> {
        return this.http.delete(`${environment.apiUrl}/giam-gia/${id}`);
    }

    //   CapNhatGiamGia(id: number, GiamGia: any, selectedFile?: File): Observable<any> {
    //     const formData = new FormData();

    //     // 🔥 Convert tất cả field sang string để backend bind được
    //     Object.entries(GiamGia).forEach(([key, value]) => {
    //       if (value !== null && value !== undefined) {
    //         formData.append(key, String(value));
    //       }
    //     });

    //     // 🔥 Nếu có ảnh thì gửi chung form-data
    //     if (selectedFile) {
    //       formData.append("image", selectedFile, selectedFile.name);
    //     }

    //     return this.http.patch(`${environment.apiUrl}/giam-gia/${id}`, formData);
    //   }

    CapNhatGiamGia(id: number, formData: FormData) {
        return this.http.patch(
            `${environment.apiUrl}/giam-gia/${id}`,
            formData
        );
    }

}
