import { Component,Output, EventEmitter, OnInit } from '@angular/core';
import { Router,RouterModule } from '@angular/router';

import { MATERIAL } from '../../../../Shared/material';
import { SidebarService } from '../../../services/WebService/sidebar.service';
declare interface RouteInfo {
  path: string;
  title: string;
}

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
    { link: '/admin/user_profile', icon: 'groups', text: 'Bảng Nhân Viên' },
    { link: '/admin/mon_an', icon: 'dinner_dining', text: 'Món Ăn' },
    { link: '/admin/loai_mon_an', icon: 'room_service', text: 'Loại Món Ăn' },
    { link: '/admin/ban_an', icon: 'deck', text: 'Bàn Ăn' },
    { link: '/admin/khach_hang_dat_ban', icon: 'table_bar', text: 'Khách Hàng Đặt Bàn' },
    { link: '/admin/hoa_don', icon: 'receipt_long', text: 'Hóa Đơn' },
    { link: '/admin/lien_he', icon: 'contact_emergency', text: 'Liên Hệ' }
  ];

  constructor(private router: Router,private sidebarService: SidebarService) { }

  ngOnInit(): void {
    this.sidebarService.collapsed$.subscribe(value => this.collapsed = value);
  }
}
