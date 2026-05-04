import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface MonOrder {
  ma_mon_an: number;
  so_luong: number;
}

export interface GoiMonRequest {
  ma_ban: number;
  mon_ans: MonOrder[];
}

@Injectable({
  providedIn: 'root'
})
export class GoiMonService {


  constructor(private http: HttpClient) {}

  goiMon(data: GoiMonRequest): Observable<any> {
    return this.http.post(
      `${environment.apiUrl}/goi-mon/create`,
      data
    );
  }
}