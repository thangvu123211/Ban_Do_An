import { Component } from '@angular/core';
import { MATERIAL } from '../../../Shared/material';
import { series } from './data';

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

export interface PeriodicElement {
  name: string;
  position: number;
  weight: number;
  symbol: string;
}

// Bảng dữ liệu
const ELEMENT_DATA: PeriodicElement[] = [
  {position: 1, name: 'Hydrogen', weight: 1.0079, symbol: 'H'},
  {position: 2, name: 'Helium', weight: 4.0026, symbol: 'He'},
  {position: 3, name: 'Lithium', weight: 6.941, symbol: 'Li'},
  {position: 4, name: 'Beryllium', weight: 9.0122, symbol: 'Be'},
  {position: 5, name: 'Boron', weight: 10.811, symbol: 'B'},
  {position: 6, name: 'Carbon', weight: 12.0107, symbol: 'C'},
  {position: 7, name: 'Nitrogen', weight: 14.0067, symbol: 'N'},
  {position: 8, name: 'Oxygen', weight: 15.9994, symbol: 'O'},
  {position: 9, name: 'Fluorine', weight: 18.9984, symbol: 'F'},
  {position: 10, name: 'Neon', weight: 20.1797, symbol: 'Ne'},
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
export class Dashboardcomponent {
  // Pie chart
  public pieChartOptions: PieChartOptions;
  // Area chart
  public areaChartOptions: AreaChartOptions;
  public RadialbarChartOptions:RadialbarChartOptions;
  public BarChartOptions:BarChartOptions;
  public AreaBasicChartOptions:AreaBasicChartOptions;

  displayedColumns: string[] = ['position', 'name', 'weight', 'symbol'];
  dataSource = ELEMENT_DATA;

  constructor() {
    // Pie chart
    this.pieChartOptions = {
      series: [44, 55, 13, 43, 22],
      chart: { width: 380, type: 'pie' },
      labels: ['Team A', 'Team B', 'Team C', 'Team D', 'Team E'],
      responsive: [
        {
          breakpoint: 480,
          options: { chart: { width: 200 }, legend: { position: 'bottom' } }
        }
      ]
    };

    // Area chart
    this.areaChartOptions = {
      series: [
        { name: 'series1', data: [31, 40, 28, 51, 42, 109, 100] },
        { name: 'series2', data: [11, 32, 45, 32, 34, 52, 41] }
      ],
      chart: { height: 350, type: 'area' },
      dataLabels: { enabled: false },
      stroke: { curve: 'smooth' },
      xaxis: {
        type: 'datetime',
        categories: [
          '2018-09-19T00:00:00.000Z',
          '2018-09-19T01:30:00.000Z',
          '2018-09-19T02:30:00.000Z',
          '2018-09-19T03:30:00.000Z',
          '2018-09-19T04:30:00.000Z',
          '2018-09-19T05:30:00.000Z',
          '2018-09-19T06:30:00.000Z'
        ]
      },
      tooltip: { x: { format: 'dd/MM/yy HH:mm' } }
    };

    this.RadialbarChartOptions = {
      series: [44, 55, 67, 83],
      chart: {
        height: 350,
        type: "radialBar"
      },
      plotOptions: {
        radialBar: {
          dataLabels: {
            name: {
              fontSize: "22px"
            },
            value: {
              fontSize: "16px"
            },
            total: {
              show: true,
              label: "Total",
              formatter: function(w) {
                return "249";
              }
            }
          }
        }
      },
      labels: ["Apples", "Oranges", "Bananas", "Berries"]
    };
    this.BarChartOptions = {
      series: [
        {
          data: [400, 430, 448, 470, 540, 580, 690, 1100, 1200, 1380]
        }
      ],
      chart: {
        type: "bar",
        height: 380
      },
      plotOptions: {
        bar: {
          barHeight: "100%",
          distributed: true,
          horizontal: true,
          dataLabels: {
            position: "bottom"
          }
        }
      },
      colors: [
        "#33b2df",
        "#546E7A",
        "#d4526e",
        "#13d8aa",
        "#A5978B",
        "#2b908f",
        "#f9a3a4",
        "#90ee7e",
        "#f48024",
        "#69d2e7"
      ],
      dataLabels: {
        enabled: true,
        textAnchor: "start",
        style: {
          colors: ["#fff"]
        },
        formatter: function(val, opt) {
          return opt.w.globals.labels[opt.dataPointIndex] + ":  " + val;
        },
        offsetX: 0,
        dropShadow: {
          enabled: true
        }
      },
      stroke: {
        width: 1,
        colors: ["#fff"]
      },
      xaxis: {
        categories: [
          "South Korea",
          "Canada",
          "United Kingdom",
          "Netherlands",
          "Italy",
          "France",
          "Japan",
          "United States",
          "China",
          "India"
        ]
      },
      yaxis: {
        labels: {
          show: false
        }
      },
      title: {
        text: "Custom DataLabels",
        align: "center",
        floating: true
      },
      subtitle: {
        text: "Category Names as DataLabels inside bars",
        align: "center"
      },
      tooltip: {
        x: {
          show: false
        },
        y: {
          title: {
            formatter: function() {
              return "";
            }
          }
        }
      }
    };
    this.AreaBasicChartOptions = {
      series: [
        {
          name: "STOCK ABC",
          data: series.monthDataSeries1.prices
        }
      ],
      chart: {
        type: "area",
        height: 350,
        zoom: {
          enabled: false
        }
      },
      dataLabels: {
        enabled: false
      },
      stroke: {
        curve: "straight"
      },

      title: {
        text: "Fundamental Analysis of Stocks",
        align: "left"
      },
      subtitle: {
        text: "Price Movements",
        align: "left"
      },
      labels: series.monthDataSeries1.dates,
      xaxis: {
        type: "datetime"
      },
      yaxis: {
        opposite: true
      },
      legend: {
        horizontalAlign: "left"
      }
    };
  }
}
