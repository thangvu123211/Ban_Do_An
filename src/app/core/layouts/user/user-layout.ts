import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { SidebarUser } from '../../../core/layouts/user/sidebar-user/sidebar-user';
import { HeaderUser } from '../../../core/layouts/user/header-user/header-user';
import { MATERIAL } from '../../../Shared/material';
@Component({
  selector: 'app-user-layout',
  standalone: true,
  imports: [
    RouterOutlet,
    SidebarUser,
    HeaderUser,
    MATERIAL
    ],
  templateUrl: './user-layout.html',
  styleUrls: ['./user-layout.scss']
})
export class UserLayout {
  
}
