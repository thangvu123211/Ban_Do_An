import { Routes } from '@angular/router';
import { UserLayout } from '../../core/layouts/user/user-layout';
import { DashboardUser } from './dashboard-user/dashboard-user';
import { DonHang } from './don-hang/don-hang';
import { TrangCaNhan } from './trang-ca-nhan/trang-ca-nhan';
import { QuanLyBinhLuan } from './quan-ly-binh-luan/quan-ly-binh-luan';
import { QuanLyDanhGia } from './quan-ly-danh-gia/quan-ly-danh-gia';
import { QuanLyDatBan } from './quan-ly-dat-ban/quan-ly-dat-ban';
import { DanhGia } from './dialogs/danh-gia/danh-gia';


export const userRoutes: Routes = [
  {
    path: '',
    component: UserLayout,
    children: [
      { path: '', component: DashboardUser, title: 'Trang cá nhân' },
      { path: 'don-hang', component: DonHang, title: 'Đơn hàng' },
      { path: 'trang-ca-nhan', component: TrangCaNhan, title: 'Trang cá nhân' },
      { path: 'quan-ly-binh-luan', component: QuanLyBinhLuan, title: 'Quản lý bình luận' },
      { path: 'quan-ly-danh-gia', component: QuanLyDanhGia, title: 'Quản lý đánh giá' },
      { path: 'quan-ly-dat-ban', component: QuanLyDatBan, title: 'Quản lý đặt bàn' },
      { path: 'danh_gia', component: DanhGia, title: 'Đánh giá' },
    ],
  },
];
