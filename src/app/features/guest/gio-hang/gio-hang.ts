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

    const token = localStorage.getItem('token');
    const userId = Number(localStorage.getItem('ma_nguoi_dung'));

    // =========================
    // 👤 USER INFO
    // =========================
    if (this.isLoggedIn) {
      const user = this.authService.getUser();
      this.tenNguoiNhan = user?.ho_ten || '';
      this.soDienThoai = user?.sdt || '';
      this.diaChi = user?.dia_chi || '';
    }

    // =========================
    // 🛒 CART STREAM (LOCAL + DB)
    // =========================
    this.cartService.count$.subscribe(value => {
      // badge header nếu cần
    });

    this.cartService.getLocal(); // đảm bảo init local

    // =========================
    // 🔄 LOAD CART DATA
    // =========================
    if (this.isLoggedIn) {

      // 🔥 LOGIN → merge local → DB
      this.cartService.syncLocalToDB(userId);

      // load DB cart
      this.loadCartFromDB(userId);

    } else {

      // ❌ GUEST → LOCAL
      const local = this.cartService.getLocal();
      this.gioHang = local;
      this.tinhTong();

      if (local.length === 0 && !this.isCheckoutDone) {
        this.dialogRef.close();
      }
    }

    // =========================
    // 📍 ADDRESS
    // =========================
    if (this.isLoggedIn) {
      this.newDiaChi.ma_nguoi_dung = userId;
      this.loadDiaChi();
    }

    // =========================
    // 🎁 VOUCHER
    // =========================
    this.loadGiamGia();
  }

  loadCartFromDB(userId: number) {
    this.cartService.getByUser(userId).subscribe(res => {

      this.gioHang = (res || []).map(x => {

        const mon = x.mon_an?.[0]; // 👈 QUAN TRỌNG

        return {
          ma_mon_an: x.ma_mon_an,
          soLuong: x.so_luong,

          ten_mon_an: mon?.ten_mon_an || '',
          gia_tien: mon?.gia_tien || 0,
          anh_mon_an: mon?.anh_mon_an?.[0]?.url || ''
        };
      });

      this.tinhTong();

      if (this.gioHang.length === 0 && !this.isCheckoutDone) {
        this.dialogRef.close();
      }
    });
  }
  isVoucherValid(v: any): boolean {
    if (!v?.don_toi_thieu) return true;

    return this.tongTien >= v.don_toi_thieu;
  }

  // ================= CART =================
  tangSoLuong(item: any) {

    const token = localStorage.getItem('token');
    const userId = Number(localStorage.getItem('ma_nguoi_dung'));

    // =========================
    // ❌ GUEST → LOCAL
    // =========================
    if (!token) {

      const list = this.cartService.getLocal();

      const found = list.find(x => x.ma_mon_an === item.ma_mon_an);

      if (found) found.soLuong += 1;

      this.gioHang = [...list]; // 🔥 update UI ngay
      this.cartService.saveLocal(list);

      this.tinhTong();
      return;
    }

    // =========================
    // 🔥 LOGIN → DB
    // =========================
    const newQty = item.soLuong + 1;

    item.soLuong = newQty; // 🔥 UI update ngay
    this.tinhTong();

    this.cartService.updateDB(item.ma_mon_an, newQty)
      .subscribe(() => {
        this.cartService.loadCountFromDB(userId);
      });
  }

  giamSoLuong(item: any) {

    const token = localStorage.getItem('token');
    const userId = Number(localStorage.getItem('ma_nguoi_dung'));

    // =========================
    // ❌ GUEST → LOCAL
    // =========================
    if (!token) {

      const list = this.cartService.getLocal();

      const found = list.find(x => x.ma_mon_an === item.ma_mon_an);

      if (!found) return;

      found.soLuong -= 1;

      const newList = found.soLuong <= 0
        ? list.filter(x => x.ma_mon_an !== item.ma_mon_an)
        : list;

      this.gioHang = [...newList]; // 🔥 update UI ngay
      this.cartService.saveLocal(newList);

      this.tinhTong();
      return;
    }

    // =========================
    // 🔥 LOGIN → DB
    // =========================
    const newQty = item.soLuong - 1;

    if (newQty <= 0) {

      this.gioHang = this.gioHang.filter(x => x.ma_mon_an !== item.ma_mon_an);

      this.cartService.deleteDB(item.ma_mon_an).subscribe(() => {
        this.cartService.loadCountFromDB(userId);
      });

    } else {

      item.soLuong = newQty; // 🔥 UI update ngay
      this.tinhTong();

      this.cartService.updateDB(item.ma_mon_an, newQty)
        .subscribe(() => {
          this.cartService.loadCountFromDB(userId);
        });
    }
  }

  removeFromGioHang(item: any) {

    const token = localStorage.getItem('token');
    const userId = Number(localStorage.getItem('ma_nguoi_dung'));

    // =========================
    // ❌ CHƯA LOGIN → LOCAL
    // =========================
    if (!token) {

      const list = this.cartService.getLocal()
        .filter(x => x.ma_mon_an !== item.ma_mon_an);

      this.cartService.saveLocal(list);

      this.gioHang = list;
      this.tinhTong();

      return;
    }

    // =========================
    // 🔥 LOGIN → DB
    // =========================
    this.cartService.deleteDB(item.ma_mon_an).subscribe({

      next: () => {

        // 🔥 update UI ngay lập tức
        this.gioHang = this.gioHang.filter(x => x.ma_mon_an !== item.ma_mon_an);

        this.tinhTong();

        // 🔥 sync badge header
        this.cartService.loadCountFromDB(userId);
      },

      error: (err) => {
        console.error('Xóa thất bại:', err);
      }
    });
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
    this.tongSauGiam = this.tinhTienSauGiam();
    if (!this.tongSauGiam || this.tongSauGiam < 0 || isNaN(this.tongSauGiam)) {
      this.showToast('Tổng tiền không hợp lệ', 'error');
      return;
    }
    const userId = Number(localStorage.getItem('ma_nguoi_dung'));

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

      code_giam_gia: this.maGiamGiaChon?.code || null, // ⭐ QUAN TRỌNG

      mon_ans: monAns
    };

    this.hoadonservice.taoHoaDon(request).subscribe({

      next: () => {

        this.showToast('Thanh toán thành công!', 'success');

        this.isCheckoutDone = true;

        // =========================
        // 🧹 CLEAR GIỎ HÀNG DB (1 LẦN DUY NHẤT)
        // =========================
        this.cartService.clearDB(userId).subscribe({
          next: () => {
            this.gioHang = [];
            this.tinhTong();
            this.cartService.loadCountFromDB(userId);
          },
          error: (err) => {
            console.error('Clear cart lỗi:', err);
          }
        });

        // =========================
        // UI
        // =========================
        this.currentStep = 4;
      },

      error: () => {
        this.showToast('Thanh toán thất bại!', 'error');
      }

    });
  }

  tinhTienSauGiam(): number {

    if (!this.maGiamGiaChon) return this.tongTien;

    const v = this.maGiamGiaChon;

    let total = Number(this.tongTien) || 0;

    if (v.loai_giam_gia === 'percent') {
      total = total - (total * Number(v.gia_tri_giam || 0)) / 100;
    }

    if (v.loai_giam_gia === 'fixed') {
      total = total - Number(v.gia_tri_giam || 0);
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
  goToDonHang() {
    this.dialogRef.close();
    this.router.navigate(['/user/don-hang']);
  }
}