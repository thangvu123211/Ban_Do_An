import { Routes } from '@angular/router';
import { AdminLayout } from '../../core/layouts/admin/admin-layout';
import { Dashboardcomponent } from './dashboard/dashboardcomponent';
import { Account_admincomponent } from './account_admin/account_admin';
import { UserFrofileComponents } from './user_frofile/user_frofile';
import { MonAn } from './mon-an/mon-an';
import { KhachHangDatBan } from './khach-hang-dat-ban/khach-hang-dat-ban';
import { LoaiMonAn } from './loai-mon-an/loai-mon-an';
import { BanAn } from './ban-an/ban-an';
import { HoaDon } from './hoa-don/hoa-don';
import { LienHe } from './lien-he/lien-he';
import { MaGiamGia } from './ma-giam-gia/ma-giam-gia';

export const adminRoutes: Routes = [
  {
    path: '',
    component: AdminLayout,
    children: [
      { path: '', component: Dashboardcomponent, title: 'Trang quản trị' },
      { path: 'dashboard', component: Dashboardcomponent, title: 'Trang quản trị' },
      { path: 'account_admin', component: Account_admincomponent, title: 'Tài khoản admin' },
      { path: 'user_profile', component: UserFrofileComponents, title: 'Quản lí nhân viên' },
      { path: 'mon_an', component: MonAn, title: 'Quản lí món ăn' },
      { path: 'khach_hang_dat_ban', component: KhachHangDatBan, title: 'Quản lí đặt bàn' },
      { path: 'loai_mon_an', component: LoaiMonAn, title: 'Quản lí loại món ăn' },
      { path: 'ban_an', component: BanAn, title: 'Quản lí bàn ăn' },
      { path: 'hoa_don', component: HoaDon, title: 'Quản lí hóa đơn' },
      { path: 'lien_he', component: LienHe, title: 'Quản lí liên hệ' },
      { path: 'ma_giam_gia', component: MaGiamGia, title: 'Quản lí mã giảm giá' },
    ],
  },
];
