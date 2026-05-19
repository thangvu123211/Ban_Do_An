import { Routes } from '@angular/router';
import { DonHang } from './don-hang/don-hang';
import { ShipperLayout } from '../../core/layouts/shipper/shipper-layout';
import { TrangCaNhan } from './trang-ca-nhan/trang-ca-nhan';


export const shipperRoutes: Routes = [
  {
    path: '',
    component: ShipperLayout,
    children: [
      { path: '', component: DonHang, title: 'Đơn hàng' },
      { path: 'trang-ca-nhan', component: TrangCaNhan, title: 'Trang cá nhân' },
      { path: 'don-hang', component: DonHang, title: 'Đơn hàng' },
    ],
  },
];
