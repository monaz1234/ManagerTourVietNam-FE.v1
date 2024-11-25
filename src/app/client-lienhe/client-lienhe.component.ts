import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';
import { AccountService } from '../../service/account/account.service';

@Component({
  selector: 'app-client-lienhe',
  templateUrl: './client-lienhe.component.html',
  styleUrl: './client-lienhe.component.scss'
})
export class ClientLienHeComponent implements OnInit{

  username: string | null = null; // Biến để lưu tên tài khoản
  Iduser: string | null = null; //

  constructor(
    private route: ActivatedRoute,
    private router: Router,

  ) {
    this.username = localStorage.getItem('username'); // Lấy tên tài khoản từ LocalStorage
  }
  ngOnInit(): void {

  }

  navigateToMessenger(): void {
    window.location.href = 'https://www.facebook.com/messages/t/100022817763633'; // Thay 'yourpage' bằng đường dẫn Messenger của bạn
  }

  logout(): void {
    localStorage.removeItem('username'); // Xóa tên tài khoản khi đăng xuất
    this.username = null;
    this.router.navigate(['/']); // Điều hướng về trang chủ hoặc trang đăng nhập
  }
}
