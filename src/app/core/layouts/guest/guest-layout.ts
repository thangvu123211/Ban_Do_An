import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from '../../../core/layouts/guest/header/header';
import { Footer } from '../../../core/layouts/guest/footer/footer';
import { MATERIAL } from '../../../Shared/material';
@Component({
  selector: 'app-guest-layout',
  imports: [HeaderComponent, Footer,RouterOutlet,MATERIAL],
  templateUrl: './guest-layout.html',
  styleUrl: './guest-layout.scss'
})
export class GuestLayout {

}
