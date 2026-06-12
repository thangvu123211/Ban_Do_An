import { Component, OnInit } from '@angular/core';
import { MATERIAL } from '../../../Shared/material';

import { NgApexchartsModule, ChartComponent } from 'ng-apexcharts';
import {
  ApexAxisChartSeries,
  ApexChart,
  ApexXAxis,
  ApexDataLabels,
  ApexStroke,
  ApexTooltip,
  ApexNonAxisChartSeries,
  ApexResponsive,
  ApexFill,
  ApexPlotOptions,
  ApexLegend,
  ApexYAxis,
  ApexTitleSubtitle
} from 'ng-apexcharts';
import { HoaDonService } from '../../../core/services/HoaDon.Service';
import { QuanLyNhanVienService } from '../../../core/services/QuanLyNhanVien.service';
import { AdminService } from '../../../core/services/admin.service';
import { DanhGiaService } from '../../../core/services/DanhGia.service';
import { forkJoin } from 'rxjs';

export interface PeriodicElement {
  name: string;
  position: number;
  weight: number;
  symbol: string;
}

// Bảng dữ liệu
const ELEMENT_DATA: PeriodicElement[] = [
  { position: 1, name: 'Hydrogen', weight: 1.0079, symbol: 'H' },
  { position: 2, name: 'Helium', weight: 4.0026, symbol: 'He' },
  { position: 3, name: 'Lithium', weight: 6.941, symbol: 'Li' },
  { position: 4, name: 'Beryllium', weight: 9.0122, symbol: 'Be' },
  { position: 5, name: 'Boron', weight: 10.811, symbol: 'B' },
  { position: 6, name: 'Carbon', weight: 12.0107, symbol: 'C' },
  { position: 7, name: 'Nitrogen', weight: 14.0067, symbol: 'N' },
  { position: 8, name: 'Oxygen', weight: 15.9994, symbol: 'O' },
  { position: 9, name: 'Fluorine', weight: 18.9984, symbol: 'F' },
  { position: 10, name: 'Neon', weight: 20.1797, symbol: 'Ne' },
];

// Kiểu chart Pie
export type PieChartOptions = {
  series: ApexNonAxisChartSeries;
  chart: ApexChart;
  responsive: ApexResponsive[];
  labels: any;
};

// Kiểu chart Area
export type AreaChartOptions = {
  series: ApexAxisChartSeries;
  chart: ApexChart;
  xaxis: ApexXAxis;
  stroke: ApexStroke;
  tooltip: ApexTooltip;
  dataLabels: ApexDataLabels;
};
//char radialbar
export type RadialbarChartOptions = {
  series: ApexNonAxisChartSeries;
  chart: ApexChart;
  labels: string[];
  plotOptions: ApexPlotOptions;
};

//barchart
export type BarChartOptions = {
  series: ApexAxisChartSeries;
  chart: ApexChart;
  xaxis: ApexXAxis;
  stroke: ApexStroke;
  dataLabels: ApexDataLabels;
  plotOptions: ApexPlotOptions;
  yaxis: ApexYAxis;
  tooltip: ApexTooltip;
  colors: string[];
  title: ApexTitleSubtitle;
  subtitle: ApexTitleSubtitle;
};
//Aria chart basic
export type AreaBasicChartOptions = {
  series: ApexAxisChartSeries;
  chart: ApexChart;
  xaxis: ApexXAxis;
  stroke: ApexStroke;
  dataLabels: ApexDataLabels;
  yaxis: ApexYAxis;
  title: ApexTitleSubtitle;
  labels: string[];
  legend: ApexLegend;
  subtitle: ApexTitleSubtitle;
};



@Component({
  selector: 'app-dashboardcomponent',
  standalone: true,
  imports: [MATERIAL, NgApexchartsModule],
  templateUrl: './dashboardcomponent.html',
  styleUrls: ['./dashboardcomponent.scss']
})
export class Dashboardcomponent implements OnInit {
  //dem so hoa don
  tongHoaDon = 0;
  dangTai = true;

  //dem so khach hang
  tongKhachHang = 0;
  dangTaiUser = true;

  //dem so hoa don huy
  tongHoaDonHuy = 0;
  dangTaiHoaDonHuy = false;

  //dem so hoa don da xac nhan
  tongdonhangdagiao = 0;
  dangTaihoadondagiao = false;

