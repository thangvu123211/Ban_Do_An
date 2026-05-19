import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, tap } from 'rxjs';
import { environment } from '../../../environments/environment.prod';
import { forkJoin, } from 'rxjs';
@Injectable({ providedIn: 'root' })
export class CartService {

  private STORAGE_KEY = 'gio_hang_local';

  private _count$ = new BehaviorSubject<number>(0);
  count$ = this._count$.asObservable();

  private emitLocalCount(list: any[]) {
    this._count$.next(this.total(list));
  }
  constructor(private http: HttpClient) { }

  /* ================= LOCAL ================= */

  getLocal(): any[] {
    return JSON.parse(localStorage.getItem(this.STORAGE_KEY) || '[]');
  }

  saveLocal(list: any[]) {
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(list));
    this.emitLocalCount(list); // 🔥 realtime
  }

  private total(list: any[]) {
    return list.reduce((s, i) => s + i.soLuong, 0);
  }

  addLocal(mon: any) {

    const list = this.getLocal();

    const optionKey = JSON.stringify(mon.options || []);

    // tìm đúng món + đúng option
    const found = list.find(x =>
      x.ma_mon_an === mon.ma_mon_an &&
      JSON.stringify(x.options || []) === optionKey
    );

    const qty = mon.soLuong ?? 1;

    if (found) {
      found.soLuong += qty;
    } else {
      list.push({
        ...mon,
        soLuong: qty,
        options: mon.options || []
      });
    }

    this.saveLocal(list);
  }

  removeLocal(maMonAn: number) {
    const list = this.getLocal().filter(x => x.ma_mon_an !== maMonAn);
    this.saveLocal(list);
  }

  clearLocal() {
    localStorage.removeItem(this.STORAGE_KEY);
    this._count$.next(0);
  }

  /* ================= DB ================= */

  getByUser(userId: number) {
    return this.http.get<any[]>(
      `${environment.apiUrl}/gio-hang/user/${userId}`
    );
  }

  addDB(maMonAn: number, soLuong: number) {
    return this.http.post(`${environment.apiUrl}/gio-hang`, {
      ma_mon_an: maMonAn,
      so_luong: soLuong
    });
  }

  updateDB(maMonAn: number, soLuong: number) {
    return this.http.put(`${environment.apiUrl}/gio-hang/${maMonAn}`, {
      so_luong: soLuong
    });
  }

  deleteDB(maMonAn: number) {
    return this.http.delete(`${environment.apiUrl}/gio-hang/${maMonAn}`);
  }

  clearDB(userId: number) {
    return this.http.delete(
      `${environment.apiUrl}/gio-hang/clear`
    );
  }

  loadCountFromDB(userId: number) {
    this.getByUser(userId).subscribe(res => {
      const total = res.reduce((s, i) => s + i.so_luong, 0);
      this._count$.next(total);
    });
  }

  /* ================= SYNC ================= */

  syncLocalToDB(userId: number) {
    const local = this.getLocal();
    if (!local.length) {
      this.loadCountFromDB(userId);
      return;
    }

    const map = new Map<number, number>();

    local.forEach(i => {
      map.set(i.ma_mon_an, (map.get(i.ma_mon_an) || 0) + i.soLuong);
    });

    const requests = Array.from(map.entries()).map(([maMon, soLuong]) =>
      this.addDB(maMon, soLuong)
    );

    return forkJoin(requests).pipe(
      tap({
        next: () => {
          this.clearLocal();
          this.loadCountFromDB(userId);
        },
        error: (err) => console.error(err)
      })
    );
  }
}