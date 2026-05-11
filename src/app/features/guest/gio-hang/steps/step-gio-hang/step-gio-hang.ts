import { Component, Input, Output, EventEmitter } from '@angular/core';
import { MATERIAL } from '../../../../../Shared/material';

@Component({
  selector: 'app-step-gio-hang',
  standalone: true,
  imports: [MATERIAL],
  templateUrl: './step-gio-hang.html'
})
export class StepGioHangComponent {

  @Input() gioHang: any[] = [];
  @Input() tongTien = 0;
  @Input() ghiChu = '';

  @Output() tang = new EventEmitter<any>();
  @Output() giam = new EventEmitter<any>();
  @Output() xoa = new EventEmitter<any>();
  @Output() ghiChuChange = new EventEmitter<string>();
}