import { Component, Input, Output, EventEmitter, output } from '@angular/core';
import { MATERIAL } from '../../../../../Shared/material';
import { MatDialog } from '@angular/material/dialog';
import { SuaGioHang } from '../../../dialogs/sua-gio-hang/sua-gio-hang';

@Component({
  selector: 'app-step-gio-hang',
  standalone: true,
  imports: [MATERIAL],
  templateUrl: './step-gio-hang.html'
})
export class StepGioHangComponent {
  constructor(private dialog: MatDialog) { }

  @Input() gioHang: any[] = [];
  @Input() tongTien = 0;
  @Input() ghiChu = '';

  @Output() tang = new EventEmitter<any>();
  @Output() giam = new EventEmitter<any>();
  @Output() xoa = new EventEmitter<any>();
  @Output() ghiChuChange = new EventEmitter<string>();
  @Output() change = new EventEmitter<{ item: any, type: string }>();
  @Output() sua = new EventEmitter<{ item: any }>
  @Output() cartUpdated = new EventEmitter<void>();

  onClickSua(item: any) {
    this.sua.emit(item);
  }
  getImage(item: any): string {
    // DB
    if (typeof item.anh_mon_an === 'string') {
      return item.anh_mon_an;
    }

    // DB dạng array
    if (Array.isArray(item.anh_mon_an)) {
      return item.anh_mon_an[0]?.url || 'assets/no-image.png';
    }

    return 'assets/no-image.png';
  }


}