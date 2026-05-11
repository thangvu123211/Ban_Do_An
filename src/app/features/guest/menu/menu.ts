import { CommonModule } from '@angular/common';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ToastMessageComponent } from '../../../Shared/toasts_message/toast-message/toast-message';
import { HttpClient } from '@angular/common/http';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { QuanLyLoaiMonAn } from '../../../core/services/QuanLyLoaiMonAnService';
import { QuanLyMonAn } from '../../../core/services/QuanLyMonAn.service';
import { PhongToAnh } from '../../../Shared/phong_to_anh/phong-to-anh';
import { MATERIAL } from '../../../Shared/material';
import { QuanLyBanAnService } from '../../../core/services/QuanLyBanAn.service';
import { CartService } from '../../../core/services/cart.service';
import { ThongTinMonAn } from '../dialogs/thong-tin-mon-an/thong-tin-mon-an';
import { HoaDonService } from '../../../core/services/HoaDon.Service';
import { AuthService } from '../../../core/services/auth.service';
import { YeuThichService } from '../../../core/services/YeuThich.service';
import { YeuThich } from '../yeu-thich/yeu-thich';



export interface MonAn {
  ma_mon_an: number;
  ma_loai_mon_an: number;
  ten_mon_an: string;
  gia_tien: number;
  trang_thai: string;
  anh_mon_an: string;
}
export interface LoaiMonAn {
  ma_loai_mon_an: number;
  ten_loai_mon_an: string;
  anh_loai_mon_an: string;
}

@Component({
  selector: 'app-menu',
  imports: [MATERIAL,
    ToastMessageComponent],
  templateUrl: './menu.html',
  styleUrl: './menu.scss'
})
export class Menu implements OnInit {
  selectedLoai: number | null = null;
  loaiMonAnList: any[] = [];
  monAnList: any[] = [];
  gioHang: any[] = [];
  maBan: number = 0;
  tenBan: string = '';
  showGioHang: boolean = false;

  toast = {
    show: false,
    message: '',
    type: 'success' as 'success' | 'warn' | 'error'
  };

  MonAn: any[] = [];
  loaimonan: any[] = [];
  tatCaMonAn: any[] = [];
  favoriteIds = new Set<number>();
  _loadingFav = false;
  danhSach: any[] = [];

  screenWidth = window.innerWidth;

  showToast(message: string, type: 'success' | 'warn' | 'error') {
    this.toast.show = true;
    this.toast.message = message;
    this.toast.type = type;
    setTimeout(() => (this.toast.show = false), 3000);
  }



  constructor(
    private http: HttpClient,
    private hoadonservice: HoaDonService,
    private route: ActivatedRoute,
    private quanlimonan: QuanLyMonAn,
    private quanliloaimonan: QuanLyLoaiMonAn,
    private quanLyBanAn: QuanLyBanAnService,
    private dialog: MatDialog,
    private cartService: CartService,
    private authService: AuthService,
    private yeuThichService: YeuThichService,
  ) { }

  /** Lấy tất cả món ăn */
  getAllMonAn() {

    this.quanlimonan.LayTatCaMonAn().subscribe({
      next: (res: any) => {

        if (Array.isArray(res.data)) {

          this.tatCaMonAn = res.data.map((u: MonAn) => ({
            ...u,
            anh_mon_an_url: u.anh_mon_an
          }));

          // hiển thị tất cả món
          this.MonAn = [...this.tatCaMonAn];

        }

      },
      error: (err) => {
        console.error(err);
      }

    });

  }


  /** Lấy tất cả loại món ăn */
  getAllLoaiMonAn() {
    this.quanliloaimonan.LayTatCaLoaiMonAn().subscribe({
      next: (res: any) => {
        if (Array.isArray(res.data)) {
          this.loaimonan = res.data.map((u: LoaiMonAn) => ({
            ...u,
            anh_loai_mon_an_url: u.anh_loai_mon_an
          }));

        }
      }
    });
  }

  /** Lấy món ăn theo loại */
  getMonAnTheoLoai(loaiId: number) {

    this.selectedLoai = loaiId;

    this.MonAn = this.tatCaMonAn.filter(
      mon => mon.ma_loai_mon_an === loaiId
    );

  }

  get tieuDe(): string {

    if (this.selectedLoai === null) return 'Tất cả món';

    const loai = this.loaimonan.find(
      l => l.ma_loai_mon_an === this.selectedLoai
    );

    return loai ? loai.ten_loai_mon_an : 'Món ăn';

  }
  hienThiTatCaMon() {
    this.selectedLoai = null;
    this.MonAn = [...this.tatCaMonAn];
  }

  /** Tính tổng tiền (getter) */
  get tongTien(): number {
    return this.gioHang.reduce((sum, i) => sum + i.gia_tien * i.soLuong, 0);
  }

  capNhatSoLuong(item: any) {
    if (item.soLuong < 1 || isNaN(item.soLuong)) {
      item.soLuong = 1;
    }
  }
  huyGioHang() {
    this.gioHang = [];
  }
  getBanInfo() {
    this.quanLyBanAn.LayBanAnTheoID(this.maBan).subscribe({
      next: (res: any) => {
        this.tenBan = res.data.ten_ban;
      },
      error: (err) => {
        console.error(err);
      }
    });
  }
  // goiMon() {

