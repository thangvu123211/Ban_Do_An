import { Component, OnInit } from '@angular/core';
import { QuanLyNhanVienService } from '../../../core/services/QuanLyNhanVien.service';
import { DiaChiService } from '../../../core/services/QuanLyDiaChi.service';
import { MATERIAL } from '../../../Shared/material';
import { ToastMessageComponent } from '../../../Shared/toasts_message/toast-message/toast-message';

@Component({
  selector: 'app-trang-ca-nhan',
  imports: [MATERIAL,ToastMessageComponent],
  templateUrl: './trang-ca-nhan.html',
  styleUrl: './trang-ca-nhan.scss'
})
export class TrangCaNhan implements OnInit {

  Thongtinnguoidung: any = null;
  Anhnguoidung: string = 'assets/user.jpg';

  danhSachDiaChi: any[] = [];
  diaChiMacDinh: any = null;

  editingDiaChiId: number | null = null;

  newDiaChi: any = {
    ho_ten: '',
    sdt: '',
    dia_chi: '',
    mac_dinh: false
  };

  editDiaChiForm: any = {};

  showAdd: boolean = false;

  selectedFile: File | null = null;

  toast = {
    show: false,
    message: '',
    type: 'success' as 'success' | 'warn' | 'error'
  };

  doiMatKhauForm = {
    mat_khau_cu: '',
    mat_khau_moi: '',
    xac_nhan_mat_khau_moi: ''
  };

  constructor(
    private userService: QuanLyNhanVienService,
    private diaChiService: DiaChiService
  ) { }

  showToast(message: string, type: 'success' | 'warn' | 'error') {
    this.toast.show = true;
    this.toast.message = message;
    this.toast.type = type;
    setTimeout(() => this.toast.show = false, 3000);
  }

  ngOnInit(): void {
    const ma = Number(localStorage.getItem('ma_nguoi_dung'));

    if (ma) {
      this.loadUser(ma);
      this.LayDiaChi(ma);
    }
  }

  // ================= USER =================
  loadUser(ma: number) {
    this.userService.LayNhanVienTheoID(ma).subscribe({
      next: (res) => {
        this.Thongtinnguoidung = res.data ?? res;

        // FIX NGÀY SINH
        if (this.Thongtinnguoidung.ngay_sinh) {
          this.Thongtinnguoidung.ngay_sinh = new Date(this.Thongtinnguoidung.ngay_sinh);
        }

        if (this.Thongtinnguoidung.anh_nguoi_dung?.length) {
          this.Anhnguoidung = this.Thongtinnguoidung.anh_nguoi_dung[0].url;
        }
      }
    });
  }

  validatePassword(): boolean {
    if (!this.doiMatKhauForm.mat_khau_cu ||
      !this.doiMatKhauForm.mat_khau_moi ||
      !this.doiMatKhauForm.xac_nhan_mat_khau_moi) {
      this.showToast('Vui lòng nhập đầy đủ mật khẩu', 'warn');
      return false;
    }

    if (this.doiMatKhauForm.mat_khau_moi !== this.doiMatKhauForm.xac_nhan_mat_khau_moi) {
      this.showToast('Mật khẩu xác nhận không khớp', 'error');
      return false;
    }

    return true;
  }

  doiMatKhau() {
    if (!this.validatePassword()) return;

    const ma = Number(localStorage.getItem('ma_nguoi_dung'));

    const payload = {
      mat_khau_cu: this.doiMatKhauForm.mat_khau_cu,
      mat_khau_moi: this.doiMatKhauForm.mat_khau_moi,
      xac_nhan_mat_khau_moi: this.doiMatKhauForm.xac_nhan_mat_khau_moi
    };

    this.userService.CapNhatThongTinNguoiDung(ma, payload).subscribe({
      next: () => {
        this.showToast('Đổi mật khẩu thành công', 'success');

        // clear form
        this.doiMatKhauForm = {
          mat_khau_cu: '',
          mat_khau_moi: '',
          xac_nhan_mat_khau_moi: ''
        };
      },
      error: (err) => {
        this.showToast(
          err?.error?.error || 'Đổi mật khẩu thất bại',
          'error'
        );
      }
    });
  }

  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (!file) return;

    this.selectedFile = file;

