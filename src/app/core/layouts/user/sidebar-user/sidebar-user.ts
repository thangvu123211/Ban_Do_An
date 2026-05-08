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
    { link: '/user/xem-hoa-don', icon: 'dashboard', text: 'Trang cá nhân' },
  ];
// { path: '', component: DashboardUser, title: 'Trang cá nhân' },
//       { path: 'xem-hoa-don', component: XemHoaDon, title: 'Xem hóa đơn' },
//       { path: 'tao-hoa-don', component: TaoHoaDon, title: 'Tạo hóa đơn' },
//       { path: 'thanh-toan', component: ThanhToan, title: 'Thanh toán' },
//     ],
  

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
    this.sidebarService.collapsed$.subscribe(value => this.collapsed = value);
  }

}
