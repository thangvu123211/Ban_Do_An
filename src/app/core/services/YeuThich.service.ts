import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject } from 'rxjs';
import { environment } from '../../../environments/environment';

const KEY = 'YEU_THICH_GUEST';

@Injectable({ providedIn: 'root' })
export class YeuThichService {

    private _yeuThich$ = new BehaviorSubject<any[]>(this.loadLocal());
    yeuThich$ = this._yeuThich$.asObservable();

    private _tong$ = new BehaviorSubject<number>(0);
    tongYeuThich$ = this._tong$.asObservable();

    constructor(private http: HttpClient) {
        this.init();
    }

    // ================= LOCAL =================
    private loadLocal(): any[] {
        const data = localStorage.getItem(KEY);
        return data ? JSON.parse(data) : [];
    }

    private saveLocal(list: any[]) {
        localStorage.setItem(KEY, JSON.stringify(list));
    }

    init() {
        const list = this.loadLocal();
        this._yeuThich$.next(list);
        this._tong$.next(list.length);
    }

    isFavoriteLocal(id: number): boolean {
        const list = this.loadLocal();
        return list.some(i => Number(i.ma_mon_an) === Number(id));
    }
    getItems() {
        return this.loadLocal();
    }
    toggleLocal(mon: any) {
        let list = this.loadLocal();
        const id = Number(mon.ma_mon_an);

        const index = list.findIndex(i => Number(i.ma_mon_an) === id);

        if (index >= 0) {
            list.splice(index, 1);
        } else {
            list.push({
                ma_mon_an: id,
                ten_mon_an: mon.ten_mon_an,
                gia_tien: mon.gia_tien,
                anh_mon_an: mon.anh_mon_an
            });
        }

        this.saveLocal(list);
        this._yeuThich$.next(list);
        this._tong$.next(list.length);
    }

    removeLocal(id: number) {
        let list = this.loadLocal();

        list = list.filter(i => Number(i.ma_mon_an) !== Number(id));

        this.saveLocal(list);
        this._yeuThich$.next(list);
        this._tong$.next(list.length);
    }

    // ================= BACKEND =================
    addFavorite(userId: number, monId: number) {
        return this.http.post(`${environment.apiUrl}/yeu-thich`, {
            ma_nguoi_dung: userId,
            ma_mon_an: monId
        });
    }

    deleteFavorite(userId: number, monId: number) {
        return this.http.delete(`${environment.apiUrl}/yeu-thich`, {
            body: {
                ma_nguoi_dung: Number(userId),
                ma_mon_an: Number(monId)
            }
        });
    }

    getByUser(userId: number) {
        return this.http.get(`${environment.apiUrl}/yeu-thich/user/${userId}`);
    }
}