  //doanhthuhomnay
  doanhThuHomNay = 0;
  soDonHomNay = 0;
  ngayHomNay = '';
  doanhThuThang = 0;
  soDonThang = 0;
  thangNam = '';

  doanhThuNam = 0;
  soDonNam = 0;
  namHienTai = '';

  //danhgia
  soDanhGiaHomNay: number = 0;
  ngayDanhGia: string = '';

  //shipper
  shippers: any[] = [];


  // Area chart
  public areaChartOptions: AreaChartOptions;
  public RadialbarChartOptions: RadialbarChartOptions;
  public BarChartOptions: BarChartOptions;
  public AreaBasicChartOptions: AreaBasicChartOptions;
  public pieChartOptions: PieChartOptions;

  displayedColumns: string[] = [
    'ma_hoa_don',
    'ten_khach_hang',
    'thanh_tien',
    'trang_thai'
  ];
  dataSource: any[] = [];

  constructor(
    private hoaDonService: HoaDonService,
    private nhanVienService: QuanLyNhanVienService,
    private adminService: AdminService,
    private danhGiaService: DanhGiaService,
    private quanlynguoidung:QuanLyNhanVienService
  ) {

    this.pieChartOptions = {
      series: [],
      chart: {
        type: 'pie',
        width: 380
      },
      labels: [],
      responsive: [
        {
          breakpoint: 480,
          options: {
            chart: { width: 200 },
            legend: { position: 'bottom' }
          }
        }
      ]
    };
    // ================= AREA CHART (DOANH THU) =================
    this.areaChartOptions = {
      series: [],

      chart: {
        height: 350,
        type: 'area',

        // 🔒 QUAN TRỌNG: tắt hoàn toàn zoom
        zoom: {
          enabled: false
        },

        // ẩn toolbar
        toolbar: {
          show: false
        }
      },

      dataLabels: {
        enabled: false
      },

      stroke: {
        curve: 'smooth',
        width: 2
      },

      xaxis: {
        type: 'category',   // 🔒 ÉP TRỤC X LÀ CATEGORY
        categories: []      // ngày: ['01/06', '02/06', ...]
      },

      tooltip: {
        enabled: true,
        x: {
          format: 'dd/MM/yyyy'
        }
      }
    };

    // ================= RADIAL BAR (TỶ LỆ HOÀN THÀNH) =================
    this.RadialbarChartOptions = {
      series: [],
      chart: {
        height: 350,
        type: 'radialBar'
      },
      plotOptions: {
        radialBar: {
          dataLabels: {
            name: { fontSize: '18px' },
            value: { fontSize: '26px' },
            total: {
              show: true,
              label: 'Hoàn thành',
              formatter: () => '0%'
            }
          }
        }
      },
      labels: []
    };

    // ================= BAR CHART =================
    this.BarChartOptions = {
      series: [],
      chart: {
        type: 'bar',
        height: 380
      },
      plotOptions: {
        bar: {
          horizontal: true,
          distributed: true
        }
      },
      dataLabels: { enabled: false },
      stroke: { width: 1 },
      xaxis: { categories: [] },
      yaxis: { labels: { show: false } },
      tooltip: {},
      colors: [],
      title: { text: '' },
      subtitle: { text: '' }
    };

    // ================= AREA BASIC CHART =================
    this.AreaBasicChartOptions = {
      series: [],
      chart: {
        type: 'area',
        height: 350,
        zoom: { enabled: false }
      },
      dataLabels: { enabled: false },
      stroke: { curve: 'straight' },
      xaxis: {
        type: 'datetime'
      },
      yaxis: {},
      labels: [],
      legend: { horizontalAlign: 'left' },
      title: { text: '' },
      subtitle: { text: '' }
    };
  }
  ngOnInit(): void {
    this.loadTongHoaDon();
    this.loadTongKhachHang();
    this.loadTongHoaDonHuy();
    this.loadDonHangDaGiao();
    this.layDoanhThuHomNay();

    this.layDoanhThuThang();
    this.layDoanhThuNam();
    this.laySoLuongDanhGiaHomNay();
    this.loadPieChartMonAnBanChay();
    this.loadAreaChartDoanhThuNgay();
    this.loadRadialHoanThanh();
    this.loadTop9monbanchaynhat();
    this.loadSoDonTheoNgay();
    this.loadDonHangDaGiaoHomNay();
    this.loadShippers();
  }
  loadTongHoaDon() {
    this.dangTai = true;

    this.hoaDonService.getAllHoaDon().subscribe({
      next: (data) => {
        this.tongHoaDon = data.length;
        this.dangTai = false;
      },
      error: (err) => {
        console.error('Lỗi load hóa đơn', err);
        this.dangTai = false;
      }
    });
  }

