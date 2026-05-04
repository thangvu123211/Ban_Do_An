import { Component, OnDestroy, OnInit } from '@angular/core';
import { LienHeService } from '../../../core/services/LienHe.service';
import { MATERIAL } from '../../../Shared/material';
import { ToastMessageComponent } from '../../../Shared/toasts_message/toast-message/toast-message';
@Component({
  selector: 'app-lien-he',
  imports: [MATERIAL , ToastMessageComponent],
  templateUrl: './lien-he.html',
  styleUrl: './lien-he.scss'
})
export class LienHe {
  form = {
    ho_ten: '',
    email: '',
    sdt: '',
    tieu_de: '',
    noi_dung: ''
  };

  toast = {
    show: false,
    message: '',
    type: 'success' as 'success' | 'warn' | 'error'
  };

  constructor(private lienHeService: LienHeService) { }

  showToast(message: string, type: 'success' | 'warn' | 'error') {
    this.toast.show = true;
    this.toast.message = message;
    this.toast.type = type;
    setTimeout(() => this.toast.show = false, 3000);
  }

  guiLienHe() {
    this.lienHeService.GuiLienHe(this.form).subscribe({
      next: (res) => {
         this.showToast('Gửi liên hệ thành công !', 'success');
        this.form = {
          ho_ten: '',
          email: '',
          sdt: '',
          tieu_de: '',
          noi_dung: ''
        };
      },
      error: (err) => {
         this.showToast('Gửi liên hệ thất bại !', 'error');
      }
    });
  }
}


