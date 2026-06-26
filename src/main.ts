import 'zone.js';
import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { App } from './app/app';

console.log('🔥 Angular đang khởi động... Splash screen sẽ hiển thị');

bootstrapApplication(App, appConfig)
  .then(() => {
    const splash = document.getElementById('splash-screen');
    if (splash) {
      splash.classList.add('opacity-0');
      setTimeout(() => {
        splash.remove();
      }, 500);
    } else {
    }
  })
  .catch((err) => console.error('❌ Lỗi khi bootstrap Angular:', err));
