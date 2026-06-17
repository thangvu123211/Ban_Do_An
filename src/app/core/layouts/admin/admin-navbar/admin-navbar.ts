import { Component, OnInit, ElementRef, effect } from '@angular/core';
import { Location } from '@angular/common';
import { Router } from '@angular/router';
import { AdminService } from '../../../../core/services/admin.service';
import { AuthService } from '../../../services/auth.service';

import { MATERIAL } from '../../../../Shared/material';
import { SidebarService } from '../../../services/WebService/sidebar.service';
import { MatDialog } from '@angular/material/dialog';
import { BaoCao } from '../Dialog/bao-cao/bao-cao';


@Component({
  selector: 'app-admin-navbar',
  standalone: true,
  imports: [MATERIAL],
  templateUrl: './admin-navbar.html',
  styleUrls: ['./admin-navbar.scss']
})
export class AdminNavbar implements OnInit {

  adminInfo: any = null;
  previewImage: string = 'assets/user.jpg';
  isExpanded = false;

  isMobile = false;


  constructor(
    private location: Location,
    private element: ElementRef,
    private router: Router,
    private authAdmin: AdminService,
    private authService: AuthService,
    public sidebarService: SidebarService,
    private dialog: MatDialog
  ) {
  }
  openExportDialog() {
    const dialogRef = this.dialog.open(BaoCao, {
      width: '100%',         // Cho phép responsive tự co giãn
      maxWidth: '576px',     // Tăng kích thước tối đa lên 576px (rộng rãi và đẹp hơn)
      panelClass: 'custom-dialog-container' // Thêm nếu bạn muốn custom sâu bằng CSS bên ngoài
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.exportBaoCao(result);
      }
    });
  }
  exportBaoCao(data: any) {

    const fileName = this.formatFileName(data.type, data);

    if (data.type === 'ngay') {
      this.authAdmin.exportExportDoanhThuNgay(data.ngay)
        .subscribe(res => this.downloadFile(res, fileName));
    }

    else if (data.type === 'thang') {
      this.authAdmin.exportExportDoanhThuThang(data.thang, data.nam)
        .subscribe(res => this.downloadFile(res, fileName));
    }

    else if (data.type === 'nam') {
      this.authAdmin.exportDoanhThuNam(data.nam)
        .subscribe(res => this.downloadFile(res, fileName));
    }
  }

  formatFileName(type: string, data: any): string {

    const pad = (n: number) => String(n).padStart(2, '0');

    if (type === 'ngay') {
      return `doanh_thu_ngay_${data.ngay}.xlsx`;
    }

    if (type === 'thang') {
      return `doanh_thu_thang_${pad(data.thang)}-${data.nam}.xlsx`;
    }

    if (type === 'nam') {
      return `doanh_thu_nam_${data.nam}.xlsx`;
    }

    return `bao_cao.xlsx`;
  }

  downloadFile(data: Blob, fileName: string) {
    const blob = new Blob([data], {
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    });

    const url = window.URL.createObjectURL(blob);

    const a = document.createElement('a');
    a.href = url;
    a.download = fileName;
    a.click();

    window.URL.revokeObjectURL(url);
  }


  ngOnInit() {
    this.authAdmin.adminInfo$.subscribe((admin) => {
      if (admin) {
        this.adminInfo = admin;
        this.previewImage = admin?.anh_nguoi_dung?.length
          ? admin.anh_nguoi_dung[0].url
          : 'assets/user.jpg';
      }
    });

    // Lấy token để lấy ma_nv
    const token = localStorage.getItem('token');
    const payload = token ? JSON.parse(atob(token.split('.')[1])) : null;
    const ma_nguoi_dung = payload?.id;

    if (ma_nguoi_dung) {
      this.loadNhanVienById(ma_nguoi_dung);
    }
    this.checkScreen();
    window.addEventListener('resize', () => this.checkScreen());
  }

  loadNhanVienById(ma_nguoi_dung: number) {
    this.authAdmin.LayNhanVienTheoID(ma_nguoi_dung).subscribe({
      next: (res) => {
        this.adminInfo = res.data ?? res;
        if (this.adminInfo.anh_nguoi_dung?.length) {
          this.previewImage = this.adminInfo.anh_nguoi_dung[0].url;
        }
      },
      error: (err) => {
        console.error('Lỗi khi lấy thông tin nhân viên:', err);
      }
    });
  }

  logout() {
    this.authService.logout();
  }
  checkScreen() {
    this.isMobile = window.innerWidth < 768;
  }
  trangCaNhan() {
    this.router.navigate(['/admin/account_admin']);
  }

}
