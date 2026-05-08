import { Component, OnInit, AfterViewChecked } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { RouterLink } from '@angular/router';
import * as AOS from 'aos';
import { MATERIAL } from '../../../Shared/material';

@Component({
  selector: 'app-blog',
  imports: [MatCardModule ,MATERIAL],
  templateUrl: './blog.html',
  styleUrls: ['./blog.scss']  // sửa từ styleUrl => styleUrls
})
export class Blog implements OnInit, AfterViewChecked {

  ngOnInit(): void {
    AOS.init({
      duration: 1000, // thời gian hiệu ứng (ms)
      once: false,    // ✅ cho phép chạy nhiều lần
      mirror: true,   // ✅ animation chạy khi scroll lên
      offset: 100,    // khoảng cách trước khi trigger animation
    });
  }

  // Khi DOM thay đổi (ví dụ *ngFor, lazy load, etc.)
  ngAfterViewChecked(): void {
    AOS.refresh(); // cập nhật animation
  }
}
