import { Component, OnInit } from '@angular/core';
import { MATERIAL } from '../../../Shared/material';
import { UserService } from '../../../core/services/user.service';

@Component({
  selector: 'app-dashboard-user',
  imports: [MATERIAL],
  templateUrl: './dashboard-user.html',
  styleUrl: './dashboard-user.scss'
})
export class DashboardUser implements OnInit {
  TongTienDaChi = 0;
  dangTai = true;

  constructor(private userService: UserService) {
  }



  loadTongHoaDon() {
    this.dangTai = true;

    this.userService.getSoTienDaChiCuaUser().subscribe({
      next: (res) => {
        this.TongTienDaChi = res.tong_tien_da_mua;
        this.dangTai = false;
      },
      error: (err) => {
        console.error('Lỗi load hóa đơn', err);
        this.dangTai = false;
      }
    });
  }
  ngOnInit(): void {
    this.loadTongHoaDon();
  }
}
