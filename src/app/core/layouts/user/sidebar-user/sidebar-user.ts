import { Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { MATERIAL } from '../../../../Shared/material';

@Component({
  selector: 'app-sidebar-user',
  imports: [MATERIAL,RouterLink],
  templateUrl: './sidebar-user.html',
  styleUrl: './sidebar-user.scss'
})
export class SidebarUser {
  hoten = '';
  email = '';

  constructor(private router: Router) {
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

}
