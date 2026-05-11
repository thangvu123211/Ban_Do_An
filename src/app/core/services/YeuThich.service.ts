import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { environment } from '../../../environments/environment.prod';

@Injectable({ providedIn: 'root' })
export class YeuThichService {

  private STORAGE_KEY = 'yeu_thich_local';

  private _count$ = new BehaviorSubject<number>(0);
  count$ = this._count$.asObservable();

  constructor(private http: HttpClient) {}

  /* ================= LOCAL ================= */
  getLocal(): any[] {
    return JSON.parse(localStorage.getItem(this.STORAGE_KEY) || '[]');
  }

  saveLocal(list: any[]) {
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(list));
    this._count$.next(list.length);
  }

  addLocal(mon: any) {
    const list = this.getLocal();
    if (!list.find(x => x.ma_mon_an === mon.ma_mon_an)) {
      list.push(mon);
      this.saveLocal(list);
    }
  }

  removeLocal(maMonAn: number) {
    const list = this.getLocal().filter(x => x.ma_mon_an !== maMonAn);
    this.saveLocal(list);
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
    }).pipe(
      tap(() => this._count$.next(this._count$.value + 1))
    );
  }

  removeDB(maMonAn: number) {
    return this.http.delete(`${environment.apiUrl}/yeu-thich/${maMonAn}`).pipe(
      tap(() => this._count$.next(Math.max(0, this._count$.value - 1)))
    );
  }

  loadCountFromDB(userId: number) {
    this.getByUser(userId).subscribe(res => {
      this._count$.next(res?.length || 0);
    });
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
}