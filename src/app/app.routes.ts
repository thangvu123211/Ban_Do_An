import { Routes } from '@angular/router';
import { NotFound } from './pages/not-found/not-found';
import { AuthGuard } from './core/guards/auth.guard/auth.guard';
import { RoleGuard } from './core/guards/role.guard/role.guard';

export const routes: Routes = [
  {
    path: '',
    loadChildren: () =>
      import('./features/guest/guest.routes').then(m => m.guestRoutes),
  },
  {
    path: 'admin',
    canActivate:[AuthGuard,RoleGuard],
    data: { roles: ['admin'] },
    loadChildren: () =>
      import('./features/admin/admin.routes').then(m => m.adminRoutes),
  },
  {
    path: 'user',
    canActivate:[AuthGuard,RoleGuard],
    data: { roles: ['user'] },
    loadChildren: () =>
      import('./features/user/user.routes').then(m => m.userRoutes),
  },
  // {
  //   path: 'customer',
  //   canActivate:[],
  //   data: { roles: ['customer'] },
  //   loadChildren: () =>
  //     import('./features/customer/customer.routes').then(m => m.customerRoutes),
  // },
  { path: '**', component: NotFound, title: 'Trang không tồn tại' },
];
