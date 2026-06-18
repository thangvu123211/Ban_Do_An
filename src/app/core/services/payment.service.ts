import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment.prod';

@Injectable({
  providedIn: 'root'
})
export class PaymentService {

  constructor(private http: HttpClient) {}

  createSePayPayment(payload: any): Observable<string> {

    const body = {
      amount: Math.round(Number(payload.amount || 0)),
      invoice_number: payload.invoice_number || '',
      description: payload.description || '',
      success_url: payload.success_url || '',
      error_url: payload.error_url || '',
      cancel_url: payload.cancel_url || ''
    };

    console.log('🔥 SEPAY REQUEST:', body);

    return this.http.post(
      `${environment.apiUrl}/payment/create`,
      body,
      { responseType: 'text' }   // 👈 QUAN TRỌNG
    );
  }
  
}