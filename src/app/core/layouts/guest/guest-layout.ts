import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from '../../../core/layouts/guest/header/header';
import { Footer } from '../../../core/layouts/guest/footer/footer';
import { MATERIAL } from '../../../Shared/material';
import { ChatBotComponent } from '../../../Shared/chat-bot/chat-bot';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
@Component({
  selector: 'app-guest-layout',
  imports: [HeaderComponent, Footer, RouterOutlet, MATERIAL],
  templateUrl: './guest-layout.html',
  styleUrl: './guest-layout.scss'
})
export class GuestLayout {
   constructor(
    private dialog: MatDialog,

  ) {
  }
  openChatBot() {
    this.dialog.open(ChatBotComponent, {
      width: '380px',
      height: '600px',
      position: {
        bottom: '20px',
        right: '20px'
      },
      panelClass: 'chat-bot-dialog'
    });
  }
}
