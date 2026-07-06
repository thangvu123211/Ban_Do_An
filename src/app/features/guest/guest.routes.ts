import { Routes } from '@angular/router';
import { GuestLayout } from '../../core/layouts/guest/guest-layout';
import { HomeComponents } from './home-components/home-components';
import { LoginComponent } from '../../pages/login/login';
import { Register } from '../../pages/register/register';
import { Account } from './account/account';
import { DatBan } from './dat-ban/dat-ban';
import { Blog } from './blog/blog';
import { Menu } from './menu/menu';
import { LienHe } from './lien-he/lien-he';
import { Hello } from './hello/hello';
import { DoiTacWebsite } from './doi-tac-website/doi-tac-website';
import { GioHang } from './gio-hang/gio-hang';
import { ForgotPassword } from '../../pages/forgot-password/forgot-password';

export const guestRoutes: Routes = [
  {
    path: '',
    component: GuestLayout,
    children: [
      { path: '', component: HomeComponents, title: 'Trang chủ' },
      { path: 'home', component: HomeComponents, title: 'Trang chủ' },
      { path: 'login', component: LoginComponent, title: 'Đăng nhập' },
      { path: 'register', component: Register, title: 'Tạo tài khoản' },
      { path: 'account', component: Account, title: 'Trang cá nhân' },
      { path: 'datban', component: DatBan, title: 'Đặt bàn' },
      { path: 'blog', component: Blog, title: 'Thông tin nhà hàng' },
      { path: 'thucdon', component: Menu, title: 'Thực đơn' },
      { path: 'thucdon/:loai/:ten', component: Menu, title: 'Thực đơn' },
      { path: 'lienhe', component: LienHe, title: 'Liên hệ' },
      { path: 'test', component: Hello, title: 'test' },
      { path: 'doi_tac', component: DoiTacWebsite, title: 'Đối tác website' },
      { path: 'gio_hang', component: GioHang, title: 'Giỏ hàng' },
      { path: 'forgot_password', component: ForgotPassword, title: 'Quên mật khẩu' },
    ],
  },
];
