import { Component, OnInit } from "@angular/core";
import { MatDialogRef } from "@angular/material/dialog";
import { CartService } from "../../../core/services/cart.service";
import { MATERIAL } from "../../../Shared/material";
import { ToastMessageComponent } from "../../../Shared/toasts_message/toast-message/toast-message";
import { AuthService } from "../../../core/services/auth.service";
import { Router } from "@angular/router";
import { DiaChiService } from "../../../core/services/QuanLyDiaChi.service";
import { StepGioHangComponent } from "./steps/step-gio-hang/step-gio-hang";
import { StepTamTinhComponent } from "./steps/step-tam-tinh/step-tam-tinh";
import { StepThongTincomponent, } from "./steps/step-thong-tin/step-thong-tin";
import { StepThanhToanComponent } from "./steps/step-thanh-toan/step-thanh-toan";
import { QuanLyGiamGiaService } from "../../../core/services/QuanLyGiamGia";
import { HoaDonService } from "../../../core/services/HoaDon.Service";
import { BehaviorSubject } from "rxjs";

// STEP COMPONENTS
interface DiaChi {
  id: number;
  ho_ten: string;
  sdt: string;
  dia_chi: string;
  mac_dinh: boolean;
}

@Component({
  selector: "gio-hang",
  standalone: true,
  imports: [
    MATERIAL,
    ToastMessageComponent,
    StepGioHangComponent,
    StepTamTinhComponent,
    StepThongTincomponent,
    StepThanhToanComponent
  ],
  templateUrl: "./gio-hang.html",
  styleUrl: "./gio-hang.scss"
})
export class GioHang implements OnInit {
  giamGiaList: any[] = [];
  maGiamGiaChon: any = null;
  tongSauGiam = 0;

  // ================= STATE =================
  gioHang: any[] = [];
  tongTien = 0;
  currentStep = 0;
  ghiChu: string = '';


  // ================= USER =================
  tenNguoiNhan = '';
  soDienThoai = '';
  diaChi = '';

  // ================= ADDRESS =================
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

