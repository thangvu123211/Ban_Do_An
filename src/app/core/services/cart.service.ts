import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, map, Observable, of, tap } from 'rxjs';
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
    return list.reduce((s, i) => s + (i.soLuong || 0), 0);
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
    return this.http.get<{ data: any[] }>(
      `${environment.apiUrl}/gio-hang/user/${userId}`
    );
  }

  addDB(payload: {
    ma_mon_an: number;
    so_luong: number;
    options: any[];
  }) {
    return this.http.post(`${environment.apiUrl}/gio-hang`, payload);
  }

  updateDB(maMonAn: number, soLuong: number) {
    return this.http.put(`${environment.apiUrl}/gio-hang/${maMonAn}`, {
      so_luong: soLuong
    });
  }

  deleteDB(maGioHang: number) {
    return this.http.delete(`${environment.apiUrl}/gio-hang/${maGioHang}`);
  }

  clearDB(userId: number) {
    return this.http.delete(
      `${environment.apiUrl}/gio-hang/clear`
    );
  }

  loadCountFromDB(userId: number) {
    this.getByUser(userId).subscribe({
      next: (res: any) => {
        const total = (res.data || []).reduce(
          (sum: number, item: any) => sum + (item.SoLuong || 0),
          0
        );

        this._count$.next(total);
      },
      error: () => {
        this._count$.next(0);
      }
    });
  }
  setCount(count: number) {
    this._count$.next(count);
  }

  updateSoLuong(cartId: number, soLuong: number) {
    return this.http.put(
      `${environment.apiUrl}/gio-hang/${cartId}`,
      { so_luong: soLuong }
    );
  }

  /* ================= SYNC ================= */

  syncLocalToDB(userId: number): Observable<boolean> {
    const local = this.getLocal();

    // ✅ local rỗng → vẫn trả Observable<boolean>
    if (!local || local.length === 0) {
      this.loadCountFromDB(userId);
      return of(true);
    }

    const requests: Observable<any>[] = local.map(item =>
      this.addDB({
        ma_mon_an: item.ma_mon_an,
        so_luong: item.soLuong,
        options: item.options || []
      })
    );

    return forkJoin(requests).pipe(
      tap(() => {
        this.clearLocal();
        this.loadCountFromDB(userId);
      }),
      map(() => true) // ⭐ ÉP OUTPUT VỀ boolean
    );
  }
}