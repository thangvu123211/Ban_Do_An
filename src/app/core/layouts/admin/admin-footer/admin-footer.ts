import { Component, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';
import { MATERIAL } from '../../../../Shared/material';
@Component({
  selector: 'app-admin-footer',
  imports: [MATERIAL],
  templateUrl: './admin-footer.html',
  styleUrl: './admin-footer.scss'
})
export class AdminFooter implements OnInit {
  test: Date = new Date();
  constructor() {
    
  }
  ngOnInit() {
    }
}
