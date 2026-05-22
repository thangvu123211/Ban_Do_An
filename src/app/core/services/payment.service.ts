import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment.prod';

@Injectable({
  providedIn: 'root'
})
export class PaymentService {


  constructor(private http: HttpClient) {}

  /**
   * 🔥 Gọi backend để tạo form SePay
   * Backend trả về HTML (form auto-submit)
   */
  createSePayPayment(payload: {
    amount: number;
    invoice_number: string;
    description: string;
    success_url?: string;
    error_url?: string;
    cancel_url?: string;
  }): Observable<string> {

    return this.http.post(
      `${environment.apiUrl}/payment/create`,
      payload,
      {
        responseType: 'text' // 👈 BẮT BUỘC
      }
    );
  }

  /**
   * 🚀 Redirect HTML form sang SePay
   */
  redirectToSePay(html: string) {
    const win = window.open('', '_self');
    if (!win) {
      console.error('Không thể mở cửa sổ thanh toán');
      return;
    }

    win.document.open();
    win.document.write(html);
    win.document.close();
  }
}