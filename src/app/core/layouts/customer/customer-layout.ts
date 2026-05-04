import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-customer-layout',
  standalone: true,
  imports: [RouterOutlet], // 👈 cần import RouterOutlet để dùng <router-outlet>
  template: `
    <main>
      <router-outlet></router-outlet>
    </main>
  `
})
export class CustomerLayout {}

