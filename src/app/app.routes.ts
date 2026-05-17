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
  {
    path: 'shipper',
    canActivate:[AuthGuard,RoleGuard],
    data: { roles: ['shipper'] },
    loadChildren: () =>
      import('./features/shipper/shipper.routes').then(m => m.shipperRoutes),
  },
  { path: '**', component: NotFound, title: 'Trang không tồn tại' },
];
