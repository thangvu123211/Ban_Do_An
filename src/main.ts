import 'zone.js';
import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { App } from './app/app';

console.log('🔥 Angular đang khởi động... Splash screen sẽ hiển thị');

bootstrapApplication(App, appConfig)
  .then(() => {
    console.log('✅ Angular khởi động xong, ẩn splash screen');
    const splash = document.getElementById('splash-screen');
    if (splash) {
      splash.classList.add('opacity-0');
      setTimeout(() => {
        splash.remove();
        console.log('🧹 Splash screen đã bị gỡ khỏi DOM');
      }, 500);
    } else {
      console.warn('⚠️ Không tìm thấy #splash-screen trong DOM');
    }
  })
  .catch((err) => console.error('❌ Lỗi khi bootstrap Angular:', err));
