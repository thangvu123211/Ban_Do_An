import { Routes } from '@angular/router';
import { DonHang } from './don-hang/don-hang';
import { ShipperLayout } from '../../core/layouts/shipper/shipper-layout';
import { TrangCaNhan } from './trang-ca-nhan/trang-ca-nhan';
import { TrangThongKe } from './trang-thong-ke/trang-thong-ke';


export const shipperRoutes: Routes = [
  {
    path: '',
    component: ShipperLayout,
    children: [
      { path: '', component: TrangThongKe, title: 'Trang thống kê' },
      { path: 'trang-ca-nhan', component: TrangCaNhan, title: 'Trang cá nhân' },
      { path: 'quan-ly-don-hang', component: DonHang, title: 'Quản lý đơn hàng' },
    ],
  },
];
