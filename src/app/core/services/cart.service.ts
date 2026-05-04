import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CartService {

  private gioHang: any[] = [];

  private gioHangSubject = new BehaviorSubject<any[]>([]);
  gioHang$ = this.gioHangSubject.asObservable();

  private tongSoMonSubject = new BehaviorSubject<number>(0);
  tongSoMon$ = this.tongSoMonSubject.asObservable();

  setGioHang(gioHang: any[]) {
    this.gioHang = gioHang;
    this.emit();
  }

  getGioHang() {
    return this.gioHang;
  }

  clear() {
    this.gioHang = [];
    this.emit();
  }

  private emit() {
    this.gioHangSubject.next(this.gioHang);
    const tong = this.gioHang.reduce((s, i) => s + i.soLuong, 0);
    this.tongSoMonSubject.next(tong);
  }
}