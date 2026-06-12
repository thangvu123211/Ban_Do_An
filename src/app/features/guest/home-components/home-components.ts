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
import { ThemGioHangDialog } from '../dialogs/them-gio-hang-dialog/them-gio-hang-dialog';
import { OptionService } from '../../../core/services/option.service';
import { DanhGiaService } from '../../../core/services/DanhGia.service';

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
  ratingsMap: any = {};

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
    private giamGiaService: QuanLyGiamGiaService,
    private optionService: OptionService,
    private danhGiaService:DanhGiaService
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
    this.loadLoaiMonAn();
    this.loadMonAnNoiBat();
    this.loadFavorites();
    this.loadGiamGia();
    this.loadRatings();
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
    const maMonAn = Number(mon.ma_mon_an);
    const tenMon = mon.ten_mon_an || 'món ăn';

    const isFav = this.favoriteIds.has(maMonAn);

    // ================= CHƯA LOGIN → LOCAL =================
    if (!token) {
      if (isFav) {
        this.favoriteIds.delete(maMonAn);
        this.yeuThichService.removeLocal(maMonAn);
        this.showToast(`Đã bỏ yêu thích ${tenMon}`, 'warn');
      } else {
        this.favoriteIds.add(maMonAn);
        this.yeuThichService.addLocal(mon);
        this.showToast(`Đã thêm ${tenMon} vào yêu thích`, 'success');
      }

      // 🔥 badge update NGAY
      this.yeuThichService.setCount(this.favoriteIds.size);
      return;
    }

    // ================= LOGIN =================
    if (this._loadingFav) return;
    this._loadingFav = true;

    // 🔥🔥🔥 UPDATE UI + BADGE NGAY
    if (isFav) {
      this.favoriteIds.delete(maMonAn);
      this.yeuThichService.setCount(this.favoriteIds.size);
    } else {
      this.favoriteIds.add(maMonAn);
      this.yeuThichService.setCount(this.favoriteIds.size);
    }

    const req$ = isFav
      ? this.yeuThichService.removeDB(maMonAn)
      : this.yeuThichService.addDB(maMonAn);

    req$.subscribe({
      next: () => {
        this._loadingFav = false;
        this.showToast(
          isFav
            ? `Đã bỏ yêu thích ${tenMon}`
            : `Đã thêm ${tenMon} vào yêu thích`,
          isFav ? 'warn' : 'success'
        );
      },
      error: () => {
        // 🔥 ROLLBACK nếu API fail
        if (isFav) {
          this.favoriteIds.add(maMonAn);
        } else {
          this.favoriteIds.delete(maMonAn);
        }

        this.yeuThichService.setCount(this.favoriteIds.size);
        this._loadingFav = false;

        this.showToast(
          `Không thể ${isFav ? 'bỏ' : 'thêm'} yêu thích ${tenMon}`,
          'error'
        );
      }
    });
  }

  addToGioHang(mon: any) {

    // 1. Lấy option theo món (GIỐNG ADMIN)
    this.optionService.getAllNhomOption().subscribe((res: any) => {

      const nhomOptions = (res.data || [])
        .filter((n: any) => n.ma_mon_an === mon.ma_mon_an)
        .map((n: any) => ({
          ...n,
          option_items: n.OptionItems || []
        }));

      // 2. Mở dialog
      const dialogRef = this.dialog.open(ThemGioHangDialog, {
        data: {
          mon: mon,              // chỉ cần data món từ list
          options: nhomOptions   // lấy riêng option
        },
        width: '85vw',
        maxWidth: '900px',
        height: '80vh'
      });

      // 3. handle result
      dialogRef.afterClosed().subscribe(result => {

        if (!result) return;

        const { mon, soLuong, selectedOptions } = result;
        const token = localStorage.getItem('token');

        const payload = {
          ma_mon_an: mon.ma_mon_an,
          so_luong: soLuong,
          options: selectedOptions.map((o: any) => ({
            ma_nhom_option: o.ma_nhom_option,
            ma_option_item: o.ma_option_item,
            ten_nhom_option: o.ten_nhom_option,
            ten_option: o.ten_option,
            gia_them: o.gia_them
          }))
        };

        // ❌ GUEST → LOCAL
        if (!token) {
          this.cartService.addLocal({
            ...mon,
            soLuong,
            options: payload.options
          });
          this.showToast('Đã thêm vào giỏ hàng', 'success');
          return;
        }

        // ✅ LOGIN → DB
        const userId = Number(localStorage.getItem('ma_nguoi_dung'));

        this.cartService.addDB(payload).subscribe(() => {
          this.cartService.loadCountFromDB(userId);
          this.showToast('Đã thêm vào giỏ hàng', 'success');
        });

      });

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

  loadRatings() {
    this.danhGiaService.getRatingByMon().subscribe((res: any) => {

      this.ratingsMap = {};

      const data = res?.data || res || [];

      data.forEach((item: any) => {
        this.ratingsMap[item.ma_mon_an] = item;
      });

    });
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
