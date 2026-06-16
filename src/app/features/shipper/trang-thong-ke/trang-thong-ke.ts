import { Component, OnInit } from '@angular/core';
import { MATERIAL } from '../../../Shared/material';
import { UserService } from '../../../core/services/user.service';
import {
  ApexAxisChartSeries,
  ApexChart,
  ApexXAxis,
  ApexDataLabels,
  ApexStroke,
  ApexTooltip,
  NgApexchartsModule,

} from 'ng-apexcharts';
import { shipperService } from '../../../core/services/shipper.service';
export type AreaChartOptions = {
  series: ApexAxisChartSeries;
  chart: ApexChart;
  xaxis: ApexXAxis;
  stroke: ApexStroke;
  tooltip: ApexTooltip;
  dataLabels: ApexDataLabels;
};
@Component({
  selector: 'app-trang-thong-ke',
  imports: [MATERIAL,NgApexchartsModule],
  templateUrl: './trang-thong-ke.html',
  styleUrl: './trang-thong-ke.scss'
})
export class TrangThongKe implements OnInit {
  TongTienDaGiaoTrongNgayHomNay = 0;
  dangTai = true;

  TongTienDaGiao = 0;

  TongHoaDonDagiao = 0;
  TongHoaDonDaGiaoHomNay = 0;
  TongHoaDonHuy = 0;
  TongDonHangDaduocGiao = 0;
  public areaChartOptions: AreaChartOptions;
  constructor(
    private userService: UserService,
    private shipperService:shipperService
  ) {

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

  TongSoTiendaGiaotrongngayhomnay() {
    this.dangTai = true;

    this.shipperService.TongSoTienDaGiaoTrongHomNay().subscribe({
      next: (res) => {
        this.TongTienDaGiaoTrongNgayHomNay = res.tong_tien_giao_hom_nay;
        this.dangTai = false;
      },
      error: (err) => {
        console.error('Lỗi load số tiền đã giao ngày hôm nay', err);
        this.dangTai = false;
      }
    });
  }

  TongSoTiendaGiao() {
    this.dangTai = true;

    this.shipperService.TongSoTienDaGiao().subscribe({
      next: (res) => {
        this.TongTienDaGiao = res.tong_tien_giao;
        this.dangTai = false;
      },
      error: (err) => {
        console.error('Lỗi load số tiền đã giao ngày hôm nay', err);
        this.dangTai = false;
      }
    });
  }

  TongHoaDonDaGiao() {
    this.dangTai = true;

    this.shipperService.TongSoHoadonDaGiao().subscribe({
      next: (res) => {
        this.TongHoaDonDagiao = res?.tong_tat_ca_don ?? 0;
        this.dangTai = false;
      },
      error: (err) => {
        console.error('Lỗi load tổng hóa đơn đã giao', err);
        this.dangTai = false;
      }
    });
  }

  TongHoaDonDaGiaohomnay() {
    this.dangTai = true;

    this.shipperService.TongSoHoadonDaGiaoHomNay().subscribe({
      next: (res) => {
        this.TongHoaDonDaGiaoHomNay = res?.tong_don_hom_nay ?? 0;
        this.dangTai = false;
      },
      error: (err) => {
        console.error('Lỗi load tổng hóa đơn đã giao hôm nay', err);
        this.dangTai = false;
      }
    });
  }
  

  loadTongTienTheoNgay() {
    this.shipperService.tongTienTheoNgaycuaship().subscribe({
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
    this.TongSoTiendaGiaotrongngayhomnay();
    this.TongSoTiendaGiao();
    this.TongHoaDonDaGiao();
    this.TongHoaDonDaGiaohomnay();

    this.loadTongTienTheoNgay();
  }
}
