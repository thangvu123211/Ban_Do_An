import { Component, OnInit, ElementRef, effect } from '@angular/core';
import { Location } from '@angular/common';
import { Router } from '@angular/router';
import { AdminService } from '../../../../core/services/admin.service';
import { AuthService } from '../../../services/auth.service';

import { MATERIAL } from '../../../../Shared/material';
import { SidebarService } from '../../../services/WebService/sidebar.service';


@Component({
  selector: 'app-admin-navbar',
  standalone: true,
  imports: [...MATERIAL],
  templateUrl: './admin-navbar.html',
  styleUrls: ['./admin-navbar.scss']
})
export class AdminNavbar implements OnInit {
  
  adminInfo: any = null;
  previewImage: string = 'assets/user.jpg';
  isExpanded = false;

  constructor(
    private location: Location,
    private element: ElementRef,
    private router: Router,
    private authAdmin: AdminService,
    private authService: AuthService,
    private sidebarService: SidebarService,
  ) {
  }

  toggleSidebar() {
    this.sidebarService.toggle();
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
}
