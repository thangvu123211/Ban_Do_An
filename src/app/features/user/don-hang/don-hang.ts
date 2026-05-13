import { Component, OnInit } from '@angular/core';
import { HoaDonService } from '../../../core/services/HoaDon.Service';
import { MATERIAL } from '../../../Shared/material';
import { MatDialog } from '@angular/material/dialog';
import { ThongTinDonHang } from '../dialogs/thong-tin-don-hang/thong-tin-don-hang';

@Component({
  selector: 'app-don-hang',
  imports: [MATERIAL],
  templateUrl: './don-hang.html',
  styleUrl: './don-hang.scss'
})
export class DonHang implements OnInit {
  hoaDons: any[] = [];
  loading = false;

  constructor(
    private hoaDonService: HoaDonService,
    private dialog: MatDialog) { }

  ngOnInit(): void {
    this.loadHoaDons();
  }
  loadHoaDons() {
    this.loading = true;
    this.hoaDonService.getAllHoaDon().subscribe({
      next: (res: any) => {
        this.hoaDons = res.data; // backend trả { data: [...] }
        this.loading = false;
      },
      error: () => {
        this.loading = false;
        alert('Không thể tải hóa đơn');
      }
    });
  }

  ThongTinDonHang(hoaDon: any) {
    this.dialog.open(ThongTinDonHang, {
      width: '1000px',
      maxWidth: '95vw',
      height: '85vh',
      data: hoaDon
    });
  }

  huyHoaDon(id: number) {
    if (!confirm('Bạn có chắc muốn hủy hóa đơn này?')) return;

    this.hoaDonService.huyHoaDon(id).subscribe(() => {
      this.loadHoaDons();
    });
  }
}
