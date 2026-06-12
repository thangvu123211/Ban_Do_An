import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment.prod';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private http: HttpClient) { }


  getSoTienDaChiCuaUser(): Observable<any> {
    return this.http.get<any>(
      `${environment.apiUrl}/user/so-tien-da-mua`
    );
  }


}
