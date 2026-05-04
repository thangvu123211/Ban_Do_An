import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { AdminFooter } from "../../../core/layouts/admin/admin-footer/admin-footer";
import { AdminNavbar } from '../../../core/layouts/admin/admin-navbar/admin-navbar';
import { AdminSidebar } from '../../../core/layouts/admin/admin-sidebar/admin-sidebar';
import { Observable } from 'rxjs';

import { MATERIAL } from '../../../Shared/material';
import { SidebarService } from '../../services/WebService/sidebar.service';

@Component({
  selector: 'app-admin-layout',
  standalone: true,
  imports: [MATERIAL,RouterOutlet, AdminFooter, AdminNavbar, AdminSidebar],
  templateUrl: './admin-layout.html',
  styleUrls: ['./admin-layout.scss']
})
export class AdminLayout {
  collapsed$!: Observable<boolean>;

  constructor(private sidebarService: SidebarService) {
    this.collapsed$ = this.sidebarService.collapsed$;
  }
}
