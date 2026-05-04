import { Component, OnInit } from '@angular/core';
import { MATERIAL } from '../../../Shared/material';
import { LienHeService } from '../../../core/services/LienHe.service';
import { ToastMessageComponent } from '../../../Shared/toasts_message/toast-message/toast-message';
import { MatDialog } from '@angular/material/dialog';
import { ChiTiettLienHe } from './chi-tiett-lien-he/chi-tiett-lien-he';
import { ConfirmDialogComponent } from '../../../Shared/dialogs/confirm-dialog/confirm-dialog';

@Component({
  selector: 'app-lien-he',
  imports: [MATERIAL, ToastMessageComponent],
  templateUrl: './lien-he.html',
  styleUrl: './lien-he.scss'
})
export class LienHe implements OnInit {

  toast = {
    show: false,
    message: '',
    type: 'success' as 'success' | 'warn' | 'error'
  };

  danhSachLienHe: any[] = [];

  showToast(message: string, type: 'success' | 'warn' | 'error') {
    this.toast.show = true;
    this.toast.message = message;
    this.toast.type = type;
    setTimeout(() => this.toast.show = false, 3000);
  }

  constructor(private lienHeService: LienHeService, private dialog: MatDialog) { }

  ngOnInit(): void {
    this.loadLienHe();
  }

  loadLienHe() {
    this.lienHeService.LayTatCaLienHe().subscribe({
      next: (res) => {
        this.danhSachLienHe = res.data || res;
      },
      error: (err) => {
        console.error('Lỗi load liên hệ', err);
      }
    });
  }



  xemChiTiet(lienHe: any) {
    this.dialog.open(ChiTiettLienHe, {
      width: '500px',
      maxWidth: '110vw',
      panelClass: 'custom-dialog',
      data: lienHe
    });
  }

  openDialogXoa(id: number) {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '400px',
      data: { message: 'Bạn có chắc muốn xóa liên hệ này?' }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.showToast('Xóa liên hệ thành công', 'success');
        this.lienHeService.XoaLienHe(id).subscribe({

          next: () => this.loadLienHe(),
          error: (err) => {
            this.showToast('Xóa liên hệ không thành công', 'error');
          }
        });
      }
    });
  }
}
