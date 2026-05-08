import { Component, HostListener, OnInit, inject } from '@angular/core';
import { Router, NavigationEnd, RouterOutlet } from '@angular/router';
import { Title } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';


@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, CommonModule],
  template: `
    <router-outlet></router-outlet>

    <button
  *ngIf="showButton"
  (click)="scrollToTop()"
  class="fixed bottom-8 right-8 z-50">

  <div class="relative w-12 h-12">

    <!-- pulse nền -->
    <span class="absolute inset-0 rounded-full bg-yellow-400 animate-ping opacity-40 "></span>

    <!-- nút chính -->
    <div class="relative w-12 h-12 rounded-full
                bg-yellow-400 text-gray-900
                flex items-center justify-center
                shadow-xl
                hover:scale-110 transition">

      <i class="fas fa-arrow-up"></i>

    </div>

  </div>

</button>
  `
})
export class App implements OnInit {
  showButton = false;

  constructor(private router: Router, private titleService: Title) { }

  ngOnInit() {
    ;
  }


  @HostListener('window:scroll', [])
  onWindowScroll() {
    this.showButton = (window.scrollY || document.documentElement.scrollTop) > 300;
  }

  scrollToTop() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
}
