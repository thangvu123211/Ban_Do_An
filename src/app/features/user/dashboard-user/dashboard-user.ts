import { Component, OnInit } from '@angular/core';
import { MATERIAL } from '../../../Shared/material';
import { UserService } from '../../../core/services/user.service';
import { NgApexchartsModule, ChartComponent } from 'ng-apexcharts';
import {
  ApexAxisChartSeries,
  ApexChart,
  ApexXAxis,
  ApexDataLabels,
  ApexStroke,
  ApexTooltip,

} from 'ng-apexcharts';
export type AreaChartOptions = {
  series: ApexAxisChartSeries;
  chart: ApexChart;
  xaxis: ApexXAxis;
  stroke: ApexStroke;
  tooltip: ApexTooltip;
  dataLabels: ApexDataLabels;
};

@Component({
  selector: 'app-dashboard-user',

  imports: [MATERIAL, NgApexchartsModule],
  templateUrl: './dashboard-user.html',
  styleUrl: './dashboard-user.scss'
})

export class DashboardUser implements OnInit {
  TongTienDaChi = 0;
  dangTai = true;

  TongHoaDon = 0;
  TongHoaDonHuy = 0;
  TongDonHangDaduocGiao = 0;
  public areaChartOptions: AreaChartOptions;
  constructor(private userService: UserService) {

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
  }

  SotienDaThanhToan() {
    this.dangTai = true;

    this.userService.getSoTienDaChiCuaUser().subscribe({
      next: (res) => {
        this.TongTienDaChi = res.tong_tien_da_mua;
        this.dangTai = false;
      },
      error: (err) => {
        console.error('Lỗi load hóa đơn', err);
        this.dangTai = false;
      }
    });
  }

  TongHoaDonDaThanhToan() {
    this.dangTai = true;

    this.userService.tongsohoadondathanhtoanvahuy().subscribe({
      next: (res) => {
        this.TongHoaDon = res?.tong_hoa_don_da_thanh_toan ?? 0;
        this.dangTai = false;
      },
      error: (err) => {
        console.error('Lỗi load tổng hóa đơn đã thanh toán', err);
        this.dangTai = false;
      }
    });
  }
  TongHoaDonDaBiHuy() {
    this.dangTai = true;

    this.userService.tongsohoadondathanhtoanvahuy().subscribe({
      next: (res) => {
        this.TongHoaDonHuy = res?.tong_hoa_don_da_huy ?? 0;
        this.dangTai = false;
      },
      error: (err) => {
        console.error('Lỗi load tổng hóa đơn bị hủy', err);
        this.dangTai = false;
      }
    });
  }
  TongDonHangDaGiao() {
    this.dangTai = true;

    this.userService.TongDonHangDaGiao().subscribe({
      next: (res) => {
        this.TongDonHangDaduocGiao = res?.tong_don_hang_da_giao ?? 0;
        this.dangTai = false;
      },
      error: (err) => {
        console.error('Lỗi load tổng số đơn hàng được giao', err);
        this.dangTai = false;
      }
    });
  }

  loadTongTienTheoNgay() {
    this.userService.tongTienTheoNgay().subscribe({
      next: (res) => {

        const labels = res.data.map((x: any) => {
          const d = new Date(x.ngay);
          return `${d.getDate().toString().padStart(2, '0')}/${(d.getMonth() + 1)
            .toString()
            .padStart(2, '0')}/${d.getFullYear()}`;
        });

        const values = res.data.map((x: any) => x.tong_tien);

        this.areaChartOptions = {
          series: [
            {
              name: 'Tổng tiền',
              data: values
            }
          ],
          chart: {
            type: 'area',
            height: 300,
            toolbar: { show: false }
          },
          xaxis: {
            categories: labels
          },
          stroke: {
            curve: 'smooth',
            width: 2
          },
          dataLabels: {
            enabled: false
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
        console.error('Lỗi load chart', err);
      }
    });
  }
  ngOnInit(): void {
    this.SotienDaThanhToan();
    this.TongHoaDonDaThanhToan();
    this.TongHoaDonDaBiHuy();
    this.TongDonHangDaGiao();
    this.loadTongTienTheoNgay();
  }
}