  loadTongKhachHang() {
    this.dangTaiUser = true;

    this.nhanVienService.LayTatCaNhanVien().subscribe({
      next: (res: any) => {

        // ✅ lấy list đúng format
        const list = res.data ?? res;

        // 🔥 CHỈ LẤY USER
        const users = list.filter((x: any) =>
          x.loai_nguoi_dung === 'user'
        );

        this.tongKhachHang = users.length;
        this.dangTaiUser = false;
      },
      error: (err) => {
        console.error('Lỗi load user', err);
        this.dangTaiUser = false;
      }
    });
  }

  loadTongHoaDonHuy() {
    this.dangTaiHoaDonHuy = true;

    this.hoaDonService.getAllHoaDon().subscribe({
      next: (data: any[]) => {

        const hoaDonHuy = data.filter(
          hd => hd.trang_thai === 'da_huy'
        );

        this.tongHoaDonHuy = hoaDonHuy.length;
        this.dangTaiHoaDonHuy = false;
      },

      error: (err) => {
        console.error('Lỗi load hóa đơn hủy', err);
        this.tongHoaDonHuy = 0;
        this.dangTaiHoaDonHuy = false;
      }
    });
  }
  loadDonHangDaGiao() {
    this.dangTaihoadondagiao = true;

    this.hoaDonService.getAllHoaDon().subscribe({

      next: (data: any[]) => {

        const hoaDonGiao = data.filter(
          hd => hd.trang_thai === 'da_giao'
        );

        this.tongdonhangdagiao = hoaDonGiao.length;
        this.dangTaihoadondagiao = false;
      },


      error: (err) => {
        console.error('Lỗi load hóa đơn đã giao', err);
        this.tongdonhangdagiao = 0;
        this.dangTaihoadondagiao = false;
      }
    });
  }

  layDoanhThuHomNay() {

    this.adminService.LayDoanhThuNgay().subscribe({
      next: (res) => {
        const data = res.data;

        this.doanhThuHomNay = data.doanh_thu;
        this.soDonHomNay = data.so_don;
        this.ngayHomNay = data.ngay;
      },
      error: (err) => {
        console.error('Lỗi lấy doanh thu ngày:', err);
        this.doanhThuHomNay = 0;
      }
    });
  }

  layDoanhThuThang() {
    const now = new Date();

    this.adminService.getDoanhThuThang(
      now.getMonth() + 1,
      now.getFullYear()
    ).subscribe({
      next: (res) => {
        const data = res.data;
        this.doanhThuThang = data.doanh_thu;
        this.soDonThang = data.so_don;
        this.thangNam = `Tháng ${data.thang}/${data.nam}`;
      },
      error: (err) => {
        console.error('Lỗi lấy doanh thu tháng:', err);
        this.doanhThuThang = 0;
      }
    });
  }
  layDoanhThuNam() {
    const now = new Date();

    this.adminService.getDoanhThuNam(now.getFullYear()).subscribe({
      next: (res) => {
        const data = res.data;
        this.doanhThuNam = data.doanh_thu;
        this.soDonNam = data.so_don;
        this.namHienTai = `Năm ${data.nam}`;
      },
      error: (err) => {
        console.error('Lỗi lấy doanh thu năm:', err);
        this.doanhThuNam = 0;
      }
    });
  }
  laySoLuongDanhGiaHomNay() {
    this.danhGiaService.getSoLuongDanhGia().subscribe({
      next: (res) => {
        const data = res.data;
        this.soDanhGiaHomNay = data.so_danh_gia;
        this.ngayDanhGia = `Hôm nay (${data.ngay})`;
      },
      error: (err) => {
        console.error('Lỗi lấy số lượng đánh giá hôm nay:', err);
        this.soDanhGiaHomNay = 0;
      }
    });
  }

