import { Component, OnInit } from '@angular/core';
import { MATERIAL } from '../../../Shared/material';
import { NhaHangService } from '../../../core/services/NhaHang.service';
import { ToastMessageComponent } from '../../../Shared/toasts_message/toast-message/toast-message';

@Component({
  selector: 'app-thong-tin-nha-hang',
  standalone: true,
  imports: [MATERIAL, ToastMessageComponent],
  templateUrl: './thong-tin-nha-hang.html',
})
export class ThongTinNhaHang implements OnInit {


  // ===== STATE =====
  hasNhaHang: boolean | null = null;
  showCreateForm = false;

  currentNhaHangId?: number;
  loading = false;

  // ===== FORM DATA =====
  nhaHang: any = {
    ten_nha_hang: '',
    trang_thai: 1,
    dia_chi: '',
    so_tai_khoan: 0,
    ngan_hang: '',
    ten_nguoi_nhan: '',

    // 🔥 NEW FIELDS
    gio_mo_cua: '',
    gio_dong_cua: '',
    mo_ta: ''
  };

  selectedFile?: File;
  previewImage?: string;

  toast = {
    show: false,
    message: '',
    type: 'success' as 'success' | 'warn' | 'error'
  };

  constructor(private nhaHangService: NhaHangService) { }

  ngOnInit() {
    this.loadNhaHangByUser();
  }

  // =============================
  // LOAD NHÀ HÀNG
  // =============================
  loadNhaHangByUser() {
    this.hasNhaHang = null;

    this.nhaHangService.getNhaHangByUser().subscribe({
      next: (res) => {
        if (res.data?.length) {
          const nh = res.data[0];

          this.hasNhaHang = true;
          this.currentNhaHangId = nh.ma_nha_hang;
          this.nhaHang.ten_nha_hang = nh.ten_nha_hang;
          this.nhaHang.trang_thai = nh.trang_thai;
          this.nhaHang.dia_chi = nh.dia_chi;
          this.nhaHang.so_tai_khoan = nh.so_tai_khoan;
          this.nhaHang.ngan_hang = nh.ngan_hang;
          this.nhaHang.ten_nguoi_nhan = nh.ten_nguoi_nhan;
          this.nhaHang.gio_mo_cua = nh.gio_mo_cua;
          this.nhaHang.gio_dong_cua = nh.gio_dong_cua;
          this.nhaHang.mo_ta = nh.mo_ta;

          if (nh.anh_nha_hang?.length) {
            this.previewImage = nh.anh_nha_hang[0].url;
          }
        } else {
          this.hasNhaHang = false;
        }
      },
      error: () => this.hasNhaHang = false
    });
  }

  // =============================
  // FILE
  // =============================
  onFileChange(event: any) {
    const file = event.target.files[0];
    if (!file) return;

    this.selectedFile = file;

    const reader = new FileReader();
    reader.onload = () => this.previewImage = reader.result as string;
    reader.readAsDataURL(file);
  }

  // =============================
  // SUBMIT
  // =============================
  submit() {
    if (!this.validateForm()) return;

    this.loading = true;

    // UPDATE
    if (this.currentNhaHangId) {
      this.nhaHangService.updateNhaHang(
        this.currentNhaHangId,
        this.nhaHang,
        this.selectedFile
      ).subscribe({
        next: () => {
          this.showToast('Cập nhật thành công', 'success');
          this.loading = false;
        },
        error: () => {
          this.showToast('Cập nhật thất bại', 'error');
          this.loading = false;
        }
      });
      return;
    }

    // CREATE
    this.nhaHangService.createNhaHang(
      this.nhaHang,
      this.selectedFile
    ).subscribe({
      next: () => {
        this.showToast('Tạo nhà hàng thành công', 'success');
        this.showCreateForm = false;
        this.resetForm();
        this.loadNhaHangByUser();
        this.loading = false;
      },
      error: () => {
        this.showToast('Tạo nhà hàng thất bại', 'error');
        this.loading = false;
      }
    });
  }

  resetForm() {
    this.nhaHang = {
      ten_nha_hang: '',
      trang_thai: 1,
      dia_chi: '',
      so_tai_khoan: 0,
      ngan_hang: '',
      ten_nguoi_nhan: '',
      gio_mo_cua: '',
      gio_dong_cua: '',
      mo_ta: ''
    };

    this.previewImage = undefined;
    this.selectedFile = undefined;
    this.currentNhaHangId = undefined;
  }

  private validateForm(): boolean {
    if (!this.nhaHang.ten_nha_hang?.trim()) {
      this.showToast('Vui lòng nhập tên nhà hàng', 'warn');
      return false;
    }

    if (!this.nhaHang.dia_chi?.trim()) {
      this.showToast('Vui lòng nhập địa chỉ nhà hàng', 'warn');
      return false;
    }

    if (!this.nhaHang.ngan_hang?.trim()) {
      this.showToast('Vui lòng nhập tên ngân hàng', 'warn');
      return false;
    }

    if (
      !this.nhaHang.so_tai_khoan ||
      isNaN(this.nhaHang.so_tai_khoan)
    ) {
      this.showToast('Số tài khoản không hợp lệ', 'warn');
      return false;
    }

    if (!this.nhaHang.ten_nguoi_nhan?.trim()) {
      this.showToast('Vui lòng nhập tên người nhận', 'warn');
      return false;
    }

    if (!this.nhaHang.gio_mo_cua) {
      this.showToast('Vui lòng chọn giờ mở cửa', 'warn');
      return false;
    }

    if (!this.nhaHang.gio_dong_cua) {
      this.showToast('Vui lòng chọn giờ đóng cửa', 'warn');
      return false;
    }

    if (this.nhaHang.gio_mo_cua >= this.nhaHang.gio_dong_cua) {
      this.showToast('Giờ đóng cửa phải sau giờ mở cửa', 'warn');
      return false;
    }

    // ⚠️ Khi tạo mới → bắt buộc có ảnh
    if (!this.currentNhaHangId && !this.selectedFile) {
      this.showToast('Vui lòng tải ảnh đại diện nhà hàng', 'warn');
      return false;
    }

    return true;
  }

  showToast(message: string, type: 'success' | 'warn' | 'error') {
    this.toast.show = true;
    this.toast.message = message;
    this.toast.type = type;
    setTimeout(() => this.toast.show = false, 3000);
  }
}