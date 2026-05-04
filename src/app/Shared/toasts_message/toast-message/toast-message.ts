import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-toast-message',
  standalone: true,
  imports: [CommonModule, MatIconModule],
  templateUrl: './toast-message.html',
  styleUrls: ['./toast-message.scss']
})
export class ToastMessageComponent {
  @Input() message: string = '';
  @Input() type: 'success' | 'warn' | 'error' = 'success';
  @Input() show: boolean = false;

  get icon() {
    switch (this.type) {
      case 'success': return 'check_circle';
      case 'warn': return 'warning';
      case 'error': return 'error';
      default: return 'info';
    }
  }

  get bgColor() {
    switch (this.type) {
      case 'success': return 'bg-green-500';
      case 'warn': return 'bg-yellow-500';
      case 'error': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  }

  close() {
    this.show = false;
  }
}
