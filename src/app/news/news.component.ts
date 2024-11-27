import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';

@Component({
  selector: 'app-news',
  templateUrl: './news.component.html',
  styleUrl: './news.component.scss'
})
export class NewsComponent {
  username: string | null = null; // Biến để lưu tên tài khoản

  constructor(
    private route: ActivatedRoute,
    private router: Router,

  ) {
    this.username = localStorage.getItem('username'); // Lấy tên tài khoản từ LocalStorage
  }
  logout(): void {
    localStorage.removeItem('username'); // Xóa tên tài khoản khi đăng xuất
    this.username = null;
    this.router.navigate(['/']); // Điều hướng về trang chủ hoặc trang đăng nhập
  }
  navigateToMessenger(): void {
    window.location.href = 'https://www.facebook.com/messages/t/100022817763633'; // Thay 'yourpage' bằng đường dẫn Messenger của bạn
  }
}
