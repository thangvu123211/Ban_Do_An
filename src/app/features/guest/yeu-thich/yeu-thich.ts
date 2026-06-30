import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MATERIAL } from '../../../Shared/material';
import { YeuThichService } from '../../../core/services/YeuThich.service';
import { CartService } from '../../../core/services/cart.service';
import { ToastMessageComponent } from '../../../Shared/toasts_message/toast-message/toast-message';
import { Router } from '@angular/router';

@Component({
  selector: 'app-yeu-thich',
  imports: [MATERIAL, ToastMessageComponent],
  templateUrl: './yeu-thich.html',
})
export class YeuThich implements OnInit {

  danhSach: any[] = [];

  toast = {
    show: false,
    message: '',
    type: 'success' as 'success' | 'warn' | 'error'
  };


  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any[],
    private dialogRef: MatDialogRef<YeuThich>,
    private yeuThichService: YeuThichService,
    private cartService: CartService,
    private router: Router
  ) {
    const uniqueMap = new Map();

    (data || []).forEach(item => {
      uniqueMap.set(item.ma_mon_an, item);
    });

    this.danhSach = Array.from(uniqueMap.values());
  }

  showToast(message: string, type: 'success' | 'warn' | 'error') {
    this.toast.show = true;
    this.toast.message = message;
    this.toast.type = type;
    setTimeout(() => this.toast.show = false, 3000);
  }

  close() {
    this.dialogRef.close();
  }

  xoaYeuThich(item: any) {
    const token = localStorage.getItem('token');

    if (!token) {
      // Guest → xoá local
      this.yeuThichService.removeLocal(item.ma_mon_an);

      this.danhSach = this.danhSach.filter(
        x => x.ma_mon_an !== item.ma_mon_an
      );

      this.showToast('Đã xoá khỏi yêu thích', 'success');
    } else {
      // User → xoá DB
      this.yeuThichService.removeDB(item.ma_mon_an).subscribe({
        next: () => {
          this.danhSach = this.danhSach.filter(
            x => x.ma_mon_an !== item.ma_mon_an
          );

          this.showToast('Đã xoá khỏi yêu thích', 'success');
        },
        error: () => {
          this.showToast('Xoá yêu thích thất bại', 'error');
        }
      });
    }
  }

  addAllToCart() {
    const token = localStorage.getItem('token');
    const userId = Number(localStorage.getItem('ma_nguoi_dung'));

    if (!this.danhSach || this.danhSach.length === 0) return;

    // ===== GUEST =====
    if (!token) {
      this.danhSach.forEach(item => {
        this.cartService.addLocal({
          ...item,
          soLuong: 1,
          options: []
        });
        this.cartService.triggerRefresh();
      });

      this.yeuThichService.clearAllLocal();
      this.danhSach = [];

      this.showToast('Đã thêm tất cả vào giỏ hàng', 'success');

      setTimeout(() => {
        this.dialogRef.close();
      }, 1000);
      return;
    }

    // ===== USER (DB) =====
    const requests = this.danhSach.map(item => {
      const payload = {
        ma_mon_an: item.ma_mon_an,
        so_luong: 1,
        options: []
      };

      return this.cartService.addDB(payload);
    });

    Promise.all(requests.map(r => r.toPromise()))
      .then(() => {

        const userId = Number(localStorage.getItem('ma_nguoi_dung'));

        this.cartService.loadCountFromDB(userId);

        setTimeout(() => {
          this.cartService.triggerRefresh();
        }, 50);

        this.yeuThichService.clearAllDB().subscribe(() => {
          this.danhSach = [];

          this.yeuThichService.setCount(0);
          this.yeuThichService.setFavorites([]);

          this.showToast('Đã thêm tất cả vào giỏ hàng', 'success');
          setTimeout(() => {
            this.dialogRef.close();
          }, 1000);
        });

      })
      .catch(err => {
        console.error(err);
        this.showToast('Thêm vào giỏ hàng thất bại', 'error');
      });
  }

  get tongSoYeuThich(): number {
    return this.danhSach.length;
  }
  ngOnInit(): void {
    console.log('danhSach:', this.danhSach);
  }
}