import { Component } from '@angular/core';
import { Observable } from 'rxjs';
import { SidebarService } from '../../services/WebService/sidebar.service';
import { RouterOutlet } from '@angular/router';
import { MATERIAL } from '../../../Shared/material';
import { SidebarShipper } from './sidebar-shipper/sidebar-shipper';
import { HeaderShipper } from './header-shipper/header-shipper';

@Component({
  selector: 'app-shipper-layout',
  imports: [
    RouterOutlet,
    HeaderShipper,
    SidebarShipper,
    MATERIAL,],
  templateUrl: './shipper-layout.html',
  styleUrl: './shipper-layout.scss'
})
export class ShipperLayout {
  collapsed$!: Observable<boolean>;

  constructor(private sidebarService: SidebarService) {
  }
}
