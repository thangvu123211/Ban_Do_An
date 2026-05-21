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
import { ThemGioHangDialog } from '../dialogs/them-gio-hang-dialog/them-gio-hang-dialog';
import { OptionService } from '../../../core/services/option.service';



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
  tongSoMon = 0;

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

  sortPrice: 'asc' | 'desc' | '' = '';
  openSort = false;

  selectedLoaiName: string = '';


  screenWidth = window.innerWidth;

  showToast(message: string, type: 'success' | 'warn' | 'error') {
    this.toast.show = true;
    this.toast.message = message;
    this.toast.type = type;
    setTimeout(() => (this.toast.show = false), 3000);
  }



  constructor(

    private quanlimonan: QuanLyMonAn,
    private quanliloaimonan: QuanLyLoaiMonAn,
    private optionService: OptionService,
    private dialog: MatDialog,
    private cartService: CartService,
    private yeuThichService: YeuThichService,
    private route: ActivatedRoute
  ) { }

  /** Lấy tất cả món ăn */
  getAllMonAn() {
    this.selectedLoai = null;
    this.selectedLoaiName = '';
    this.sortPrice = '';

    this.quanlimonan.LayTatCaMonAn().subscribe({
      next: (res: any) => {
        // 🔥 CHỈ LẤY MÓN CÒN BÁN
        this.tatCaMonAn = res.data.filter(
          (mon: any) => mon.trang_thai == 1
        );

        this.MonAn = [...this.tatCaMonAn];
      }
    });
  }

  sortMonAn() {
    if (!this.MonAn) return;

    if (this.sortPrice === 'asc') {
      this.MonAn.sort((a, b) => a.gia_tien - b.gia_tien);
    }

    if (this.sortPrice === 'desc') {
      this.MonAn.sort((a, b) => b.gia_tien - a.gia_tien);
    }
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
  getMonAnTheoLoai(loaiId: number, tenLoai?: string) {
    this.selectedLoai = loaiId;
    this.selectedLoaiName = tenLoai || '';

    this.MonAn = this.tatCaMonAn.filter(
      mon => mon.ma_loai_mon_an === loaiId && mon.trang_thai == 1
    );
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



  ngOnInit() {
    this.getAllLoaiMonAn();
    this.getAllMonAn();
    this.loadFavorites();

    this.cartService.count$.subscribe(count => {
      this.tongSoMon = count;
    });

    this.route.queryParams.subscribe(params => {
      const loai = params['loai'];
      const ten = params['ten'];

      if (loai) {
        this.selectedLoai = +loai;
        this.selectedLoaiName = ten;

        // 🔥 gọi lại filter SAU khi data load xong
        this.applyFilterAfterLoad();
      }
    });
  }
  applyFilterAfterLoad() {
    if (!this.tatCaMonAn?.length) return;

    this.MonAn = this.tatCaMonAn.filter(
      mon =>
        mon.ma_loai_mon_an === this.selectedLoai &&
        mon.trang_thai == 1
    );
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
