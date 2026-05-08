import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class CartService {

  private _gioHang$ = new BehaviorSubject<any[]>([]);
  gioHang$ = this._gioHang$.asObservable();

  private _tongSoMon$ = new BehaviorSubject<number>(0);
  tongSoMon$ = this._tongSoMon$.asObservable();

  // snapshot
  private get gioHang() {
    return this._gioHang$.value;
  }

  // ===== ADD =====
  addItem(item: any) {
    const clone = [...this.gioHang];
    const found = clone.find(i => i.id === item.id);

    if (found) {
      found.soLuong++;
    } else {
      clone.push({ ...item, soLuong: 1 });
    }

    this.update(clone);
  }

  getItems() {
    return this._gioHang$.value;
  }

  // ===== TĂNG =====
  tangSoLuong(item: any) {
    const clone = this.gioHang.map(i =>
      i.id === item.id ? { ...i, soLuong: i.soLuong + 1 } : i
    );
    this.update(clone);
  }

  // ===== GIẢM =====
  giamSoLuong(item: any) {
    const clone = this.gioHang
      .map(i =>
        i.id === item.id ? { ...i, soLuong: i.soLuong - 1 } : i
      )
      .filter(i => i.soLuong > 0);

    this.update(clone);
  }

  // ===== REMOVE =====
  removeItem(item: any) {
    const clone = this.gioHang.filter(i => i.id !== item.id);
    this.update(clone);
  }

  // ===== CLEAR =====
  clear() {
    this._gioHang$.next([]);
    this._tongSoMon$.next(0);
  }

  // ===== UPDATE =====
  private update(gioHang: any[]) {
    this._gioHang$.next(gioHang);
    const tong = gioHang.reduce((s, i) => s + i.soLuong, 0);
    this._tongSoMon$.next(tong);
  }
}