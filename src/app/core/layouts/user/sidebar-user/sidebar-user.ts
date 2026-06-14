import { Component,Output, EventEmitter, OnInit } from '@angular/core';
import { Router,RouterLink,RouterModule } from '@angular/router';

import { MATERIAL } from '../../../../Shared/material';
import { SidebarService } from '../../../services/WebService/sidebar.service';

@Component({
  selector: 'app-sidebar-user',
  imports: [MATERIAL, RouterLink],
  templateUrl: './sidebar-user.html',
  styleUrl: './sidebar-user.scss'
})
export class SidebarUser implements OnInit {
  hoten = '';
  email = '';

  public menuItems = [
    { link: '/user', icon: 'dashboard', text: 'Trang quản trị' },
    { link: '/user/trang-ca-nhan', icon: 'account_circle', text: 'Trang cá nhân' },
    { link: '/user/don-hang', icon: 'local_shipping', text: 'Đơn hàng' },
    { link: '/user/quan-ly-danh-gia', icon: 'stars_2', text: 'Quản lý Đánh quá' },
    { link: '/user/quan-ly-dat-ban', icon: 'table_bar', text: 'Quản lý đặt bàn' },
  ];

  

  collapsed = false;
  @Output() collapsedChange = new EventEmitter<boolean>();


  constructor(
    private router: Router,
    private sidebarService: SidebarService
  ) 
  {
    const token = localStorage.getItem('token');
    const user = localStorage.getItem('user');
    const role = localStorage.getItem('role');

    // Chỉ check token + user + role
    if (!token || !user || role !== 'user') {
      // redirect về login nếu không hợp lệ
      this.router.navigate(['/login']);
      return;
    }

    const data = JSON.parse(user);
    this.hoten = data.hoten;
    this.email = data.email;
  }


  ngOnInit(): void {

  }

}
