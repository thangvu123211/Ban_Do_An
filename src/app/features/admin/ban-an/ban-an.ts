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

  ngOnInit(): void {
    this.loadBanAn();
  }
}
