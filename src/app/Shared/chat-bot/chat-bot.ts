import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MATERIAL } from '../material';
import { CartService } from '../../core/services/cart.service';
import { ToastMessageComponent } from '../toasts_message/toast-message/toast-message';
import { AIChatService } from '../../core/services/AIServiceChat';

@Component({
  selector: 'app-chat-bot',
  standalone: true,
  imports: [MATERIAL, ToastMessageComponent],
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
    private aiChatService: AIChatService,
  ) { }

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
        setTimeout(() => {
          this.isTyping = false;
          //res.assistantMessage = "messages /n test /n test 2"

          this.messages.push({
            from: 'bot',
            type: 'text',
            message: res.assistantMessage.replaceAll(/\n/g, '</br>') // 👈 QUAN TRỌNG
          });
        }, 1200);
      },
      error: () => {
        this.isTyping = false;
        this.messages.push({
          from: 'bot',
          type: 'text',
          message: '⚠️ Hệ thống đang bận'
        });
      }
    });
  }

}