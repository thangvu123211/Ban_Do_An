import { DatePipe } from '@angular/common';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class MoneyFormatService {

  formatVND(value: any): string {
    if (!value) return '';
    return value.toString()
      .replace(/\D/g, '')
      .replace(/\B(?=(\d{3})+(?!\d))/g, '.') ;
  }

  rawNumber(value: string): number {
    return Number(value.replace(/\D/g, ''));
  }

}
