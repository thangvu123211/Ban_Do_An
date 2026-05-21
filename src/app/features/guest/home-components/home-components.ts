import { Component, OnDestroy, OnInit } from '@angular/core';
import * as AOS from 'aos';
import { QuanLyLoaiMonAn } from '../../../core/services/QuanLyLoaiMonAnService';
import { QuanLyMonAn } from '../../../core/services/QuanLyMonAn.service';
import { MATERIAL } from '../../../Shared/material';
import { ViewChild, ElementRef } from '@angular/core';
import { CartService } from '../../../core/services/cart.service';
import { YeuThichService } from '../../../core/services/YeuThich.service';
import { ToastMessageComponent } from '../../../Shared/toasts_message/toast-message/toast-message';
import { ThongTinMonAn } from '../dialogs/thong-tin-mon-an/thong-tin-mon-an';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { QuanLyGiamGiaService } from '../../../core/services/QuanLyGiamGia';

@Component({
  selector: 'app-home-components',
  imports: [

    MATERIAL,
    ToastMessageComponent
  ],
  templateUrl: './home-components.html',
  styleUrls: ['./home-components.scss']
})
export class HomeComponents implements OnInit, OnDestroy {
  images = [
    'assets/banner/banner12.avif',
    'assets/banner/banner9.jpg',
    'assets/banner/banner13.avif',
    'assets/banner/banner.avif'
  ];

  danhSachLoaiMonAn: any[] = [];
  monAnNoiBat: any[] = [];
  danhSach: any[] = [];

  favoriteIds = new Set<number>();
  _loadingFav = false;


  toast = {
    show: false,
    message: '',
    type: 'success' as 'success' | 'warn' | 'error'
  };

  danhSachGiamGia: any[] = [];

  currentIndex = 0;
  private intervalId: any;

  constructor(
    private QuanLyLoaiMonAn: QuanLyLoaiMonAn,
    private quanLyMonAn: QuanLyMonAn,
    private cartService: CartService,
    private yeuThichService: YeuThichService,
    private dialog: MatDialog,
    private router: Router,
    private giamGiaService: QuanLyGiamGiaService
  ) { }

  showToast(message: string, type: 'success' | 'warn' | 'error') {
    this.toast.show = true;
    this.toast.message = message;
    this.toast.type = type;
    setTimeout(() => (this.toast.show = false), 3000);
  }

  goToMenuByLoai(loai: any) {
    this.router.navigate(['/thucdon'], {
      queryParams: {
        loai: loai.ma_loai_mon_an,
        ten: loai.ten_loai_mon_an
      }
    });
  }

  loadGiamGia() {
    this.giamGiaService.LayTatCaGiamGia().subscribe({
      next: (res: any) => {
        this.danhSachGiamGia = (res.data || []).filter((x: any) => x.is_active);
      },
      error: (err) => {
        console.error('Lỗi load mã giảm giá', err);
      }
    });
  }



  ngOnInit() {


    // this.startAutoSlide();
    this.loadLoaiMonAn();
    this.loadMonAnNoiBat();
    this.loadFavorites();
    this.loadGiamGia();
  }

  copyCode(code: string) {
    navigator.clipboard.writeText(code).then(() => {
      this.showToast(`Đã copy mã code `, 'success');
    });
  }


  // startAutoSlide() {
  //   this.intervalId = setInterval(() => {
  //     this.nextSlide();
  //   }, 4000); // đổi ảnh sau 4 giây
  // }

  // nextSlide() {
  //   this.currentIndex = (this.currentIndex + 1) % this.images.length;
  // }

  // goToSlide(index: number) {
  //   this.currentIndex = index;
  //   clearInterval(this.intervalId);
  //   this.startAutoSlide();
  // }

  loadLoaiMonAn() {
    this.QuanLyLoaiMonAn.LayTatCaLoaiMonAn().subscribe({
      next: (res: any) => {
        this.danhSachLoaiMonAn = res.data;
      },
      error: (err) => {
        console.error('Lỗi lấy loại món ăn', err);
      }
    });
  }

