import { Component } from '@angular/core';
import { MATERIAL } from '../../../Shared/material';
import { UserService } from '../../../core/services/user.service';

@Component({
  selector: 'app-trang-thong-ke',
  imports: [MATERIAL],
  templateUrl: './trang-thong-ke.html',
  styleUrl: './trang-thong-ke.scss'
})
export class TrangThongKe {
  constructor(private userService: UserService) {
  }
}
