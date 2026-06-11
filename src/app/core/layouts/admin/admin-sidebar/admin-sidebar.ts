import { Component,Output, EventEmitter, OnInit } from '@angular/core';
import { Router,RouterModule } from '@angular/router';

import { MATERIAL } from '../../../../Shared/material';
import { SidebarService } from '../../../services/WebService/sidebar.service';


@Component({
  selector: 'app-admin-sidebar',
  imports: [MATERIAL,RouterModule ],
  templateUrl: './admin-sidebar.html',
  styleUrl: './admin-sidebar.scss'
})


export class AdminSidebar implements OnInit {
  collapsed = false;
  @Output() collapsedChange = new EventEmitter<boolean>();


  public menuItems = [
    { link: '/admin/dashboard', icon: 'dashboard', text: 'Trang Tổng Quan' },
    { link: '/admin/account_admin', icon: 'person', text: 'Trang Cá Nhân' },
    { link: '/admin/nha_hang_cua_ban', icon: 'list_alt_add', text: 'Nhà hàng của bạn' },
    { link: '/admin/user_profile', icon: 'groups', text: 'Quản lý người dùng' },
    { link: '/admin/mon_an', icon: 'dinner_dining', text: 'Món Ăn' },
    { link: '/admin/loai_mon_an', icon: 'room_service', text: 'Loại Món Ăn' },
    { link: '/admin/option_mon_an', icon: 'local_dining', text: 'Option món ăn' },
    { link: '/admin/ban_an', icon: 'deck', text: 'Bàn Ăn' },
    { link: '/admin/khach_hang_dat_ban', icon: 'table_bar', text: 'Khách Hàng Đặt Bàn' },
    { link: '/admin/hoa_don', icon: 'receipt_long', text: 'Hóa Đơn' },
    { link: '/admin/lien_he', icon: 'contact_emergency', text: 'Liên Hệ' },
    { link: '/admin/ma_giam_gia', icon: 'attach_money', text: 'Mã Giảm Giá' },
    { link: '/admin/quan_ly_danh_gia_va_binh_luan', icon: 'comment', text: 'Quản lí Đgiá & Bluận' },
  ];

  constructor(private router: Router,private sidebarService: SidebarService) { }

  ngOnInit(): void {
    this.sidebarService.collapsed$.subscribe(value => this.collapsed = value);
  }
}
