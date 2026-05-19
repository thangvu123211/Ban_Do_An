import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { SidebarService } from '../../../services/WebService/sidebar.service';
import { Router } from '@angular/router';
import { MATERIAL } from '../../../../Shared/material';

@Component({
  selector: 'app-sidebar-shipper',
  imports: [MATERIAL],
  templateUrl: './sidebar-shipper.html',
  styleUrl: './sidebar-shipper.scss'
})
export class SidebarShipper implements OnInit {
  hoten = '';
  email = '';

  public menuItems = [
    { link: '/shipper', icon: 'dashboard', text: 'Trang quản trị' },
    { link: '/shipper/trang-ca-nhan', icon: 'account_circle', text: 'Trang cá nhân' },
    { link: '/shipper/don-hang', icon: 'local_shipping', text: 'Trang cá nhân' },
  ];



  collapsed = false;
  @Output() collapsedChange = new EventEmitter<boolean>();


  constructor(
    private router: Router,
    private sidebarService: SidebarService
  ) {
    const token = localStorage.getItem('token');
    const user = localStorage.getItem('user');
    const role = localStorage.getItem('role');

    // Chỉ check token + user + role
    if (!token || !user || role !== 'shipper') {
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
