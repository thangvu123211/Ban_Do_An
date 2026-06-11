import { Component, OnDestroy, OnInit } from '@angular/core';
import { LienHeService } from '../../../core/services/LienHe.service';
import { MATERIAL } from '../../../Shared/material';
import { ToastMessageComponent } from '../../../Shared/toasts_message/toast-message/toast-message';
import { NhaHangService } from '../../../core/services/NhaHang.service';
@Component({
  selector: 'app-lien-he',
  imports: [MATERIAL , ToastMessageComponent],
  templateUrl: './lien-he.html',
  styleUrl: './lien-he.scss'
})
export class LienHe implements OnInit {
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

  nhaHang: any = null;

  constructor(
    private lienHeService: LienHeService,
    private nhaHangService:NhaHangService
  ) { }

  ngOnInit(): void {
    this.loadNhaHang();
  }

  showToast(message: string, type: 'success' | 'warn' | 'error') {
    this.toast.show = true;
    this.toast.message = message;
    this.toast.type = type;
    setTimeout(() => this.toast.show = false, 3000);
  }

  loadNhaHang() {
    this.nhaHangService.getAllNhaHang().subscribe({
      next: (res) => {
        this.nhaHang = res.data?.[0] || null;
      },
      error: (err) => {
        console.error('Lỗi load nhà hàng', err);
      }
    });
  }
  getAnhDaiDien(): string {
    if (this.nhaHang?.anh_nha_hang?.length > 0) {
      return this.nhaHang.anh_nha_hang[0].url;
    }
    return 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5';
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


