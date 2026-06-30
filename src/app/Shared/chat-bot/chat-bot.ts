import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MATERIAL } from '../material';
import { ToastMessageComponent } from '../toasts_message/toast-message/toast-message';
import { AIChatService } from '../../core/services/AIServiceChat';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-chat-bot',
  standalone: true,
  imports: [MATERIAL, ToastMessageComponent, FormsModule, CommonModule],
  templateUrl: './chat-bot.html'
})
export class ChatBotComponent implements OnInit {

  input = '';
  isTyping = false;

  threadId: string | null = null; // 🔥 IMPORTANT

  toast = {
    show: false,
    message: '',
    type: 'success' as 'success' | 'warn' | 'error'
  };

  messages: any[] = [
    {
      from: 'bot',
      type: 'text',
      message: 'Xin chào! Bạn cần mình hỗ trợ gì hôm nay?'
    }
  ];

  constructor(
    private dialogRef: MatDialogRef<ChatBotComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private aiChatService: AIChatService,
  ) {}

  ngOnInit() {
    // 🔥 reset mỗi lần mở chat
    this.threadId = null;
    this.messages = [
      {
        from: 'bot',
        type: 'text',
        message: 'Xin chào! Bạn cần mình hỗ trợ gì hôm nay?'
      }
    ];
  }

  showToast(message: string, type: 'success' | 'warn' | 'error') {
    this.toast.show = true;
    this.toast.message = message;
    this.toast.type = type;
    setTimeout(() => (this.toast.show = false), 3000);
  }

  close() {
    // 🔥 reset khi đóng
    this.threadId = null;
    this.dialogRef.close();
  }

  send() {
    if (!this.input.trim()) return;

    const userText = this.input;

    // add user message
    this.messages.push({
      from: 'user',
      type: 'text',
      message: userText
    });

    this.input = '';
    this.isTyping = true;

    // 🔥 gửi threadId hiện tại (null nếu mới)
    this.aiChatService.chat(this.threadId, userText).subscribe({
      next: (res) => {

        // 🔥 lưu threadId từ backend
        this.threadId = res.threadId;

        setTimeout(() => {
          this.isTyping = false;

          this.messages.push({
            from: 'bot',
            type: 'text',
            message: res.assistantMessage.replace(/\n/g, '<br>')
          });
        }, 800);
      },

      error: () => {
        this.isTyping = false;
        this.messages.push({
          from: 'bot',
          type: 'text',
          message: '⚠️ Hệ thống đang bận, thử lại sau'
        });
      }
    });
  }
}