// idle.service.ts
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class IdleService {
  private timeout: any;
  private idleTime: number = 1 * 60 * 1000; // 5 phút (5 phút * 60 giây * 1000 ms)

  constructor(private router: Router) {
    this.resetTimer();
    this.startListening();
  }

  private startListening() {
    ['mousemove', 'keydown', 'click'].forEach(event => {
      window.addEventListener(event, () => this.resetTimer());
    });
  }

  private resetTimer() {
    clearTimeout(this.timeout);
    this.timeout = setTimeout(() => this.logout(), this.idleTime);
  }

  private logout() {
    // Xóa thông tin phiên đăng nhập
    localStorage.removeItem('userToken');
    this.router.navigate(['/login']); // Chuyển về trang đăng nhập
  }
}
