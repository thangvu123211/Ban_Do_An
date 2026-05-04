import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms'; // cần cho [(ngModel)]
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialogComponent } from '../../../Shared/dialogs/confirm-dialog/confirm-dialog';

@Component({
  selector: 'app-hoa-don',
  standalone: true, // dùng standalone
  imports: [CommonModule, FormsModule], // thêm FormsModule để binding input
  templateUrl: './hoa-don.html',
  styleUrls: ['./hoa-don.scss']
})
export class HoaDon implements OnInit {
  HoaDon: any[] = [];
  ChiTietHoaDon: any[] = [];
  tongTienCT: number = 0;
  MonAn: any[] = [];
  editingCTHD: any = null; // lưu CTHD đang sửa
  selectedCT: any = null;
  donGia: number = 0;

  constructor(private http: HttpClient, private dialog: MatDialog) { }

  // Lấy danh sách hóa đơn
  load_listHoaDon() {
    this.http.get<any>('http://localhost:3000/api/admin/listHoaDon').subscribe({
      next: (res) => {
        this.HoaDon = res.HoaDon;
        console.log('Hóa Đơn:', this.HoaDon);
        this.tinhTongTien();
      },
      error: (err) => console.error('Lỗi lấy Hóa Đơn', err)
    });
  }

  // Lấy chi tiết hóa đơn theo MA_HD
  load_chiTietHoaDon(mahd: number) {
    this.http.get<any[]>(`http://localhost:3000/api/admin/chitiethoadon/${mahd}`).subscribe({
      next: (res) => {
        this.ChiTietHoaDon = res;
        console.log("Chi tiết hóa đơn:", this.ChiTietHoaDon);

        // tính lại tổng tiền mỗi lần load chi tiết
        this.tinhTongTien();
      }
    });
  }


  // Lấy danh sách món ăn
  load_listMonAn() {
    this.http.get<any>('http://localhost:3000/api/admin/list_MonAn').subscribe({
      next: (res) => {
        this.MonAn = res.MonAn;
        console.log('Món Ăn:', this.MonAn);
      },
      error: (err) => console.error('Lỗi lấy Món Ăn', err)
    });
  }

  // Chọn CTHD để sửa
  editCTHD(ct: any) {
    this.editingCTHD = { ...ct };
    console.log("CTHD đang sửa:", this.editingCTHD);
  }

  // Khi chọn món → update đơn giá + thành tiền
  onMonAnChange() {
    const mon = this.MonAn.find(m => m.MA_MON_AN == this.editingCTHD.MA_MON_AN);
    if (mon) {
      this.editingCTHD.DON_GIA = mon.GIA;   // ✅ lấy GIA từ bảng món ăn, gán cho DON_GIA
      this.tinhTienCT();
    }
  }

  // Tính lại thành tiền
  tinhTienCT() {
    this.editingCTHD.THANH_TIEN = this.editingCTHD.SO_LUONG * this.editingCTHD.DON_GIA;
  }

  // Gọi API cập nhật CTHD
  updateCTHD() {
    const body = {
      MA_MON_AN: this.editingCTHD.MA_MON_AN,
      SO_LUONG: this.editingCTHD.SO_LUONG
    };

    this.http.put(
      `http://localhost:3000/api/admin/updateCTHD/${this.editingCTHD.MA_CT}`,
      body
    ).subscribe({
      next: (res: any) => {
        console.log("✅ Cập nhật thành công:", res);

        // reload chi tiết hóa đơn
        this.load_chiTietHoaDon(this.editingCTHD.MA_HD);

        // reload danh sách hóa đơn để cập nhật tổng tiền
        this.load_listHoaDon();

        // clear form edit
        this.editingCTHD = null;
      },
      error: (err) => console.error("❌ Lỗi cập nhật:", err)
    });
  }
  xoaHoaDon(maHD: number) {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '350px',
      data: { message: `Bạn có chắc chắn muốn xóa hóa đơn #${maHD} không?` }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        // Gọi API backend để xóa
        this.http.delete(`http://localhost:3000/api/admin/deleteHoaDon/${maHD}`).subscribe({
          next: () => {
            this.HoaDon = this.HoaDon.filter(hd => hd.MA_HD !== maHD);
          },
          error: err => {
            console.error('Lỗi khi xóa hóa đơn:', err);
          }
        });
      }
    });
  }
  xoaCTHD(cthd: any) {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '350px',
      data: { message: `Bạn có chắc chắn muốn xóa món #${cthd.TEN_MON} trong hóa đơn #${cthd.MA_HD} không?` }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.http.delete(`http://localhost:3000/api/admin/deleteCTHD/${cthd.MA_CT}`)
          .subscribe({
            next: (res: any) => {
              console.log(`✅ Xóa CTHD #${cthd.MA_CT} thành công`);

              // Reload chi tiết hóa đơn
              this.load_chiTietHoaDon(cthd.MA_HD);

              // Reload danh sách hóa đơn để cập nhật tổng tiền
              this.load_listHoaDon();
            },
            error: err => console.error('❌ Lỗi khi xóa CTHD:', err)
          });
      }
    });
  }

  // Tính tổng tiền CTHD
  tinhTongTien() {
    this.tongTienCT = this.ChiTietHoaDon.reduce((sum, item) => sum + Number(item.THANH_TIEN), 0);
  }
  startEdit(cthd: any) {
    this.editingCTHD = { ...cthd };  // ✅ copy lại cả MA_CT
    console.log("Đang sửa CTHD:", this.editingCTHD);
  }
  // Quay lại danh sách hóa đơn
  quayLai() {
    this.ChiTietHoaDon = [];
    this.tongTienCT = 0;
    this.editingCTHD = null;
    this.tinhTongTien();
  }

  ngOnInit(): void {
    this.load_listHoaDon();
    this.load_listMonAn();
  }
}
