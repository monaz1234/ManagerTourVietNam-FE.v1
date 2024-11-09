import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {
  // Thuộc tính cho form
  username: string = '';
  password: string = '';
  errorMessage: string = '';

  constructor(private router: Router) {}

  // Phương thức xử lý đăng nhập
  login(): void {
    // Kiểm tra dữ liệu nhập vào (ví dụ, username và password không được để trống)
    if (this.username === '' || this.password === '') {
      this.errorMessage = 'Vui lòng nhập tên đăng nhập và mật khẩu.';
      return;
    }

    // Xử lý đăng nhập (ở đây bạn có thể thêm logic gọi API để kiểm tra thông tin đăng nhập)
    if (this.username === 'admin' && this.password === 'password123') {
      this.errorMessage = '';
      // Chuyển hướng đến trang chính sau khi đăng nhập thành công
      this.router.navigate(['/admin']);
    } else {
      this.errorMessage = 'Thông tin đăng nhập không chính xác.';
    }
  }
}
