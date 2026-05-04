import { Routes } from '@angular/router';
import { UserLayout } from '../../core/layouts/user/user-layout';
import { DashboardUser } from './dashboard-user/dashboard-user';
import { XemHoaDon } from './xem-hoa-don/xem-hoa-don';
import { TaoHoaDon } from './tao-hoa-don/tao-hoa-don';
import { ThanhToan } from './thanh-toan/thanh-toan';

export const userRoutes: Routes = [
  {
    path: '',
    component: UserLayout,
    children: [
      { path: '', component: DashboardUser, title: 'Trang cá nhân' },
      { path: 'xem-hoa-don', component: XemHoaDon, title: 'Xem hóa đơn' },
      { path: 'tao-hoa-don', component: TaoHoaDon, title: 'Tạo hóa đơn' },
      { path: 'thanh-toan', component: ThanhToan, title: 'Thanh toán' },
    ],
  },
];
