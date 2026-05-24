import { Component, OnInit } from "@angular/core";
import { MatDialog, MatDialogRef } from "@angular/material/dialog";
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
import { SuaGioHang } from "../dialogs/sua-gio-hang/sua-gio-hang";
import { PaymentService } from "../../../core/services/payment.service";
import { WebsocketService } from "../../../core/services/websocket.service";
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

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
  maNhap: string = '';

  maHoaDonDangThanhToan!: number;
  daXuLyThanhToan = false;

  showQR = false;
  qrHtml: SafeHtml | null = null;
  isCreatingPayment = false;

  loaded: boolean = false;

  // ================= STATE =================
  gioHang: any[] = [];
  tongTien = 0;
  currentStep = 0;
  ghiChu: string = '';

  cartBadgeCount = 0;
  qrUrl: string = '';


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
    ma_nguoi_dung: 0,
    latitude: null,
    longitude: null
  };

  openMap = false;

  mapCenter = {
    lat: 10.762622,
    lng: 106.660172
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

    private cartService: CartService,
    private authService: AuthService,
    private router: Router,
    private diaChiService: DiaChiService,
    private giamGiaService: QuanLyGiamGiaService,
    private hoadonservice: HoaDonService,
    private dialog: MatDialog,
    private paymentService: PaymentService,
    private websocketService: WebsocketService,
    private sanitizer: DomSanitizer,
  ) { }

  // ================= LOGIN =================
  get isLoggedIn(): boolean {
    return this.authService.isLoggedIn();
  }
  // ================= CHON GIAM GIA =================
  chonGiamGia(v: any) {

    // ✔ nếu click lại đúng mã đang chọn → bỏ chọn
    if (this.maGiamGiaChon?.code === v.code) {
      this.maGiamGiaChon = null;
      this.tongSauGiam = this.tinhTienSauGiam();
      this.showToast('Đã bỏ mã giảm giá', 'warn');
      return;
    }

    // ✔ check điều kiện
    if (!this.isVoucherValid(v)) {
      this.showToast('Đơn hàng chưa đủ điều kiện áp dụng mã này', 'warn');
      return;
    }

    // ✔ chọn mã mới
    this.maGiamGiaChon = v;
    this.tongSauGiam = this.tinhTienSauGiam();

    this.showToast('Áp dụng mã thành công', 'success');
  }
  // ================= LOAD GIAM GIA =================
  loadGiamGia() {
    this.giamGiaService.LayTatCaGiamGia()
      .subscribe(res => {
        this.giamGiaList = (res.data || []).filter((x: any) => x.is_active);
      });
  }
  // ================= DANG NHAP =================
  goToLogin() {
    this.router.navigate(['/login']);
  }

  // ================= INIT =================
  ngOnInit() {
    this.loaded = false;

    const pending = localStorage.getItem('pending_hoa_don');
    if (pending) {
      this.maHoaDonDangThanhToan = Number(pending);
      this.daXuLyThanhToan = false;
    }

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
    // 🛒 CART COUNT STREAM
    // =========================
    this.cartService.count$.subscribe(count => {
      this.cartBadgeCount = count;
    });


    // =========================
    // 🔄 LOAD CART
    // =========================
    if (this.isLoggedIn && token && userId) {

      // 🔥 LOGIN → MERGE LOCAL → DB → LOAD DB
      this.cartService.syncLocalToDB(userId).subscribe({
        next: () => {
          this.loadCartFromDB(userId);
          this.loaded = true;
        },
        error: () => {
          // nếu merge lỗi vẫn load db
          this.loadCartFromDB(userId);
          this.loaded = true;
        }
      });

    } else {

      // ❌ GUEST → LOCAL
      const local = this.cartService.getLocal();

      this.gioHang = local.map(x => this.normalizeCartItem(x));

      this.tinhTong();
      this.loaded = true;
    }

    // =========================
    // 📍 ADDRESS
    // =========================
    if (this.isLoggedIn && userId) {
      this.newDiaChi.ma_nguoi_dung = userId;
      this.loadDiaChi();
    }

    // =========================
    // 🎁 VOUCHER
    // =========================
    this.loadGiamGia();

    // 🔌 connect websocket (chỉ cần 1 lần)
    this.websocketService.connect();

    this.websocketService.messages$
      .subscribe(msg => {

        if (!this.maHoaDonDangThanhToan) return;
        if (msg.type !== 'payment_success') return;
        if (msg.payload?.hoa_don_id !== this.maHoaDonDangThanhToan) return;
        if (this.daXuLyThanhToan) return;

        this.daXuLyThanhToan = true;

        localStorage.removeItem('pending_hoa_don');

        this.showToast('Thanh toán thành công!', 'success');

        this.currentStep = 4;
        this.isCheckoutDone = true;

        const userId = Number(localStorage.getItem('ma_nguoi_dung'));
        this.cartService.clearDB(userId).subscribe(() => {
          this.cartService.loadCountFromDB(userId);
        });
      });
  }

  loadCartFromDB(userId: number) {
    this.cartService.getByUser(userId).subscribe((res: any) => {

      this.gioHang = (res.data || []).map((x: any) => {

        const options = x.Options || [];

        const giaOption = options.reduce(
          (sum: number, opt: any) => sum + (opt.gia_them || 0),
          0
        );

        const giaGoc = x.MonAn?.gia_tien || 0;

        return {
          // ===== ID =====
          ma_gio_hang: x.MaGioHang,
          ma_mon_an: x.MaMonAn,

          // ===== UI =====
          ten_mon_an: x.MonAn?.ten_mon_an || '',
          anh: x.MonAn?.anh_mon_an?.[0]?.url || 'assets/no-image.png',

          // ===== OPTION =====
          options: options,

          // ===== GIÁ =====
          gia_goc: giaGoc,
          gia_option: giaOption,
          gia_don: giaGoc + giaOption,
          thanh_tien: (giaGoc + giaOption) * x.SoLuong,

          // ===== SỐ LƯỢNG =====
          soLuong: x.SoLuong,
        };
      });

      this.tinhTong();
    });
  }
  isVoucherValid(v: any): boolean {
    if (!v?.don_toi_thieu) return true;

    return this.tongTien >= v.don_toi_thieu;
  }

  // ================= CART =================
  tangSoLuong(item: any) {
    const token = localStorage.getItem('token');

    // ===== GUEST → LOCAL =====
    if (!token) {
      const list = this.cartService.getLocal();

      // Tìm sản phẩm trùng mã món và trùng tập hợp các options đi kèm
      const index = list.findIndex(x =>
        x.ma_mon_an === item.ma_mon_an &&
        JSON.stringify(x.options || []) === JSON.stringify(item.options || [])
      );

      if (index === -1) return;

      list[index].soLuong = (list[index].soLuong || 1) + 1;

      // 🔥 chuẩn hóa lại UI và tính toán lại giá
      this.gioHang = list.map(x => this.normalizeCartItem(x));

      this.cartService.saveLocal(list);
      this.tinhTong();
      return;
    }
  }

  giamSoLuong(item: any) {
    const token = localStorage.getItem('token');

    // ===== GUEST → LOCAL =====
    if (!token) {
      const list = this.cartService.getLocal();

      // Tìm sản phẩm trùng mã món và trùng tập hợp các options đi kèm
      const index = list.findIndex(x =>
        x.ma_mon_an === item.ma_mon_an &&
        JSON.stringify(x.options || []) === JSON.stringify(item.options || [])
      );

      if (index === -1) return;

      list[index].soLuong = (list[index].soLuong || 1) - 1;

      // ❌ Nếu số lượng giảm về <= 0 thì tiến hành xóa món ra khỏi giỏ
      if (list[index].soLuong <= 0) {
        list.splice(index, 1);
      }

      // 🔥 chuẩn hóa lại UI và tính toán lại giá
      this.gioHang = list.map(x => this.normalizeCartItem(x));

      this.cartService.saveLocal(list);
      this.tinhTong();
      return;
    }
  }

  changeSoLuong(event: any) {
    const { item, type } = event;

    if (!item) return;

    const token = localStorage.getItem('token');
    const userId = Number(localStorage.getItem('ma_nguoi_dung'));

    const newQty = type === 'plus'
      ? (item.soLuong || 1) + 1
      : (item.soLuong || 1) - 1;

    if (newQty <= 0) {
      this.removeFromGioHang(item);
      return;
    }

    // ================= LOCAL =================
    if (!token) {
      const list = this.cartService.getLocal();

      const index = list.findIndex(x =>
        x.ma_mon_an === item.ma_mon_an &&
        JSON.stringify(x.options || []) === JSON.stringify(item.options || [])
      );

      if (index === -1) return;

      list[index].soLuong = newQty;

      this.cartService.saveLocal(list);

      this.gioHang = list.map(x => this.normalizeCartItem(x));

      this.tinhTong();
      return;
    }

    // ================= DB =================
    if (!item.ma_gio_hang) {
      console.error('Missing ma_gio_hang', item);
      return;
    }

    this.cartService.updateSoLuong(Number(item.ma_gio_hang), newQty)
      .subscribe({
        next: (res: any) => {
          item.soLuong = newQty;
          item.thanh_tien = item.gia_don * newQty;

          this.tinhTong();

          const userId = Number(localStorage.getItem('ma_nguoi_dung'));
          this.cartService.loadCountFromDB(userId);
        },
        error: (err) => {
          console.error('UPDATE CART FAIL:', err);
        }
      });
  }

  removeFromGioHang(item: any) {

    const token = localStorage.getItem('token');
    const userId = Number(localStorage.getItem('ma_nguoi_dung'));

    // =========================
    // ❌ CHƯA LOGIN → LOCAL
    // =========================
    if (!token) {

      const list = this.cartService.getLocal();

      const newList = list.filter(x =>
        x.cartLocalId !== item.cartLocalId   // ⭐ giờ luôn đúng
      );

      this.cartService.saveLocal(newList);

      this.gioHang = newList.map(x => this.normalizeCartItem(x));

      this.tinhTong();

      return;
    }

    // =========================
    // 🔥 LOGIN → DB
    // =========================
    this.cartService.deleteDB(item.ma_gio_hang).subscribe({

      next: () => {

        this.gioHang = this.gioHang.filter(x =>
          x.ma_gio_hang !== item.ma_gio_hang
        );

        this.tinhTong();

        this.cartService.loadCountFromDB(userId);
      },

      error: (err) => {
        console.error('Xóa thất bại:', err);
      }
    });
  }

  tinhTong() {
    this.tongTien = this.gioHang.reduce((s, i) => {

      const giaGoc = i.gia_goc || 0;

      const optionTotal = (i.options || []).reduce(
        (oSum: number, o: any) => oSum + (o.gia_them || 0),
        0
      );

      return s + (giaGoc + optionTotal) * i.soLuong;

    }, 0);

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
    const payload = {
      ho_ten: this.newDiaChi.ho_ten,
      sdt: this.newDiaChi.sdt,
      dia_chi: this.newDiaChi.dia_chi,
      mac_dinh: this.newDiaChi.mac_dinh,
      latitude: this.newDiaChi.latitude,
      longitude: this.newDiaChi.longitude,
      ma_nguoi_dung: this.newDiaChi.ma_nguoi_dung
    };

    this.diaChiService.ThemDiaChi(payload)
      .subscribe(() => {
        this.loadDiaChi();
        this.showAddAddress = false;
        this.openMap = false;
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

    this.isCreatingPayment = true;

    const tongTien = this.tinhTienSauGiam();

    if (!tongTien || tongTien <= 0) {
      this.showToast('Tổng tiền không hợp lệ', 'error');
      this.isCreatingPayment = false;
      return;
    }

    const request = {
      ho_ten: this.tenNguoiNhan,
      sdt: this.soDienThoai,
      dia_chi: this.diaChi,
      ghi_chu: this.ghiChu,
      code_giam_gia: this.maGiamGiaChon?.code || null,
      mon_ans: this.gioHang.map(i => ({
        ma_mon_an: i.ma_mon_an,
        so_luong: i.soLuong,
        ghi_chu: i.ghi_chu || '',
        options: (i.options || []).map((op: any) => ({
          ma_option_item: op.ma_option_item
        }))
      }))
    };

    console.log('🔥 CREATE ORDER REQUEST:', request);

    this.hoadonservice.taoHoaDon(request).subscribe({
      next: (res: any) => {

        console.log('🔥 ORDER RESPONSE:', res);

        // =========================
        // ⚠️ FIX QUAN TRỌNG
        // backend trả data nằm trong res.data
        // =========================
        const order = res?.data || res;

        if (!order?.ma_hd) {
          this.showToast('Không tạo được hóa đơn', 'error');
          this.isCreatingPayment = false;
          return;
        }

        this.maHoaDonDangThanhToan = order.ma_hd;
        localStorage.setItem('pending_hoa_don', String(order.ma_hd));

        const payload = {
          amount: Math.round(Number(order.tong_tien || 0)),
          invoice_number: `HD${order.ma_hd}`,
          description: `Thanh toán hóa đơn HD${order.ma_hd}`,
          success_url: window.location.origin + '/payment-success',
          error_url: window.location.origin + '/payment-error',
          cancel_url: window.location.origin + '/payment-cancel',
        };

        console.log('🔥 SEPAY PAYLOAD:', payload);

        this.paymentService.createSePayPayment(payload).subscribe({
          next: (r: any) => {

            console.log('🔥 SEPAY RESPONSE:', r);

            const order = res?.data || res;

            if (!order?.ma_hd) {
              this.showToast('Không tạo được hóa đơn', 'error');
              this.isCreatingPayment = false;
              return;
            }

            const amount = Math.round(Number(order.tong_tien || 0));
            const content = `HD${order.ma_hd}`;

            // ✅ CHỈ DÙNG QR TỰ TẠO (KHÔNG DÙNG r.qr_url)
            this.qrUrl =
              `https://qr.sepay.vn/img?acc=0123456789&bank=MBBank` +
              `&amount=${amount}&des=${encodeURIComponent(content)}`;

            console.log('QR URL:', this.qrUrl);

            this.maHoaDonDangThanhToan = order.ma_hd;
            localStorage.setItem('pending_hoa_don', String(order.ma_hd));

            this.showQR = true;
            this.isCreatingPayment = false;
          },

          error: (err) => {
            console.error('❌ SEPAY ERROR:', err);
            this.showToast('Không tạo được QR thanh toán', 'error');
            this.isCreatingPayment = false;
          }
        });

      },

      error: (err) => {
        console.error('❌ ORDER ERROR:', err);
        this.showToast(
          err?.error?.message || 'Không thể tạo hóa đơn',
          'error'
        );
        this.isCreatingPayment = false;
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
    this.router.navigate(['/thucdon']);
  }
  goToDonHang() {
    this.router.navigate(['/user/don-hang']);
  }
  apDungMa(code: string) {

    if (!code?.trim()) return;

    const found = this.giamGiaList.find(
      v => v.code?.toLowerCase() === code.trim().toLowerCase()
    );

    if (!found) {
      this.showToast('Mã giảm giá không hợp lệ', 'error');
      return;
    }

    if (!this.isVoucherValid(found)) {
      this.showToast('Đơn hàng chưa đủ điều kiện', 'warn');
      return;
    }

    this.maGiamGiaChon = found;
    this.tongSauGiam = this.tinhTienSauGiam();

    this.showToast('Áp dụng mã thành công', 'success');
  }

  onChangeMaNhap() {
    if (!this.maNhap) {
      this.maGiamGiaChon = null;
      this.tongSauGiam = this.tongTien;
    }
  }
  private normalizeCartItem(x: any) {

    const options = x.options || [];

    const giaOption = options.reduce(
      (sum: number, o: any) => sum + (o.gia_them || 0),
      0
    );

    const giaGoc =
      x.gia_goc ??
      x.gia_tien ??
      x.gia ??
      0;

    return {
      // ⭐ QUAN TRỌNG: dùng 1 field duy nhất
      cartLocalId: x.cartLocalId,

      ma_gio_hang: x.ma_gio_hang || x.cartLocalId,

      ma_mon_an: x.ma_mon_an,
      ten_mon_an: x.ten_mon_an || '',
      anh: x.anh || 'assets/no-image.png',

      options,

      gia_goc: giaGoc,
      gia_option: giaOption,
      gia_don: giaGoc + giaOption,

      soLuong: x.soLuong || 1,

      thanh_tien: (giaGoc + giaOption) * (x.soLuong || 1),
    };
  }

  moSuaItem(item: any) {

    const dialogRef = this.dialog.open(SuaGioHang, {
      data: {
        ...item,
        options: item.options || [],
        optionsGroups: item.optionsGroups || []
      },
      width: '90vw',
      maxWidth: '1000px',
      height: '85vh',
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (!result) return;

      if (this.isLoggedIn) {
        this.cartService.updateCartItem(item.ma_gio_hang, {
          so_luong: result.soLuong,
          options: result.options.map((o: any) => ({
            ma_nhom_option: o.ma_nhom_option,
            ma_option_item: o.ma_option_item
          }))
        }).subscribe({
          next: () => {
            this.showToast('Cập nhật giỏ hàng thành công', 'success');

            const userId = Number(localStorage.getItem('ma_nguoi_dung'));
            this.loadCartFromDB(userId); // 🔥 CHỈ LOAD DB
          },
          error: () => {
            this.showToast('Cập nhật thất bại', 'error');
          }
        });
      } else {
        // LOCAL
        this.cartService.updateLocal({
          cartLocalId: item.cartLocalId,
          soLuong: result.soLuong,
          options: result.options
        });

        this.gioHang = this.cartService.getLocal()
          .map(x => this.normalizeCartItem(x));
      }

      this.tinhTong();
      this.showToast('Cập nhật món ăn thành công', 'success');
    });
  }

  ngOnDestroy() {
    this.websocketService.disconnect();
  }


}