  //eddit dia chi
  editingDiaChiId: number | null = null;
  editDiaChiForm: any = {
    ho_ten: '',
    sdt: '',
    dia_chi: '',
    mac_dinh: false
  };
  //thanh toan
  daThanhToan: boolean = false;
  //
  isCheckoutDone = false;
  // ================= TOAST =================
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
    private diaChiService: DiaChiService,
    private giamGiaService: QuanLyGiamGiaService,
    private hoadonservice: HoaDonService,
  ) { }

  // ================= LOGIN =================
  get isLoggedIn(): boolean {
    return this.authService.isLoggedIn();
  }

  chonGiamGia(v: any) {

    if (!this.isVoucherValid(v)) {
      this.showToast('Đơn hàng chưa đủ điều kiện áp dụng mã này', 'warn');
      return;
    }

    this.maGiamGiaChon = v;
    this.tongSauGiam = this.tinhTienSauGiam();
  }

  loadGiamGia() {
    this.giamGiaService.LayTatCaGiamGia()
      .subscribe(res => {
        this.giamGiaList = (res.data || []).filter((x: any) => x.is_active);
      });
  }

  goToLogin() {
    this.router.navigate(['/login']);
    this.close();
  }

  // ================= INIT =================
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

      if (gio.length === 0 && !this.isCheckoutDone) {
        this.dialogRef.close();
      }
    });

    if (this.isLoggedIn) {
      const maNguoiDung = Number(localStorage.getItem('ma_nguoi_dung'));
      this.newDiaChi.ma_nguoi_dung = maNguoiDung;
      this.loadDiaChi();
    }
    this.loadGiamGia();
  }
  isVoucherValid(v: any): boolean {
    if (!v?.don_toi_thieu) return true;

    return this.tongTien >= v.don_toi_thieu;
  }

  // ================= CART =================
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

    this.tongSauGiam = this.tinhTienSauGiam();
  }

  get tongSoMon(): number {
    return this.gioHang.reduce((s, i) => s + i.soLuong, 0);
  }

  // ================= STEP =================
  nextStep() {

    if (this.currentStep === 2 && !this.isLoggedIn) {
      this.showToast('Vui lòng đăng nhập!', 'warn');
      this.router.navigate(['/login']);
      return;
    }

    if (this.currentStep < 4) {
      this.currentStep++;
    }
  }

  prevStep() {
    if (this.currentStep > 0) {
      this.currentStep--;
    }
  }

  // ================= ADDRESS =================
  loadDiaChi() {
    const maNguoiDung = Number(localStorage.getItem('ma_nguoi_dung'));

    this.diaChiService.LayDiaChiTheoUser(maNguoiDung)
      .subscribe((res: DiaChi[]) => {

        const list: DiaChi[] = res || [];

        // đưa mặc định lên đầu
        list.sort((a: DiaChi, b: DiaChi) => {
          return (b.mac_dinh ? 1 : 0) - (a.mac_dinh ? 1 : 0);
        });

        this.danhSachDiaChi = list;

        // auto chọn địa chỉ mặc định
        const defaultDC = list.find((x: DiaChi) => x.mac_dinh);

        if (defaultDC) {
          this.chonDiaChi(defaultDC);
        } else if (list.length > 0) {
          this.chonDiaChi(list[0]);
        }

      });
  }

  chonDiaChi(dc: DiaChi) {
    this.selectedDiaChi = dc;

    this.tenNguoiNhan = dc.ho_ten || '';
    this.soDienThoai = dc.sdt || '';
    this.diaChi = dc.dia_chi || '';
  }

  themDiaChi() {
    this.diaChiService.ThemDiaChi(this.newDiaChi)
      .subscribe(() => {
        this.loadDiaChi();
        this.showAddAddress = false;
      });
  }

  datMacDinh(id: number) {
    this.diaChiService.SetDiaChiMacDinh(id).subscribe({
      next: (res) => {
        this.showToast('Đặt mặc định thành công', 'success');
        this.loadDiaChi(); // reload lại danh sách
      },
      error: () => {
        this.showToast('Không thể đặt mặc định', 'error');
      }
    });
  }
  moSuaDiaChi(dc: any) {
    this.editingDiaChiId = dc.id;

    this.editDiaChiForm = {
      ho_ten: dc.ho_ten,
      sdt: dc.sdt,
      dia_chi: dc.dia_chi,
      mac_dinh: dc.mac_dinh
    };
  }
  capNhatDiaChi() {
    if (!this.editingDiaChiId) return;

    this.diaChiService.CapNhatDiaChi(
      this.editingDiaChiId,
      this.editDiaChiForm
    ).subscribe({
      next: () => {
        this.showToast('Cập nhật địa chỉ thành công', 'success');
        this.editingDiaChiId = null;
        this.loadDiaChi();
      },
      error: () => {
        this.showToast('Cập nhật thất bại', 'error');
      }
    });
  }
  thanhToan() {

    const monAns = this.gioHang.map(i => ({
      ma_mon_an: i.ma_mon_an,
      so_luong: i.soLuong,
      ghi_chu: i.ghi_chu || ''
    }));

    const request = {
      ho_ten: this.tenNguoiNhan,
      sdt: this.soDienThoai,
      dia_chi: this.diaChi,
      ghi_chu: this.ghiChu,
      mon_ans: monAns,
      tong_tien: this.tongSauGiam
    };

    this.hoadonservice.taoHoaDon(request).subscribe({

      next: () => {

        this.showToast('Thanh toán thành công!', 'success');

        this.isCheckoutDone = true;   // ✅ THÊM DÒNG NÀY

        this.cartService.clear();

        this.currentStep = 4;         // 👉 HIỆN STEP 4

      },

      error: () => {
        this.showToast('Thanh toán thất bại!', 'error');
      }

    });
  }

  tinhTienSauGiam(): number {

    if (!this.maGiamGiaChon) return this.tongTien;

    const v = this.maGiamGiaChon;
    let total = this.tongTien;

    if (v.loai_giam_gia === 'percent') {
      total = total - (total * v.gia_tri_giam) / 100;
    }

    if (v.loai_giam_gia === 'fixed') {
      total = total - v.gia_tri_giam;
    }

    return Math.max(total, 0);
  }



  // ================= UI =================
  showToast(message: string, type: any) {
    this.toast = { show: true, message, type };
    setTimeout(() => this.toast.show = false, 3000);
  }

  close() {
    this.dialogRef.close();
  }

}