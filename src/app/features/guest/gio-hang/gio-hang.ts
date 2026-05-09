import { Component, OnInit } from "@angular/core";
import { MatDialogRef } from "@angular/material/dialog";
import { CartService } from "../../../core/services/cart.service";
import { MATERIAL } from "../../../Shared/material";
import { ToastMessageComponent } from "../../../Shared/toasts_message/toast-message/toast-message";
import { AuthService } from "../../../core/services/auth.service";
import { Router } from '@angular/router';
import { DiaChiService } from "../../../core/services/QuanLyDiaChi.service";

@Component({
  selector: 'gio-hang',
  standalone: true,
  imports: [MATERIAL, ToastMessageComponent],
  templateUrl: './gio-hang.html',
  styleUrl: './gio-hang.scss'
})
export class GioHang implements OnInit {

  gioHang: any[] = [];
  tongTien = 0;
  currentStep = 0;
  ghiChu: string = '';
  tenNguoiNhan = '';
  soDienThoai = '';
  diaChi = '';
  danhSachDiaChi: any[] = [];
  selectedDiaChi: any;
  showAddAddress = false;
  newDiaChi: any = {
    ho_ten: '',
    sdt: '',
    dia_chi: '',
    mac_dinh: false,
    ma_nguoi_dung: 0
  };

  toast = {
    show: false,
    message: '',
    type: 'success' as 'success' | 'warn' | 'error'
  };

  constructor(
    private dialogRef: MatDialogRef<GioHang>,
    private cartService: CartService,
    private authService: AuthService,
    private router: Router,
    private diaChiService: DiaChiService
  ) { }

  showToast(message: string, type: 'success' | 'warn' | 'error') {
    this.toast.show = true;
    this.toast.message = message;
    this.toast.type = type;
    setTimeout(() => this.toast.show = false, 3000);
  }

  get isLoggedIn(): boolean {
    return this.authService.isLoggedIn();
  }
  goToLogin() {
    this.router.navigate(['/login']);
    this.close();
  }

  loadDiaChi() {
  const maNguoiDung = Number(localStorage.getItem('ma_nguoi_dung'));

  if (!maNguoiDung) {
    console.log("CHƯA CÓ USER ID");
    return;
  }

  this.diaChiService.LayDiaChiTheoUser(maNguoiDung)
    .subscribe({
      next: (res) => {
        console.log("API RESPONSE:", res);

        this.danhSachDiaChi = res || [];

        this.selectedDiaChi =
          this.danhSachDiaChi.find(x => x.mac_dinh === true)
          || this.danhSachDiaChi[0]
          || null;
      },
      error: (err) => {
        console.log("LỖI LOAD ĐỊA CHỈ:", err);
      }
    });
}

  chonDiaChi(dc: any) {
    this.selectedDiaChi = dc;

    // 🔥 auto fill input luôn
    this.tenNguoiNhan = dc.ho_ten;
    this.soDienThoai = dc.sdt;
    this.diaChi = dc.dia_chi;
  }


  ngOnInit() {
    if (this.isLoggedIn) {
      const user = this.authService.getUser();
      this.tenNguoiNhan = user?.ho_ten || '';
      this.soDienThoai = user?.sdt || '';
      this.diaChi = user?.dia_chi || '';
    }
    this.cartService.gioHang$.subscribe(gio => {
      this.gioHang = gio;
      this.tinhTong();

      // 🔥 GIỎ TRỐNG → ĐÓNG LUÔN
      if (gio.length === 0) {
        this.dialogRef.close();
      }
    });
    if (this.isLoggedIn) {
    const maNguoiDung = Number(localStorage.getItem('ma_nguoi_dung'));
    this.newDiaChi.ma_nguoi_dung = maNguoiDung;

    this.loadDiaChi(); // 👈 chỉ load khi login
  }
  }
  themDiaChi() {
    const maNguoiDung = Number(localStorage.getItem('ma_nguoi_dung'));

    this.newDiaChi.ma_nguoi_dung = maNguoiDung;

    console.log("GỬI LÊN:", this.newDiaChi); // 👈 bắt buộc debug

    this.diaChiService.ThemDiaChi(this.newDiaChi)
      .subscribe({
        next: (res) => {
          console.log("THÊM OK:", res);
          this.loadDiaChi();
          this.showAddAddress = false;
        },
        error: (err) => {
          console.log("LỖI:", err.error || err);
        }
      });
  }

  tangSoLuong(item: any) {
    this.cartService.tangSoLuong(item);
  }

  giamSoLuong(item: any) {
    this.cartService.giamSoLuong(item);
  }

  removeFromGioHang(item: any) {
    this.cartService.removeItem(item);
  }

  tinhTong() {
    this.tongTien = this.gioHang.reduce(
      (s, i) => s + i.soLuong * i.gia_tien,
      0
    );
  }

  get tongSoMon(): number {
    return this.gioHang.reduce((sum, item) => sum + item.soLuong, 0);
  }

  close() {
    this.dialogRef.close();
  }

  nextStep() {
    if (this.currentStep === 2 && !this.isLoggedIn) {
      this.showToast('Vui lòng đăng nhập để tiếp tục!', 'warn');
      this.router.navigate(['/login']);
      return;
    }

    if (this.currentStep < 3) {
      this.currentStep++;
      this.onStepChange();
    }
  }

  prevStep() {
    if (this.currentStep > 0) {
      this.currentStep--;
    }
  }
  onStepChange() {
    if (this.currentStep === 2 && this.isLoggedIn) {
      this.loadDiaChi();
    }
  }
}