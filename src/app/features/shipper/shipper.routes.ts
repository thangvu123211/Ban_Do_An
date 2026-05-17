import { Routes } from '@angular/router';
import { DonHang } from './don-hang/don-hang';
import { ShipperLayout } from '../../core/layouts/shipper/shipper-layout';


export const shipperRoutes: Routes = [
  {
    path: '',
    component: ShipperLayout,
    children: [
      { path: '', component: DonHang, title: 'Quản lý đơn hàng' },
    ],
  },
];
