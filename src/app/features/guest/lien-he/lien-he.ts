import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { LienHeService } from '../../../core/services/LienHe.service';
import { MATERIAL } from '../../../Shared/material';
import { ToastMessageComponent } from '../../../Shared/toasts_message/toast-message/toast-message';
import { NhaHangService } from '../../../core/services/NhaHang.service';
import { NgForm } from '@angular/forms';
@Component({
  selector: 'app-lien-he',
  imports: [MATERIAL , ToastMessageComponent],
  templateUrl: './lien-he.html',
  styleUrl: './lien-he.scss'
})

export class LienHe implements OnInit {

  @ViewChild('lienHeForm') lienHeForm!: NgForm;
  
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
  // ❌ FORM KHÔNG HỢP LỆ
  if (this.lienHeForm.invalid) {

    // đánh dấu tất cả field là touched → hiện mat-error
    Object.values(this.lienHeForm.controls).forEach(control => {
      control.markAsTouched();
    });

    this.showToast(
      'Vui lòng điền đầy đủ và đúng thông tin liên hệ',
      'error'
    );
    return;
  }

  // ✅ FORM HỢP LỆ → GỌI API
  this.lienHeService.GuiLienHe(this.form).subscribe({
    next: () => {
      this.showToast('Gửi liên hệ thành công!', 'success');

      // reset form
      this.lienHeForm.resetForm();
    },
    error: () => {
      this.showToast('Gửi liên hệ thất bại!', 'error');
    }
  });
}
}


