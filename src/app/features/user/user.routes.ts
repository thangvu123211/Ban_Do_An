import { Routes } from '@angular/router';
import { UserLayout } from '../../core/layouts/user/user-layout';
import { DashboardUser } from './dashboard-user/dashboard-user';
import { DonHang } from './don-hang/don-hang';


export const userRoutes: Routes = [
  {
    path: '',
    component: UserLayout,
    children: [
      { path: '', component: DashboardUser, title: 'Trang cá nhân' },
      { path: 'don-hang', component: DonHang, title: 'Đơn hàng' },
    ],
  },
];
