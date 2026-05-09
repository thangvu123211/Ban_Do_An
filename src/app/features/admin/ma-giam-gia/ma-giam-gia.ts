import { Component } from '@angular/core';
import { MATERIAL } from '../../../Shared/material';
import { ToastMessageComponent } from '../../../Shared/toasts_message/toast-message/toast-message';
import { LienHeService } from '../../../core/services/LienHe.service';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-ma-giam-gia',
  imports: [MATERIAL, ToastMessageComponent],
  templateUrl: './ma-giam-gia.html',
  styleUrl: './ma-giam-gia.scss'
})


export class MaGiamGia {

  toast = {
    show: false,
    message: '',
    type: 'success' as 'success' | 'warn' | 'error'
  };

  constructor(
    private lienHeService: LienHeService, 
    private dialog: MatDialog) { }

  showToast(message: string, type: 'success' | 'warn' | 'error') {
    this.toast.show = true;
    this.toast.message = message;
    this.toast.type = type;
    setTimeout(() => this.toast.show = false, 3000);
  }
}