  loadPieChartMonAnBanChay() {
    this.adminService.getTopMonAnBanChay(5).subscribe({
      next: (res) => {
        const data = res.data;

        this.pieChartOptions = {
          ...this.pieChartOptions,
          series: data.map((item: any) => item.so_luong),
          labels: data.map((item: any) => item.ten_mon_an)
        };
      },
      error: (err) => {
        console.error('Lỗi load pie chart món ăn bán chạy', err);
      }
    });
  }

  loadAreaChartDoanhThuNgay() {
    const today = new Date();
    const days = 7;

    const requests = [];
    const labels: string[] = [];

    for (let i = days - 1; i >= 0; i--) {
      const d = new Date(today);
      d.setDate(today.getDate() - i);

      const ngay = d.toISOString().split('T')[0]; // yyyy-mm-dd
      labels.push(ngay);

      requests.push(this.adminService.LayDoanhThuNgay(ngay));
    }

    forkJoin(requests).subscribe({
      next: (responses) => {
        const doanhThuData = responses.map(res => res.data.doanh_thu);

        this.areaChartOptions = {
          series: [
            {
              name: 'Doanh thu',
              data: doanhThuData
            }
          ],
          chart: {
            type: 'area',
            height: 350,
            toolbar: { show: false }
          },
          stroke: {
            curve: 'smooth'
          },
          dataLabels: {
            enabled: false
          },
          xaxis: {
            categories: labels
          },
          tooltip: {
            y: {
              formatter: (val: number) =>
                val.toLocaleString('vi-VN') + ' ₫'
            }
          }
        };
      },
      error: (err) => {
        console.error('Lỗi load area chart doanh thu ngày', err);
      }
    });
  }
  loadRadialHoanThanh() {
    this.adminService.getTiLeHoanThanhHomNay().subscribe(res => {
      const tiLe = res.data.ti_le;

      this.RadialbarChartOptions = {
        series: [tiLe],
        chart: {
          height: 350,
          type: 'radialBar'
        },
        plotOptions: {
          radialBar: {
            dataLabels: {
              name: {
                fontSize: '18px'
              },
              value: {
                fontSize: '26px',
                formatter: () => tiLe + '%'
              },
              total: {
                show: true,
                label: 'Hoàn thành',
                formatter: () => `${tiLe}%`
              }
            }
          }
        },
        labels: ['Đơn hôm nay']
      };
    });
  }

  loadTop9monbanchaynhat() {
    this.adminService.getTopMonBanChay(9).subscribe({
      next: (res) => {
        const data = res;

        const tenMon = data.map((x: any) => x.ten_mon_an);
        const soLuong = data.map((x: any) => x.tong_ban); // 🔥 SỬA Ở ĐÂY

        this.BarChartOptions = {
          ...this.BarChartOptions,
          series: [
            {
              name: 'Số lượng bán',
              data: soLuong
            }
          ],
          xaxis: {
            categories: tenMon
          },
          title: {
            text: 'Top 9 món bán chạy nhất'
          },
          subtitle: {
            text: 'Thống kê theo số lượng bán'
          }
        };
      },
      error: (err) => {
        console.error('Lỗi load top món bán chạy', err);
      }
    });
  }

  loadSoDonTheoNgay() {
    this.adminService.getSoDonTheoNgay().subscribe({
      next: (res) => {
        if (!res || res.length === 0) {
          console.warn('Không có dữ liệu số đơn');
          return;
        }

        const ngay = res.map(x => x.ngay);
        const soDon = res.map(x => x.so_don);

        this.AreaBasicChartOptions = {
          ...this.AreaBasicChartOptions,
          series: [
            {
              name: 'Số đơn hàng',
              data: soDon
            }
          ],
          xaxis: {
            categories: ngay
          },
          title: {
            text: 'Số đơn hàng theo ngày'
          },
          subtitle: {
            text: 'Chỉ tính đơn hoàn thành & đã thanh toán'
          }
        };
      },
      error: (err) => {
        console.error('Lỗi load số đơn theo ngày', err);
      }
    });
  }
  loadDonHangDaGiaoHomNay() {
    this.adminService.getDonDaGiaoHomNay().subscribe({
      next: (res) => {
        this.dataSource = res;
      },
      error: (err) => {
        console.error('Lỗi load đơn hàng đã giao', err);
      }
    });
  }

  loadShippers() {
    this.quanlynguoidung.getShippers().subscribe({
      next: (res) => {
        this.shippers = res;
      },
      error: (err) => {
        console.error('Lỗi load shipper', err);
      }
    });
  }

}
