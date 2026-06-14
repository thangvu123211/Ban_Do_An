import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class SidebarService {

  private mobileOpen = new BehaviorSubject<boolean>(false);
  mobileOpen$ = this.mobileOpen.asObservable();

  toggleMobile() {
    this.mobileOpen.next(!this.mobileOpen.value);
  }

  openMobile() {
    this.mobileOpen.next(true);
  }

  closeMobile() {
    this.mobileOpen.next(false);
  }
}