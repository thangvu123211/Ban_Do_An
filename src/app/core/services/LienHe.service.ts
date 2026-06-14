import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment.prod';


@Injectable({
  providedIn: 'root'
})
export class LienHeService {

  constructor(private http: HttpClient) {}

  /** 🔹 Gửi liên hệ */
  GuiLienHe(data: any): Observable<any> {
    return this.http.post(
      `${environment.apiUrl}/lien-he/create`,
      data
    );
  }

  LayTatCaLienHe(): Observable<any> {
    return this.http.get(
      `${environment.apiUrl}/lien-he`
    );
  }

  XoaLienHe(id: number): Observable<any> {
    return this.http.delete(`${environment.apiUrl}/lien-he/${id}`);
  }
  
}