  //   if (!this.maBan) {
  //     this.showNotification("Chưa chọn bàn!", "warn");
  //     return;
  //   }

  //   if (this.gioHang.length === 0) {
  //     this.showNotification("Giỏ hàng trống!", "warn");
  //     return;
  //   }

  //   const monAns = this.gioHang.map(item => {
  //     return {
  //       ma_mon_an: item.ma_mon_an,
  //       so_luong: item.soLuong
  //     };
  //   });

  //   const body = {
  //     ma_ban: this.maBan,
  //     mon_ans: monAns
  //   };

  //   console.log("DATA GUI API:", JSON.stringify(body));

  //   this.goiMonService.goiMon(body).subscribe({
  //     next: (res: any) => {
  //       console.log("API RESPONSE:", res);

  //       if (res && res.message) {
  //         this.showNotification(res.message, "success");
  //       } else {
  //         this.showNotification("Gọi món thành công!", "success");
  //       }

  //       this.huyGioHang();
  //     },
  //     error: (err) => {
  //       console.error("API ERROR:", err);
  //       this.showNotification("Có lỗi khi gọi món!", "error");
  //     }

  //   });

  // }

  addToGioHang(mon: any): void {
    this.cartService.addItem({
      id: mon.ma_mon_an,
      ma_mon_an: mon.ma_mon_an,
      ten_mon_an: mon.ten_mon_an,
      gia_tien: mon.gia_tien,
      anh_mon_an: mon.anh_mon_an
    });
    this.showToast(`Thêm thành công món ${mon.ten_mon_an} vào giỏ hàng`, 'success');
  }

  get tongSoMon(): number {
    return this.gioHang.reduce((sum, i) => sum + i.soLuong, 0);
  }

  loadFavorites() {
  const token = localStorage.getItem('token');
  const userId = Number(localStorage.getItem('ma_nguoi_dung'));

  if (!token) {
    const local = this.yeuThichService.getLocal();
    this.danhSach = local;
    return;
  }

  this.yeuThichService.getByUser(userId).subscribe((res: any[]) => {

    // 🔥 CHUẨN HOÁ DATA
    this.danhSach = res.map(x => ({
      ma_mon_an: x.mon_an?.ma_mon_an,
      ten_mon_an: x.mon_an?.ten_mon_an,
      gia_tien: x.mon_an?.gia_tien,
      anh_mon_an: x.mon_an?.anh_mon_an
    }));

    this.favoriteIds = new Set(res.map(x => x.MaMonAn));
  });
}

  //   moThongTinMon(mon: any) {
  moThongTinMon(mon: any) {

    const dialogRef = this.dialog.open(ThongTinMonAn, {
      width: '650px',
      maxWidth: '95vw',
      height: '85vh',
      panelClass: 'thong-tin-mon-dialog',
      data: mon
    });

    dialogRef.afterClosed().subscribe((result: any) => {
      if (result?.success) {
        this.showToast(result.message, 'success');
      }
    });

  }


  isFavorite(maMonAn: number): boolean {
    return this.favoriteIds.has(maMonAn);
  }
  toggleYeuThich(mon: any) {
    const token = localStorage.getItem('token');
    const maMonAn = mon.ma_mon_an;

    // ❌ CHƯA LOGIN → LOCAL
    if (!token) {
      if (this.favoriteIds.has(maMonAn)) {
        this.yeuThichService.removeLocal(maMonAn);
        this.favoriteIds.delete(maMonAn);
      } else {
        this.yeuThichService.addLocal(mon);
        this.favoriteIds.add(maMonAn);
      }
      return;
    }

    // 🔥 CHỐNG CLICK NHANH GÂY DOUBLE CALL
    if (this._loadingFav) return;
    this._loadingFav = true;

    if (this.favoriteIds.has(maMonAn)) {
      this.yeuThichService.removeDB(maMonAn).subscribe(() => {
        this.favoriteIds.delete(maMonAn);
        this._loadingFav = false;
      });
    } else {
      this.yeuThichService.addDB(maMonAn).subscribe(() => {
        this.favoriteIds.add(maMonAn);
        this._loadingFav = false;
      });
    }
  }

  ngOnInit() {
    this.getAllLoaiMonAn();
    this.getAllMonAn();
    this.loadFavorites();
    // 🔥 ĐỒNG BỘ GIỎ HÀNG
    this.cartService.gioHang$.subscribe(gio => {
      this.gioHang = gio;
    });

    this.route.queryParams.subscribe(params => {
      this.maBan = Number(params['table']);
      if (this.maBan) this.getBanInfo();
    });

  }
  @ViewChild('scrollContainer', { static: false })
  scrollContainer!: ElementRef;

  scrollLeft() {
    this.scrollContainer.nativeElement.scrollBy({
      left: -300,
      behavior: 'smooth'
    });
  }

  scrollRight() {
    this.scrollContainer.nativeElement.scrollBy({
      left: 300,
      behavior: 'smooth'
    });
  }

}