  loadFavorites() {
    const token = localStorage.getItem('token');
    const userId = Number(localStorage.getItem('ma_nguoi_dung'));

    // ❌ CHƯA LOGIN → LOCAL
    if (!token) {
      const local = this.yeuThichService.getLocal();
      this.danhSach = local;

      // 🔥 QUAN TRỌNG: set lại favoriteIds
      this.favoriteIds = new Set(local.map(x => x.ma_mon_an));

      return;
    }

    // 🔥 LOGIN → DB
    this.yeuThichService.getByUser(userId).subscribe((res: any[]) => {

      this.danhSach = res.map(x => ({
        ma_mon_an: x.mon_an?.ma_mon_an,
        ten_mon_an: x.mon_an?.ten_mon_an,
        gia_tien: x.mon_an?.gia_tien,
        anh_mon_an: x.mon_an?.anh_mon_an
      }));

      // 🔥 fix luôn case undefined + đồng bộ kiểu number
      this.favoriteIds = new Set(
        res.map(x => Number(x.mon_an?.ma_mon_an))
      );
    });
  }

  isFavorite(maMonAn: number): boolean {
    return this.favoriteIds.has(maMonAn);
  }
  toggleYeuThich(mon: any) {
    const token = localStorage.getItem('token');
    const maMonAn = mon.ma_mon_an;

    const tenMon = mon.ten_mon_an || 'món ăn';

    // ❌ CHƯA LOGIN → LOCAL
    if (!token) {
      if (this.favoriteIds.has(maMonAn)) {
        this.yeuThichService.removeLocal(maMonAn);
        this.favoriteIds.delete(maMonAn);

        this.showToast(`Đã bỏ yêu thích ${tenMon}`, 'warn');
      } else {
        this.yeuThichService.addLocal(mon);
        this.favoriteIds.add(maMonAn);

        this.showToast(`Đã thêm ${tenMon} vào yêu thích`, 'success');
      }
      return;
    }

    // 🔥 CHỐNG CLICK NHANH
    if (this._loadingFav) return;
    this._loadingFav = true;

    if (this.favoriteIds.has(maMonAn)) {
      this.yeuThichService.removeDB(maMonAn).subscribe({
        next: () => {
          this.favoriteIds.delete(maMonAn);
          this._loadingFav = false;

          this.showToast(`Đã bỏ yêu thích ${tenMon}`, 'warn');
        },
        error: () => {
          this._loadingFav = false;
          this.showToast(`Không thể bỏ yêu thích ${tenMon}`, 'error');
        }
      });
    } else {
      this.yeuThichService.addDB(maMonAn).subscribe({
        next: () => {
          this.favoriteIds.add(maMonAn);
          this._loadingFav = false;

          this.showToast(`Đã thêm ${tenMon} vào yêu thích`, 'success');
        },
        error: () => {
          this._loadingFav = false;
          this.showToast(`Không thể thêm ${tenMon}`, 'error');
        }
      });
    }
  }

  addToGioHang(mon: any) {
    const token = localStorage.getItem('token');

    if (!token) {
      this.cartService.addLocal(mon);
      this.showToast('Đã thêm vào giỏ hàng', 'success');
      return;
    }

    const userId = Number(localStorage.getItem('ma_nguoi_dung'));

    this.cartService.addDB({
      ma_mon_an: mon.ma_mon_an,
      so_luong: 1,
      options: []
    }).subscribe(() => {
      this.cartService.loadCountFromDB(userId);
      this.showToast('Đã thêm vào giỏ hàng', 'success');
    });
  }
  loadMonAnNoiBat() {
    this.quanLyMonAn.LayTatCaMonAn().subscribe({
      next: (res: any) => {
        if (Array.isArray(res.data)) {
          this.monAnNoiBat = res.data.slice(0, 8); // lấy 8 món
        }
      },
      error: (err) => console.error(err)
    });
  }

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

  ngOnDestroy() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }
  }

  @ViewChild('homeScrollContainer', { static: false })
  homeScrollContainer!: ElementRef;

  scrollLeft() {
    this.homeScrollContainer.nativeElement.scrollBy({
      left: -300,
      behavior: 'smooth'
    });
  }

  scrollRight() {
    this.homeScrollContainer.nativeElement.scrollBy({
      left: 300,
      behavior: 'smooth'
    });
  }
}
