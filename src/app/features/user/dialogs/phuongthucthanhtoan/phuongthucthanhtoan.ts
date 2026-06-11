import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, Inject, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { environment } from '../../../../../environments/environment.prod';

@Component({
  selector: 'app-phuongthucthanhtoan',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatButtonModule, MatIconModule],
  templateUrl: './phuongthucthanhtoan.html',
  styleUrls: ['./phuongthucthanhtoan.scss']
})
export class Phuongthucthanhtoan implements OnInit {
  isLoading = false;
  paymentUrl: SafeResourceUrl | null = null; // ✅ iframe sẽ dùng biến này

  constructor(
    private http: HttpClient,
    private sanitizer: DomSanitizer,
    public dialogRef: MatDialogRef<Phuongthucthanhtoan>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) { }

  ngOnInit(): void { }

  closeDialog() {
    this.dialogRef.close();
  }

  /** ✅ Thanh toán VNPay (Chuyển khoản) */
  /** ✅ Thanh toán VNPay (Chuyển khoản) */
  thanhToanVNPay() {
    this.isLoading = true;

    const payload = {
      MA_HD: this.data.MA_HD,
      TONGTIEN: this.data.TONGTIEN
    };

    this.http.post<any>(
      `${environment.apiUrl}${environment.payment.vnPayCreateQr}`,
      payload
    )
      .subscribe({
        next: (res) => {
          console.log("VNPay response:", res);
          this.isLoading = false;

          const url = typeof res === 'string' ? res : res?.paymentUrl;

          if (url) {
            // 🚀 Chuyển sang trang thanh toán VNPay
            window.location.href = url;
          } else {
            alert("Không nhận được link thanh toán từ server!");
          }
        },
        error: (err) => {
          console.error("Lỗi tạo QR VNPay:", err);
          this.isLoading = false;
          alert("Không thể tạo mã QR thanh toán!");
        }
      });
  }


}
