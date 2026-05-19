// goi-mon.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment.prod';
import { map } from 'rxjs/operators';

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
export class shipperService {

    constructor(private http: HttpClient) { }



    getAllHoaDon(): Observable<any[]> {
        return this.http
            .get<any>(`${environment.apiUrl}/ship`)
            .pipe(map(res => res.data));
    }

    updateTrangThai(id: number, trangThai: string) {
        return this.http.put(
            `${environment.apiUrl}/ship/${id}/trang-thai`,
            { trang_thai: trangThai }
        );
    }


}