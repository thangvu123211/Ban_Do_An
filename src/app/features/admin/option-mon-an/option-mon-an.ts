import { Component, OnInit } from '@angular/core';
import { QuanLyMonAn } from '../../../core/services/QuanLyMonAn.service';
import { OptionService } from '../../../core/services/option.service';
import { MATERIAL } from '../../../Shared/material';
import { ToastMessageComponent } from '../../../Shared/toasts_message/toast-message/toast-message';
import { ConfirmDialogComponent } from '../../../Shared/dialogs/confirm-dialog/confirm-dialog';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-option-mon-an',
  imports: [MATERIAL, ToastMessageComponent],
  templateUrl: './option-mon-an.html',
  styleUrl: './option-mon-an.scss'
})
export class OptionMonAn implements OnInit {

  MonAn: any[] = [];
  monAnDangChon: any = null;
  editingNhomId: number | null = null;

  nhomOption = {
    ten_nhom: '',
    loai: 'bat_buoc',
    so_luong_toi_da: 1,
    so_luong_toi_thieu: 0
  };

  editingOptionId: number | null = null;

  editingId: number | null = null;

  optionItems: any[] = [];

  danhSachNhomOption: any[] = [];

  toast = {
    show: false,
    message: '',
    type: 'success' as 'success' | 'warn' | 'error'
  };

  constructor(
    private monAnService: QuanLyMonAn,
    private optionService: OptionService,
    private dialog: MatDialog,
  ) { }

  showToast(message: string, type: 'success' | 'warn' | 'error') {
    this.toast.show = true;
    this.toast.message = message;
    this.toast.type = type;
    setTimeout(() => this.toast.show = false, 3000);
  }



  ngOnInit() {
    this.load_list_mon_an();
    this.loadOptionItems();
  }

  load_list_mon_an() {
    this.monAnService.LayTatCaMonAn().subscribe((res: any) => {
      this.MonAn = res.data || [];
    });
  }

  chonMonAn(mon: any) {
    this.monAnDangChon = mon;
    this.loadNhomOption();
  }

  loadOptionItems() {
    this.optionService.getAllOptionItem().subscribe((res: any) => {
      this.optionItems = res.data || [];
    });
  }

  /* ================= NHÓM OPTION ================= */

  themNhomOption() {
    if (!this.nhomOption.ten_nhom.trim()) {
      this.showToast('Vui lòng nhập tên nhóm option', 'warn');
      return;
    }

    if (!this.monAnDangChon) {
      this.showToast('Vui lòng chọn món ăn trước', 'warn');
      return;
    }

    const payload = {
      ma_mon_an: this.monAnDangChon.ma_mon_an,
      ten_nhom: this.nhomOption.ten_nhom,
      bat_buoc: this.nhomOption.loai === 'bat_buoc',
      chon_nhieu: this.nhomOption.loai === 'chon_nhieu',
      so_luong_toi_da: this.nhomOption.so_luong_toi_da,
      so_luong_toi_thieu: this.nhomOption.so_luong_toi_thieu
    };

    this.optionService.createNhomOption(payload).subscribe({
      next: () => {
        this.nhomOption.ten_nhom = '';
        this.nhomOption.loai = 'bat_buoc';
        this.showToast('Tạo nhóm option thành công', 'success');
        this.loadNhomOption();
      },
      error: () => {
        this.showToast('Tạo nhóm option thất bại', 'error');
      }
    });
  }

  loadNhomOption() {
    this.optionService.getAllNhomOption().subscribe((res: any) => {

      this.danhSachNhomOption = (res.data || [])
        .filter((n: any) => n.ma_mon_an === this.monAnDangChon.ma_mon_an)
        .map((n: any) => ({
          ...n,

          // 🔥 MAP backend → radio
          loai: n.bat_buoc ? 'bat_buoc' : 'chon_nhieu',

          option_items: (n.OptionItems || []).map((opt: any) => ({
            id: opt.ma_option_item,
            ten_option: opt.ten_option,
            gia_them: opt.gia_them
          })),

          newOption: {
            ten_option: '',
            gia_them: 0
          }
        }));

    });
  }
  /* ================= OPTION ITEM ================= */

  themOptionItem(nhom: any) {
    if (!nhom.newOption.ten_option.trim()) {
      this.showToast('Vui lòng nhập tên option', 'warn');
      return;
    }

    const payload = {
      ma_nhom_option: nhom.ma_nhom_option,
      ten_option: nhom.newOption.ten_option,
      gia_them: nhom.newOption.gia_them
    };

    this.optionService.createOptionItem(payload).subscribe({
      next: () => {
        nhom.newOption.ten_option = '';
        nhom.newOption.gia_them = 0;

        this.showToast('Thêm option thành công', 'success');
        this.loadNhomOption();
      },
      error: () => {
        this.showToast('Thêm option thất bại', 'error');
      }
    });
  }

  xoaNhomOption(nhom: any) {

    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '400px',
      data: { message: 'Bạn có chắc muốn xóa nhóm option này?' }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {

        // ⚠️ CHẶN nếu còn item
        if (nhom.option_items?.length > 0) {
          this.showToast('Phải xóa hết option item trước', 'warn');
          return;
        }

        this.optionService.deleteNhomOption(nhom.ma_nhom_option)
          .subscribe({
            next: () => {
              this.showToast('Xóa nhóm option thành công', 'success');
              this.loadNhomOption();
            },
            error: () => {
              this.showToast('Xóa nhóm option thất bại', 'error');
            }
          });

      }
    });
  }
  saveNhomOption(nhom: any) {
    const payload = {
      ten_nhom: nhom.ten_nhom,
      bat_buoc: nhom.loai === 'bat_buoc',
      chon_nhieu: nhom.loai === 'chon_nhieu'
    };

    this.optionService.updateNhomOption(nhom.ma_nhom_option, payload)
      .subscribe({
        next: () => {
          this.editingId = null;
          this.showToast('Cập nhật thành công', 'success');
          this.loadNhomOption();
        },
        error: () => {
          this.showToast('Cập nhật thất bại', 'error');
        }
      });
  }



  saveOptionItem(opt: any) {

    if (!opt.id) {
      this.showToast('Không tìm thấy ID option item', 'error');
      return;
    }

    const payload = {
      ten_option: opt.ten_option,
      gia_them: opt.gia_them
    };

    this.optionService.updateOptionItem(opt.id, payload)
      .subscribe({
        next: () => {
          this.showToast('Cập nhật option thành công', 'success');
          opt.editing = false;
          this.loadNhomOption();
        },
        error: () => {
          this.showToast('Cập nhật thất bại', 'error');
        }
      });
  }
  deleteOptionItem(opt: any) {

    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '400px',
      data: { message: 'Bạn có chắc muốn xóa option này không?' }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {

        this.optionService.deleteOptionItem(opt.id).subscribe({
          next: () => {
            this.showToast('Xóa option thành công', 'success');
            this.loadNhomOption();
          },
          error: () => {
            this.showToast('Xóa option thất bại', 'error');
          }
        });

      }
    });
  }
}