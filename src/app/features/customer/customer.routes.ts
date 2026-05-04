import { Routes } from '@angular/router';
import { CustomerLayout } from '../../core/layouts/customer/customer-layout';
import { GoiMonMenu } from './goi-mon-menu/goi-mon-menu';

export const customerRoutes: Routes = [
  {
    path: '',
    component: CustomerLayout,
    children: [
      { path: '', redirectTo: 'goimon/menu', pathMatch: 'full' },
      { path: 'goimon/menu', component: GoiMonMenu, title: 'Gọi món' },
    ],
  },
];