    // preview ngay lập tức
    const reader = new FileReader();
    reader.onload = () => {
      this.Anhnguoidung = reader.result as string;
    };
    reader.readAsDataURL(file);
  }

  // ================= ADDRESS =================
  LayDiaChi(ma: number) {
    this.diaChiService.LayDiaChiTheoUser(ma).subscribe({
      next: (res) => {

        const list = res.data ?? res ?? [];

        this.danhSachDiaChi = list;

        this.diaChiMacDinh =
          list.find((x: any) => x.mac_dinh) || list[0];

      }
    });
  }

  themDiaChi() {
    const ma = Number(localStorage.getItem('ma_nguoi_dung'));

    const payload = {
      ...this.newDiaChi,
      ma_nguoi_dung: ma
    };

    this.diaChiService.ThemDiaChi(payload).subscribe({
      next: () => {
        this.showToast('Thêm địa chỉ thành công', 'success');

        this.LayDiaChi(ma);

        this.newDiaChi = {
          ho_ten: '',
          sdt: '',
          dia_chi: '',
          mac_dinh: false
        };

        this.showAdd = false;
      },
      error: () => {
        this.showToast('Thêm địa chỉ thất bại', 'error');
      }
    });
  }

  capNhatNguoiDung() {
    const ma = Number(localStorage.getItem('ma_nguoi_dung'));

    const payload = {
      ho_ten: this.Thongtinnguoidung.ho_ten,
      email: this.Thongtinnguoidung.email,
      sdt: this.Thongtinnguoidung.sdt,
      ngay_sinh: this.formatDateToYMD(this.Thongtinnguoidung.ngay_sinh),
    };

    this.userService.CapNhatThongTinNguoiDung(ma, payload, this.selectedFile || undefined)
      .subscribe({
        next: () => {
          this.showToast('Cập nhật thành công', 'success');
          this.loadUser(ma);
        },
        error: (err) => {
          this.showToast(err?.error?.error || 'Cập nhật thất bại', 'error');
        }
      });
  }

  uploadAvatar() {
    if (!this.selectedFile) {
      this.showToast('Vui lòng chọn ảnh trước', 'warn');
      return;
    }

    const ma = Number(localStorage.getItem('ma_nguoi_dung'));

    this.userService.CapNhatThongTinNguoiDung(
      ma,
      {}, // hoặc null / undefined tùy backend
      this.selectedFile
    ).subscribe({
      next: () => {
        this.showToast('Cập nhật ảnh đại diện thành công', 'success');

        this.loadUser(ma);
        this.selectedFile = null;
      },
      error: (err) => {
        this.showToast(err?.error?.error || 'Upload ảnh thất bại', 'error');
      }
    });
  }

  formatDateToYMD(date: any): string {
    if (!date) return '';

    const d = new Date(date);
    const year = d.getFullYear();
    const month = ('0' + (d.getMonth() + 1)).slice(-2);
    const day = ('0' + d.getDate()).slice(-2);

    return `${year}-${month}-${day}`;
  }

  moSuaDiaChi(dc: any) {
    this.editingDiaChiId = dc.id;
    this.editDiaChiForm = { ...dc };
  }

  capNhatDiaChi() {
    this.diaChiService.CapNhatDiaChi(
      this.editingDiaChiId!,
      this.editDiaChiForm
    ).subscribe({
      next: () => {
        const ma = Number(localStorage.getItem('ma_nguoi_dung'));

        this.showToast('Cập nhật địa chỉ thành công', 'success');

        this.editingDiaChiId = null;
        this.LayDiaChi(ma);
      },
      error: () => {
        this.showToast('Cập nhật địa chỉ thất bại', 'error');
      }
    });
  }

  datMacDinh(id: number) {
    this.diaChiService.SetDiaChiMacDinh(id).subscribe({
      next: () => {
        const ma = Number(localStorage.getItem('ma_nguoi_dung'));

        this.showToast('Đặt mặc định thành công', 'success');

        this.LayDiaChi(ma);
      },
      error: () => {
        this.showToast('Không thể đặt mặc định', 'error');
      }
    });
  }

  formatNgay(date: any): string {
    if (!date) return '';
    const d = new Date(date);
    return d.toLocaleDateString('vi-VN');
  }
}
