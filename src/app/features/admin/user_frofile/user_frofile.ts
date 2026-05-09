import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialogComponent } from '../../../Shared/dialogs/confirm-dialog/confirm-dialog';
import { ToastMessageComponent } from '../../../Shared/toasts_message/toast-message/toast-message';
import { SuaNhanVien } from './sua-nhan-vien/sua-nhan-vien';
import { ThemNhanVien } from './them-nhan-vien/them-nhan-vien';
import { QuanLyNhanVienService } from '../../../core/services/QuanLyNhanVien.service';
import { MATERIAL } from '../../../Shared/material';

@Component({
  selector: 'app-user-frofile',
  imports: [MATERIAL,ToastMessageComponent],
  templateUrl: './user_frofile.html',
  styleUrls: ['./user_frofile.scss']
})
export class UserFrofileComponents implements OnInit {
  NhanVien: any[] = [];
  showForm = false;
  selectedFile: File | null = null;
  previewUrl: string | ArrayBuffer | null = null;
  editingUserId: number | null = null;

  toast = {
    show: false,
    message: '',
    type: 'success' as 'success' | 'warn' | 'error'
  };

  @ViewChild('fileInput') fileInput!: ElementRef;

  constructor(
    private QuanLyNhanVienService: QuanLyNhanVienService,
    private dialog: MatDialog
  ) { }

  showToast(message: string, type: 'success' | 'warn' | 'error') {
    this.toast.show = true;
    this.toast.message = message;
    this.toast.type = type;
    setTimeout(() => this.toast.show = false, 3000);
  }

  ngOnInit(): void {
    this.load_list_user();
  }

  load_list_user() {
  this.QuanLyNhanVienService.LayTatCaNhanVien().subscribe({
    next: (res) => {
      if (Array.isArray(res)) {
        // map để tạo trường mới anh_nhan_vien_url
        this.NhanVien = res.map(u => ({
          ...u,
          anh_nguoi_dung_url: u.anh_nguoi_dung?.length ? u.anh_nguoi_dung[0].url : null
        }));
      }
    },
    error: (err) => {
      console.error('🟥 Lỗi khi load nhân viên:', err);
    }
  });
}

  onFileSelected(event: any) {
    this.selectedFile = event.target.files[0];
    if (this.selectedFile) {
      const reader = new FileReader();
      reader.onload = e => this.previewUrl = reader.result;
      reader.readAsDataURL(this.selectedFile);
    }
  }

  

  deleteUser(ma_nguoi_dung: number) {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '400px',
      data: { message: 'Bạn có chắc muốn xóa nhân viên này?' }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.showToast('Xóa nhân viên thành công.', 'success');
        this.QuanLyNhanVienService.XoaNhanVien(ma_nguoi_dung).subscribe({

          next: () => this.load_list_user(),
          error: (err) => {
            this.showToast('Xóa nhân viên không thành công.', 'error');
          }
        });
      }
    });
  }

 

  SuaNhanVien(ma_nguoi_dung: number) {
    const dialogRef = this.dialog.open(SuaNhanVien, {
      width: '900px',
      maxWidth: '110vw',
      data: {
        ma_nguoi_dung
      },
      panelClass: 'custom-dialog'
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
            this.showToast('Cập nhật nhân viên thành công', 'success');
            this.load_list_user();
        const payload = {
        };
      } else {
        this.showToast('Bạn đã hủy sửa nhân viên', 'warn');
      }
    });
  }

  ThemNhanVien() {
    const dialogRef = this.dialog.open(ThemNhanVien, {
      width: '900px',
      maxWidth: '110vw',
      panelClass: 'custom-dialog'
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.showToast('Thêm nhân viên thành công!', 'success');
        this.load_list_user(); // load lại danh sách
      } else {
        this.showToast('Bạn đã hủy thêm nhân viên', 'warn');
      }
    });
  }
}
