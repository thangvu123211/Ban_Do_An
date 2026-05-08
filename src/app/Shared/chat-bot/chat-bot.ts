import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MATERIAL } from '../material';
import { AIChatResponse, AiChatService } from '../../core/services/AIServiceChat';
import { CartService } from '../../core/services/cart.service';
import { ToastMessageComponent } from '../toasts_message/toast-message/toast-message';

@Component({
  selector: 'app-chat-bot',
  standalone: true,
  imports: [MATERIAL,ToastMessageComponent],
  templateUrl: './chat-bot.html'
})
export class ChatBotComponent {

  input = '';
  isTyping = false; // 👈 bot đang gõ


  toast = {
    show: false,
    message: '',
    type: 'success' as 'success' | 'warn' | 'error'
  };

  messages: any[] = [
    {
      from: 'bot',
      type: 'text',
      message: 'Nhà hàng xin chào 👋'
    }
  ];

  constructor(
    private dialogRef: MatDialogRef<ChatBotComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private aiChatService: AiChatService,
    private cartService: CartService
  ) {}

  showToast(message: string, type: 'success' | 'warn' | 'error') {
    this.toast.show = true;
    this.toast.message = message;
    this.toast.type = type;
    setTimeout(() => (this.toast.show = false), 3000);
  }

  close() {
    this.dialogRef.close();
  }

send() {
  if (!this.input.trim()) return;

  const userText = this.input;

  // USER MESSAGE
  this.messages.push({
    from: 'user',
    type: 'text',
    message: userText
  });

  this.input = '';

  // BOT ĐANG GÕ
  this.isTyping = true;

  this.aiChatService.chat('user-1', userText).subscribe({
    next: (res) => {

      // 👇 FAKE BOT ĐANG GÕ NHƯ MESS
      setTimeout(() => {
        this.isTyping = false;

        this.messages.push({
          from: 'bot',
          ...res
        });
      }, 1200); // 👈 chỉnh 800 – 1500ms
    },
    error: () => {
      setTimeout(() => {
        this.isTyping = false;
        this.messages.push({
          from: 'bot',
          type: 'text',
          message: '⚠️ Hệ thống đang bận'
        });
      }, 800);
    }
  });
}

  addToGioHang(mon: any): void {
    this.cartService.addItem({
      id: mon.ma_mon_an,
      ma_mon_an: mon.ma_mon_an,
      ten_mon_an: mon.ten_mon_an,
      gia_tien: mon.gia_tien,
      anh_mon_an: mon.anh_mon_an
    });
     this.showToast(`Thêm thành công món ${mon.ten_mon_an} vào giỏ hàng`, 'success');
  }
}