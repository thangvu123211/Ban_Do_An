import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatDialog } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input'; // ✅ bổ sung
import { ActivatedRoute } from '@angular/router';
import { ToastMessageComponent } from '../../../Shared/toasts_message/toast-message/toast-message';
import { ChonbanDialog } from '../../../features/user/dialogs/chonban-dialog/chonban-dialog';

@Component({
  selector: 'app-tao-hoa-don',
  imports: [CommonModule,
    MatIconModule,
    MatCardModule,
    MatListModule,
    MatButtonModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    ToastMessageComponent],
  templateUrl: './tao-hoa-don.html',
  styleUrl: './tao-hoa-don.scss'
})
export class TaoHoaDon implements OnInit {
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

  showNotification(message: string, type: 'success' | 'warn' | 'error' = 'success') {
    this.toastMessage = message;
    this.toastType = type;
    this.showToast = true;

    setTimeout(() => {
      this.showToast = false;
    }, 3000); // 3 giây tự tắt
  }


  constructor(private http: HttpClient, private dialog: MatDialog, private route: ActivatedRoute) { }
  /** Lấy tất cả món ăn */
  getAllMonAn() {
    this.http.get<any>("http://localhost:3000/api/user/thucdon")
      .subscribe(res => {
        this.monAnList = res.MonAn;
        this.selectedLoai = null;
      });
  }

  /** Lấy tất cả loại món ăn */
  getAllLoaiMonAn() {
    this.http.get<any>("http://localhost:3000/api/user/thucdon/loai_mon_an")
      .subscribe(res => {
        this.loaiMonAnList = res.loai_mon_an;
      });
  }

  /** Lấy món ăn theo loại */
  getMonAnTheoLoai(loaiId: number) {
    this.http.get<any>(`http://localhost:3000/api/user/thucdon/loai_mon_an/${loaiId}`)
      .subscribe(res => {
        this.monAnList = res.MonAn;
        this.selectedLoai = loaiId;
      });
  }

  /** Thêm vào giỏ */
  addToGioHang(mon: any) {
    const found = this.gioHang.find(item => item.MA_MON_AN === mon.MA_MON_AN);
    if (found) {
      found.soLuong += 1;
    } else {
      this.gioHang.push({ ...mon, soLuong: 1 });
    }
  }


  get tieuDe(): string {
    if (this.selectedLoai === null) return 'Tất cả món';
    const loai = this.loaiMonAnList.find(l => l.MALOAIMONAN === this.selectedLoai);
    return loai ? loai.TENLOAIMONAN : 'Món ăn';
  }
  /** Tính tổng tiền (getter) */
  get tongTien(): number {
    return this.gioHang.reduce((sum, i) => sum + i.GIA * i.soLuong, 0);
  }

  /** Xóa món khỏi giỏ */
  removeFromGioHang(mon: any) {
    this.gioHang = this.gioHang.filter(item => item.MA_MON_AN !== mon.MA_MON_AN);
  }

  /** Tăng giảm số lượng */
  tangSoLuong(item: any) {
    item.soLuong++;
  }

  giamSoLuong(item: any) {
    if (item.soLuong > 1) {
      item.soLuong--;
    }
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
    this.http.get<any>(`http://localhost:3000/api/user/thucdon/ban_an/${this.maBan}`)
      .subscribe(res => {
        this.tenBan = res.TENBAN;
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

    const body = {
      maBan: this.maBan,
      tongTien: this.tongTien,
      chiTiet: this.gioHang
    };

    this.http.post<any>("http://localhost:3000/api/user/thucdon/goi_mon", body)
      .subscribe({
        next: res => {
          this.showNotification(`Gọi món thành công! Mã hóa đơn: ${res.maHD}`, "success");
          this.huyGioHang();
        },
        error: err => {
          console.error(err);
          this.showNotification("Có lỗi khi gọi món!", "error");
        }
      });
  }
  openChonBan() {
    const dialogRef = this.dialog.open(ChonbanDialog, {
      width: '90%',
      maxWidth: '1000px'
    });

    dialogRef.afterClosed().subscribe(selectedTable => {
      if (selectedTable) {
        this.maBan = selectedTable.MA_BAN;
        this.tenBan = selectedTable.TENBAN;
        this.showNotification(`Đã chọn bàn: ${selectedTable.TENBAN}`, 'success');
      }
    });
  }
  ngOnInit() {
    this.getAllLoaiMonAn();
    this.getAllMonAn();
    this.route.queryParams.subscribe(params => {
      this.maBan = params['table'];
      if (this.maBan) this.getBanInfo();
    });

    this.getAllMonAn();
  }

}
