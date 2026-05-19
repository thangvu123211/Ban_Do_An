import { Component, OnInit } from '@angular/core';
import { MATERIAL } from '../../../../Shared/material';
import { AuthService } from '../../../services/auth.service';
import { QuanLyNhanVienService } from '../../../services/QuanLyNhanVien.service';

@Component({
  selector: 'app-header-shipper',
  imports: [MATERIAL],
  templateUrl: './header-shipper.html',
  styleUrl: './header-shipper.scss'
})
export class HeaderShipper implements OnInit {

  Thongtinnguoidung: any = null;
  Anhnguoidung: string = 'assets/user.jpg';

  constructor(
    private authService: AuthService,
    private userService: QuanLyNhanVienService) { }

  loadUser(ma: number) {
    this.userService.LayNhanVienTheoID(ma).subscribe({
      next: (res) => {
        this.Thongtinnguoidung = res.data ?? res;

        if (this.Thongtinnguoidung?.anh_nguoi_dung?.length) {
          this.Anhnguoidung =
            this.Thongtinnguoidung.anh_nguoi_dung[0].url;
        }
      },
      error: (err) => {
        console.log('Load user error', err);
      }
    });
  }
  ngOnInit(): void {
    const ma = Number(localStorage.getItem('ma_nguoi_dung'));

    if (ma) {
      this.loadUser(ma);
    }
  }



  logout() {
    this.authService.logout();
  }
}