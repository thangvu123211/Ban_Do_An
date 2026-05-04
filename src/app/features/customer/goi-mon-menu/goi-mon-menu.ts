import { HttpClient } from '@angular/common/http';
import { Component, HostListener, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ToastMessageComponent } from '../../../Shared/toasts_message/toast-message/toast-message';
import { QuanLyMonAn } from '../../../core/services/QuanLyMonAn.service';
import { MATERIAL } from '../../../Shared/material';
import { QuanLyLoaiMonAn } from '../../../core/services/QuanLyLoaiMonAnService';
import { GoiMonService } from '../../../core/services/GoiMon.Service';
import { QuanLyBanAnService } from '../../../core/services/QuanLyBanAn.service';
import { MatDialog } from '@angular/material/dialog';
import { DanhSachMonAn } from '../danh-sach-mon-an/danh-sach-mon-an';
import { GioHang } from '../gio-hang/gio-hang';


export interface MonAn {
  ma_mon_an: number;
  ma_loai_mon_an: number;
  ten_mon_an: string;
  gia_tien: number;
  trang_thai: number;
  anh_mon_an: any[];
}
export interface LoaiMonAn {
  ma_loai_mon_an: number;
  ten_loai_mon_an: string;
  anh_loai_mon_an: string;
}
@Component({
  selector: 'app-goi-mon-menu',
  standalone: true,
  imports: [
    MATERIAL,
    ToastMessageComponent
  ],
  templateUrl: './goi-mon-menu.html',
  styleUrls: ['./goi-mon-menu.scss']
})
export class GoiMonMenu implements OnInit {
  selectedLoai: number | null = null;
  loaiMonAnList: any[] = [];
  monAnList: any[] = [];
  gioHang: any[] = [];
  maBan: number = 0;
  tenBan: string = '';
  showGioHang: boolean = false;
  toastMessage: string = '';
  toastType: 'success' | 'warn' | 'error' = 'success';
  showToast: boolean = false;

  MonAn: any[] = [];
  loaimonan: any[] = [];
  tatCaMonAn: any[] = [];

  screenWidth = window.innerWidth;

  showNotification(message: string, type: 'success' | 'warn' | 'error' = 'success') {
    this.toastMessage = message;
    this.toastType = type;
    this.showToast = true;

    setTimeout(() => {
      this.showToast = false;
    }, 3000); // 3 giây tự tắt
  }


  constructor(
    private http: HttpClient,
    private goiMonService: GoiMonService,
    private route: ActivatedRoute,
    private quanlimonan: QuanLyMonAn,
    private quanliloaimonan: QuanLyLoaiMonAn,
    private quanLyBanAn: QuanLyBanAnService,
    private dialog: MatDialog
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

  

  /** Khi nhập trực tiếp số lượng */
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
  goiMon() {

    if (!this.maBan) {
      this.showNotification("Chưa chọn bàn!", "warn");
      return;
    }

    if (this.gioHang.length === 0) {
      this.showNotification("Giỏ hàng trống!", "warn");
      return;
    }

    const monAns = this.gioHang.map(item => {
      return {
        ma_mon_an: item.ma_mon_an,
        so_luong: item.soLuong
      };
    });

    const body = {
      ma_ban: this.maBan,
      mon_ans: monAns
    };

    console.log("DATA GUI API:", JSON.stringify(body));

    this.goiMonService.goiMon(body).subscribe({
      next: (res: any) => {
        console.log("API RESPONSE:", res);

        if (res && res.message) {
          this.showNotification(res.message, "success");
        } else {
          this.showNotification("Gọi món thành công!", "success");
        }

        this.huyGioHang();
      },
      error: (err) => {
        console.error("API ERROR:", err);
        this.showNotification("Có lỗi khi gọi món!", "error");
      }

    });

  }



  xemDanhSachMonAnDaGoi() {
    this.dialog.open(DanhSachMonAn, {
      width: '500px',
      maxWidth: '110vw',
      panelClass: 'custom-dialog',
      //data: lienHe
    });
  }

  XemGioHang() {
  if (this.gioHang.length === 0) {
    this.showNotification('Giỏ hàng trống!', 'warn');
    return;
  }

  this.dialog.open(GioHang, {
    width: '90vw',
    maxWidth: '500px',
    maxHeight: '85vh',
    panelClass: 'gio-hang-dialog',
    data: {
      gioHang: this.gioHang,
      maBan: this.maBan,
      tenBan: this.tenBan,
      onGoiMon: () => this.goiMon()
    }
  });
}

  
addToGioHang(mon: any): void {
  const found = this.gioHang.find(i => i.ma_mon_an === mon.ma_mon_an);

  if (found) {
    found.soLuong += 1;
  } else {
    this.gioHang.push({
      ...mon,
      soLuong: 1
    });
  }
}

get tongSoMon(): number {
  return this.gioHang.reduce((sum, i) => sum + i.soLuong, 0);
}

  ngOnInit() {
    this.getAllLoaiMonAn();
    this.getAllMonAn();
    this.route.queryParams.subscribe(params => {
      this.maBan = Number(params['table']);
      if (this.maBan) this.getBanInfo();
    });

    this.getAllMonAn();
    this.screenWidth = window.innerWidth;
  }

}
