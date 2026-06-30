import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MATERIAL } from '../../../Shared/material';
import { YeuThichService } from '../../../core/services/YeuThich.service';

@Component({
  selector: 'app-yeu-thich',
  imports: [MATERIAL],
  templateUrl: './yeu-thich.html',
})
export class YeuThich implements OnInit {

  danhSach: any[] = [];


  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any[],
    private dialogRef: MatDialogRef<YeuThich>,
     private yeuThichService: YeuThichService
  ) {
    const uniqueMap = new Map();

    (data || []).forEach(item => {
      uniqueMap.set(item.ma_mon_an, item);
    });

    this.danhSach = Array.from(uniqueMap.values());
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
    } else {
      // User → xoá DB
      this.yeuThichService.removeDB(item.ma_mon_an).subscribe({
        next: () => {
          this.danhSach = this.danhSach.filter(
            x => x.ma_mon_an !== item.ma_mon_an
          );
        },
        error: () => {
          console.error('Xoá yêu thích thất bại');
        }
      });
    }
  }

  get tongSoYeuThich(): number {
    return this.danhSach.length;
  }
  ngOnInit(): void {
    console.log('danhSach:', this.danhSach);
  }
}