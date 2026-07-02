import { Component, OnInit } from '@angular/core';
import { MATERIAL } from '../../../Shared/material';
import { QuanLyNhanVienService } from '../../../core/services/QuanLyNhanVien.service';
import { DiaChiService } from '../../../core/services/QuanLyDiaChi.service';
import { ToastMessageComponent } from '../../../Shared/toasts_message/toast-message/toast-message';

@Component({
  selector: 'app-trang-ca-nhan',
  imports: [MATERIAL, ToastMessageComponent],
  templateUrl: './trang-ca-nhan.html',
  styleUrl: './trang-ca-nhan.scss'
})
export class TrangCaNhan implements OnInit {

  Thongtinnguoidung: any = null;
  Anhnguoidung: string = 'assets/user.jpg';

  maxNgaySinh!: Date;
  isUploading = false;

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

    const formData = new FormData();
    formData.append('mat_khau_cu', this.doiMatKhauForm.mat_khau_cu);
    formData.append('mat_khau_moi', this.doiMatKhauForm.mat_khau_moi);
    formData.append(
      'xac_nhan_mat_khau_moi',
      this.doiMatKhauForm.xac_nhan_mat_khau_moi
    );

    // ✅ GỌI ĐÚNG API
    this.userService.doiMatKhau(formData).subscribe({
      next: () => {
        this.showToast('Đổi mật khẩu thành công', 'success');
        this.doiMatKhauForm = {
          mat_khau_cu: '',
          mat_khau_moi: '',
          xac_nhan_mat_khau_moi: ''
        };
      },
      error: (err) => {
        const msg =
          err?.error?.error ||          // backend trả { error: "..." }
          err?.error ||                 // backend trả string
          err?.message ||               // Angular message
          'Đổi mật khẩu thất bại';

        this.showToast(msg, 'error');
      }
    });
  }

  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (!file) return;

    this.selectedFile = file;

    // Preview ngay
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

    // ===== 1. Validate họ tên =====
    if (!this.newDiaChi.ho_ten || this.newDiaChi.ho_ten.trim() === '') {
      this.showToast('Vui lòng nhập họ tên người nhận', 'error');
      return;
    }

    // ===== 2. Validate số điện thoại =====
    if (!this.newDiaChi.sdt || this.newDiaChi.sdt.trim() === '') {
      this.showToast('Vui lòng nhập số điện thoại', 'error');
      return;
    }

    const phoneRegex = /^0[0-9]{9}$/;
    if (!phoneRegex.test(this.newDiaChi.sdt)) {
      this.showToast('Số điện thoại phải gồm 10 chữ số và bắt đầu bằng 0', 'error');
      return;
    }

    // ===== 3. Validate địa chỉ =====
    if (!this.newDiaChi.dia_chi || this.newDiaChi.dia_chi.trim() === '') {
      this.showToast('Vui lòng nhập địa chỉ chi tiết', 'error');
      return;
    }

    // // ===== 4. (Tuỳ chọn) Validate toạ độ =====
    // if (this.openMap && (!this.newDiaChi.latitude || !this.newDiaChi.longitude)) {
    //   this.showToast('Vui lòng chọn vị trí trên bản đồ', 'error');
    //   return;
    // }

    // ===== 5. Payload =====
    const payload = {
      ho_ten: this.newDiaChi.ho_ten.trim(),
      sdt: this.newDiaChi.sdt.trim(),
      dia_chi: this.newDiaChi.dia_chi.trim(),
      mac_dinh: this.newDiaChi.mac_dinh,
      latitude: this.newDiaChi.latitude,
      longitude: this.newDiaChi.longitude,
      ma_nguoi_dung: this.newDiaChi.ma_nguoi_dung
    };

    // ===== 6. Gọi API =====
    this.diaChiService.ThemDiaChi(payload).subscribe({
      next: () => {
        this.showToast('Thêm địa chỉ thành công', 'success');
        this.LayDiaChi(ma);
      },
      error: () => {
        this.showToast('Không thể thêm địa chỉ, vui lòng thử lại', 'error');
      }
    });
  }

  capNhatNguoiDung() {
    const ma = Number(localStorage.getItem('ma_nguoi_dung'));
    const formData = new FormData();

    formData.append('ho_ten', this.Thongtinnguoidung.ho_ten || '');
    formData.append('email', this.Thongtinnguoidung.email || '');
    formData.append('sdt', this.Thongtinnguoidung.sdt || '');
    formData.append(
      'ngay_sinh',
      this.formatDateToYMD(this.Thongtinnguoidung.ngay_sinh)
    );

    this.userService.updateThongTinCaNhanUserShipper(formData).subscribe({
      next: (res) => {
        this.showToast(res.message || 'Cập nhật thành công', 'success');
        this.loadUser(ma); // load lại từ /me
      },
      error: (err) => {
        this.showToast(
          err?.error?.error || 'Cập nhật thất bại',
          'error'
        );
      }
    });
  }

  uploadAvatar() {
    if (!this.selectedFile) return;

    const ma = Number(localStorage.getItem('ma_nguoi_dung'));

    const formData = new FormData();
    formData.append('image', this.selectedFile);

    this.isUploading = true;

    this.userService.doiAnhDaiDien(ma, formData).subscribe({
      next: (res: any) => {
        this.showToast(res.message, 'success');

        // ảnh từ backend
        this.Anhnguoidung = res.data?.anh_nhan_vien?.[0]?.url || this.Anhnguoidung;

        this.selectedFile = null;
        this.isUploading = false;
      },
      error: (err) => {
        this.showToast(
          err?.error?.error || 'Upload ảnh thất bại',
          'error'
        );
        this.isUploading = false;
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
    const ma = Number(localStorage.getItem('ma_nguoi_dung'));
    if (!this.editingDiaChiId) return;

    // ===== Validate họ tên =====
    if (!this.editDiaChiForm.ho_ten || this.editDiaChiForm.ho_ten.trim() === '') {
      this.showToast('Vui lòng nhập họ tên', 'error');
      return;
    }

    // ===== Validate số điện thoại =====
    if (!this.editDiaChiForm.sdt || this.editDiaChiForm.sdt.trim() === '') {
      this.showToast('Vui lòng nhập số điện thoại', 'error');
      return;
    }

    const phoneRegex = /^0[0-9]{9}$/;
    if (!phoneRegex.test(this.editDiaChiForm.sdt)) {
      this.showToast('Số điện thoại phải gồm 10 chữ số và bắt đầu bằng 0', 'error');
      return;
    }

    // ===== Validate địa chỉ =====
    if (!this.editDiaChiForm.dia_chi || this.editDiaChiForm.dia_chi.trim() === '') {
      this.showToast('Vui lòng nhập địa chỉ', 'error');
      return;
    }

    // ===== Gọi API =====
    this.diaChiService.CapNhatDiaChi(
      this.editingDiaChiId,
      {
        ...this.editDiaChiForm,
        ho_ten: this.editDiaChiForm.ho_ten.trim(),
        sdt: this.editDiaChiForm.sdt.trim(),
        dia_chi: this.editDiaChiForm.dia_chi.trim()
      }
    ).subscribe({
      next: () => {
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
