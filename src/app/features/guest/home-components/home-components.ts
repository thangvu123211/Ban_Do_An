import { Component, OnDestroy, OnInit } from '@angular/core';
import * as AOS from 'aos';
import { QuanLyLoaiMonAn } from '../../../core/services/QuanLyLoaiMonAnService';
import { QuanLyMonAn } from '../../../core/services/QuanLyMonAn.service';
import { MATERIAL } from '../../../Shared/material';
import { ViewChild, ElementRef } from '@angular/core';

@Component({
  selector: 'app-home-components',
  imports: [

    MATERIAL
  ],
  templateUrl: './home-components.html',
  styleUrls: ['./home-components.scss']
})
export class HomeComponents implements OnInit, OnDestroy {
  images = [
    'assets/banner/banner12.avif',
    'assets/banner/banner9.jpg',
    'assets/banner/banner13.avif',
    'assets/banner/banner.avif'
  ];

  danhSachLoaiMonAn: any[] = [];
  monAnNoiBat: any[] = [];

  constructor(
    private QuanLyLoaiMonAn: QuanLyLoaiMonAn,
    private quanLyMonAn: QuanLyMonAn
  ) { }

  currentIndex = 0;
  private intervalId: any;

  ngOnInit() {
    // ✅ Khởi tạo hiệu ứng AOS
    AOS.init({
      duration: 1000,  // thời gian animation (ms)
      once: false,      // ✅ chạy nhiều lần
      mirror: true,     // ✅ animation chạy khi scroll lên và xuống
      offset: 100,      // khoảng cách trước khi trigger animation
    });

    this.startAutoSlide();
    this.loadLoaiMonAn();
    this.loadMonAnNoiBat();
  }

  // ✅ Cập nhật lại hiệu ứng AOS khi ảnh tự động đổi
  ngAfterViewChecked() {
    AOS.refresh();
  }

  startAutoSlide() {
    this.intervalId = setInterval(() => {
      this.nextSlide();
    }, 4000); // đổi ảnh sau 4 giây
  }

  nextSlide() {
    this.currentIndex = (this.currentIndex + 1) % this.images.length;
  }

  goToSlide(index: number) {
    this.currentIndex = index;
    clearInterval(this.intervalId);
    this.startAutoSlide();
  }

  loadLoaiMonAn() {
    this.QuanLyLoaiMonAn.LayTatCaLoaiMonAn().subscribe({
      next: (res: any) => {
        this.danhSachLoaiMonAn = res.data;
      },
      error: (err) => {
        console.error('Lỗi lấy loại món ăn', err);
      }
    });
  }
  loadMonAnNoiBat() {
    this.quanLyMonAn.LayTatCaMonAn().subscribe({
      next: (res: any) => {
        if (Array.isArray(res.data)) {
          this.monAnNoiBat = res.data.slice(0, 8); // lấy 8 món
        }
      },
      error: (err) => console.error(err)
    });
  }

  ngOnDestroy() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }
  }

  @ViewChild('scrollContainer', { static: false })
  scrollContainer!: ElementRef;

  scrollLeft() {
    this.scrollContainer.nativeElement.scrollBy({
      left: -300,
      behavior: 'smooth'
    });
  }

  scrollRight() {
    this.scrollContainer.nativeElement.scrollBy({
      left: 300,
      behavior: 'smooth'
    });
  }
}
