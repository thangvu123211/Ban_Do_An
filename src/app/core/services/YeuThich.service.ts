import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { environment } from '../../../environments/environment.prod';

@Injectable({ providedIn: 'root' })
export class YeuThichService {

  private STORAGE_KEY = 'yeu_thich_local';

  private _count$ = new BehaviorSubject<number>(0);
  count$ = this._count$.asObservable();

  private _favoriteIds$ = new BehaviorSubject<Set<number>>(new Set());
  favoriteIds$ = this._favoriteIds$.asObservable();

  constructor(private http: HttpClient) { }

  /* ================= LOCAL ================= */
  getLocal(): any[] {
    return JSON.parse(localStorage.getItem(this.STORAGE_KEY) || '[]');
  }

  saveLocal(list: any[]) {
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(list));
    this._count$.next(list.length);
  }
  initLocalState() {
    const local = this.getLocal();
    this._count$.next(local.length);
  }
  initState() {
    const token = localStorage.getItem('token');

    if (!token) {
      const local = this.getLocal();
      this._count$.next(local.length);
    }
  }

  addLocal(mon: any) {
    const list = this.getLocal();

    if (!list.find(x => x.ma_mon_an === mon.ma_mon_an)) {
      list.push(mon);
      this.saveLocal(list);

      const ids = new Set(this._favoriteIds$.value);
      ids.add(Number(mon.ma_mon_an));

      this._favoriteIds$.next(ids);
      this._count$.next(ids.size);
    }
  }


  /* ================= DB ================= */
  getByUser(userId: number): Observable<any[]> {
    return this.http.get<any[]>(
      `${environment.apiUrl}/yeu-thich/user/${userId}`
    );
  }

  addDB(maMonAn: number) {
    return this.http.post(`${environment.apiUrl}/yeu-thich`, {
      ma_mon_an: maMonAn
    });
  }


  loadCountFromDB(userId: number) {
    this.getByUser(userId).subscribe(res => {
      this._count$.next(res?.length || 0);
    });
  }

  setCount(value: number) {
    this._count$.next(value);
  }

  getCountFromDB(userId: number) {
    return this.http.get<any[]>(
      `${environment.apiUrl}/yeu-thich/user/${userId}`
    );
  }

  /* ================= SYNC LOCAL → DB ================= */
  syncLocalToDB(userId: number) {
    const local = this.getLocal();

    if (!local || local.length === 0) {
      this.loadCountFromDB(userId);
      return;
    }

    // 🔥 dùng Set để tránh trùng
    const unique = new Set(local.map(x => x.ma_mon_an));

    unique.forEach(maMon => {
      this.addDB(maMon).subscribe();
    });

    // xoá local
    localStorage.removeItem(this.STORAGE_KEY);

    // 🔥 reload lại state từ DB SAU KHI SYNC
    setTimeout(() => {
      this.loadCountFromDB(userId);
    }, 500);
  }

  removeLocal(maMonAn: number) {
    const list = this.getLocal().filter(x => x.ma_mon_an !== maMonAn);
    this.saveLocal(list);

    const ids = new Set(this._favoriteIds$.value);
    ids.delete(maMonAn);

    this._favoriteIds$.next(ids);
    this._count$.next(ids.size);
  }

  removeDB(maMonAn: number): Observable<any> {
    return this.http
      .delete(`${environment.apiUrl}/yeu-thich/${maMonAn}`)
      .pipe(
        tap(() => {
          const ids = new Set(this._favoriteIds$.value);
          ids.delete(maMonAn);

          this._favoriteIds$.next(ids);
          this._count$.next(ids.size);
        })
      );
  }
  setFavorites(list: any[]) {
    const ids = new Set<number>(list.map(x => x.ma_mon_an));
    this._favoriteIds$.next(ids);
    this._count$.next(ids.size);
  }

  isFavorite(maMonAn: number): boolean {
    return this._favoriteIds$.value.has(maMonAn);
  }

  initFavorites() {
    const token = localStorage.getItem('token');
    const userId = Number(localStorage.getItem('ma_nguoi_dung'));

    if (!token) {
      const local = this.getLocal();
      this.setFavorites(local);
      return;
    }

    this.getByUser(userId).subscribe(res => {
      const list = res
        .filter(x => x.mon_an)
        .map(x => ({
          ma_mon_an: Number(x.mon_an.ma_mon_an)
        }));

      this.setFavorites(list);
    });
  }

  getFavoriteIds(): Set<number> {
    return this._favoriteIds$.value;
  }
}