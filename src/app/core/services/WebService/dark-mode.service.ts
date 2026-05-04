import { Injectable, signal, effect } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class DarkModeService {
  private isBrowser = typeof window !== 'undefined';
  darkMode = signal(false);

  constructor() {
    if (this.isBrowser) {
      const saved = localStorage.getItem('darkMode');
      this.darkMode.set(saved === 'true');
    }

    effect(() => {
      const value = this.darkMode();
      if (this.isBrowser) {
        document.documentElement.classList.toggle('dark', value);
        localStorage.setItem('darkMode', String(value));
      }
    });
  }

  isDark() {
    return this.darkMode();
  }

  setDark(value: boolean) {
    this.darkMode.set(value);
  }

  toggle() {
    this.darkMode.set(!this.darkMode());
  }
}
