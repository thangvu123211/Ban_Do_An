import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ViewChild, ElementRef } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ThemBanAn } from './them-ban-an/them-ban-an';
import { SuaBanAn } from './sua-ban-an/sua-ban-an';
import { QuanLyBanAnService } from '../../../core/services/QuanLyBanAn.service';
import { ToastMessageComponent } from '../../../Shared/toasts_message/toast-message/toast-message';
import { ConfirmDialogComponent } from '../../../Shared/dialogs/confirm-dialog/confirm-dialog';
import { MATERIAL } from '../../../Shared/material';

@Component({
  selector: 'app-ban-an',
  imports: [MATERIAL, ToastMessageComponent],
  templateUrl: './ban-an.html',
  styleUrl: './ban-an.scss'
})
export class BanAn implements OnInit {
  BanAn: any[] = [];

  newBanAn: any = {
    TENBAN: '',
    SO_CHO_NGOI: '',
    TRANGTHAI: ''
  };
  selectedFile: File | null = null;
  previewUrl: string | ArrayBuffer | null = null;
  showForm = false;
  editMode = false;
  editingBanAnId: number | null = null; // ID user đang sửa
  @ViewChild('fileInput') fileInput!: ElementRef;

  toast = {
    show: false,
    message: '',
    type: 'success' as 'success' | 'warn' | 'error'
  };

  constructor(
    private http: HttpClient,
    private dialog: MatDialog,
    private QuanLyBanAnService: QuanLyBanAnService,
  ) { }

  showToast(message: string, type: 'success' | 'warn' | 'error') {
    this.toast.show = true;
    this.toast.message = message;
    this.toast.type = type;
    setTimeout(() => this.toast.show = false, 3000);
  }

  loadBanAn() {
    this.QuanLyBanAnService.LayTatCaBanAn().subscribe({
      next: (res: any) => {
        if (Array.isArray(res.data)) {
          this.BanAn = res.data.map((u: any) => ({
            ...u,
            anh_ban_url: u.anh_ban?.length ? u.anh_ban[0].url : null,
            anh_qr_url: u.anh_qr || null
          }));
        }
      },
      error: (err) => {
        console.error('Lỗi khi load bàn ăn:', err);
      }
    });
  }

  ThemBanAn() {
    const dialogRef = this.dialog.open(ThemBanAn, {
      width: '900px',
      maxWidth: '110vw',
      panelClass: 'custom-dialog'
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.showToast('Thêm bàn ăn thành công!', 'success');
        this.loadBanAn(); // load lại danh sách
      } else {
        this.showToast('Bạn đã hủy thêm bần ăn', 'warn');
      }
    });
  }
  SuaBanAn(ma_ban: number) {
    const dialogRef = this.dialog.open(SuaBanAn, {
      width: '900px',
      maxWidth: '110vw',
      data: {
        ma_ban
      },
      panelClass: 'custom-dialog'
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.showToast('Cập nhật bàn ăn thành công', 'success');
        this.loadBanAn();
        const payload = {
        };
      } else {
        this.showToast('Bạn đã hủy sửa bàn ăn', 'warn');
      }
    });
  }
  XoaBanAn(ma_ban: number) {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '400px',
      data: { message: 'Bạn có chắc muốn xóa bàn ăn này?' }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.showToast('Xóa bàn ăn thành công', 'success');
        this.QuanLyBanAnService.XoaBanAn(ma_ban).subscribe({

          next: () => this.loadBanAn(),
          error: (err) => {
            this.showToast('Xóa bàn ăn không thành công', 'error');
          }
        });
      }
    });
  }

  printQR(url: string, tenBan: string) {
    if (!url) return;

    const width = 800;
    const height = 800;
    const left = (window.screen.width - width) / 2;
    const top = (window.screen.height - height) / 2;

    const win = window.open(
      '',
      '_blank',
      `width=${width},height=${height},top=${top},left=${left}`
    );

    if (!win) {
      alert("Trình duyệt đã chặn popup. Hãy bật cho phép!");
      return;
    }

    win.document.write(`
    <html>
  <head>
    <title>Nhà hàng FreshFood in QR bàn ăn: ${tenBan}</title>
    <style>
      @media print {
        @page { margin: 10mm; }
        body { margin: 0; }
      }
      body {
        display: flex;
        justify-content: center;
        align-items: center;
        height: 100vh;
        margin: 0;
        font-family: Arial, sans-serif;
        background: #f7f7f7;
      }
      .qr-container {
        text-align: center;
        background: #fff;
        padding: 20px 30px;
        border-radius: 12px;
        box-shadow: 0 4px 10px rgba(0,0,0,0.1);
      }
      .qr-container h2 {
        margin-bottom: 20px;
        font-size: 20px;
        color: #333;
      }
      .qr-box {
        display: inline-block;
        padding: 15px;
        border: 1px solid #ddd;
        border-radius: 12px;
        background: #fff;
      }
      .qr-box img {
        width: 200px; /* cố định size QR */
        height: 200px;
        display: block;
        margin: 0 auto;
      }
      .qr-container span {
        display: block; /* để margin-top/margin-bottom có tác dụng */
        margin-top: 20px;
        margin-bottom: 20px;
      }
    </style>
  </head>
  <body>
    <div class="qr-container">
      <h2>Bàn ăn: ${tenBan}</h2>
      <div class="qr-box">
        <img id="qrImg" src="${url}" />
      </div>
      <div>
      <span class="restaurant-name" >Nhà Hàng Fresh Food </span>
      </div>
    </div>
    <script>
      const img = document.getElementById('qrImg');
      img.onload = function() {
        window.print();
        window.close();
      };
    </script>
  </body>
</html>
  `);
  }



  ngOnInit(): void {
    this.loadBanAn();
  }
}
