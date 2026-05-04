import { Component, Inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@Component({
  selector: 'app-chonban-dialog',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatButtonModule, MatProgressSpinnerModule],
  templateUrl: './chonban-dialog.html',
  styleUrls: ['./chonban-dialog.scss']
})
export class ChonbanDialog implements OnInit {
  BanAn: any[] = [];
  isLoading = true;
  selectedTableId: number | null = null;

  constructor(
    private http: HttpClient,
    public dialogRef: MatDialogRef<ChonbanDialog>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  ngOnInit() {
    this.loadBanAn();
  }

  /** Gọi API lấy danh sách bàn ăn */
  loadBanAn() {
    this.http.get<any>('http://localhost:3000/api/user/thucdon/danh_sach_ban_an').subscribe({
      next: (res) => {
        this.BanAn = res.BanAn;
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Lỗi lấy danh sách bàn:', err);
        this.isLoading = false;
      }
    });
  }

  /** Chọn bàn */
  selectTable(id: number) {
    this.selectedTableId = id;
  }

  /** Xác nhận chọn bàn */
  confirmSelection() {
    if (this.selectedTableId != null) {
      const selectedTable = this.BanAn.find(b => b.MA_BAN === this.selectedTableId);
      this.dialogRef.close(selectedTable);
    }
  }

  /** Hủy dialog */
  closeDialog() {
    this.dialogRef.close();
  }
}
