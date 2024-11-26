import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Account } from '../../interface/account.interface';
import { AccountService } from '../../service/account/account.service';
import { HttpClient } from '@angular/common/http';
declare const google: any;
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent implements OnInit {
  // Thuộc tính cho form
  username: string = '';
  password: string = '';
  errorMessage: string = '';
  accounts : Account[] = [];
  user:any;
  constructor(
    private router: Router,
    private accountService: AccountService,
    private http: HttpClient // Thêm HttpClient vào constructor
  ) {}

  ngOnInit(): void {
    google.accounts.id.initialize({
      client_id: '677635945499-0btdlbiqiic8av0ppbds98uupk7vhg6r.apps.googleusercontent.com', // Thay bằng Client ID
      callback: this.handleCredentialResponse.bind(this),

    });
    google.accounts.id.renderButton(
      document.getElementById('googleSignInDiv')!,
      { theme: 'outline', size: 'large' }
    );
  }
  handleCredentialResponse(response: any): void {
    const token = response.credential; // Lấy token từ Google
    console.log('Token:', token);

    this.sendTokenToBackend(token);
  }
  sendTokenToBackend(token: string): void {
    // Gửi token lên API backend (cập nhật endpoint của bạn)
    this.http.post('http://localhost:9000/api/auth/google', { token })
      .subscribe({
        next: (response) => {
          console.log('Token verified successfully:', response);
          // Xử lý phản hồi từ backend (ví dụ, lưu thông tin người dùng và chuyển hướng)
          this.router.navigate(['/admin']); // Chuyển hướng khi xác thực thành công
        },
        error: (error) => {
          console.error('Token verification failed:', error);
          this.errorMessage = 'Xác thực với Google thất bại.';
        }
      });
  }
  loadData() {
    this.accountService.account$.subscribe((data: Account[]) => {
      this.accounts = data; // Cập nhật danh sách người dùng

    });
  }
  // Phương thức xử lý đăng nhập
  login(): void {
    this.loadData();
    console.log("Data account:",this.accounts);
    // Kiểm tra dữ liệu nhập vào (ví dụ, username và password không được để trống)
    if (this.username === '' || this.password === '') {
      this.errorMessage = 'Vui lòng nhập tên đăng nhập và mật khẩu.';
      return;
    }
    else{
      // Xử lý đăng nhập (ở đây bạn có thể thêm logic gọi API để kiểm tra thông tin đăng nhập)
      if (this.username === 'admin' && this.password === 'password123') {
        this.errorMessage = '';
        // Chuyển hướng đến trang chính sau khi đăng nhập thành công
        this.router.navigate(['/admin']);
      } else {
          // Duyệt qua danh sách tài khoản để kiểm tra thông tin đăng nhập
          let isValidAccount = false;
          this.accounts.forEach((account) => {
            if (account.username === this.username && account.password === this.password) {
              isValidAccount = true;
              this.errorMessage = 'Đăng nhập thành công!';
              return;
            }
          });

          // Nếu không tìm thấy tài khoản hợp lệ
          if (!isValidAccount) {
            this.errorMessage = 'Thông tin đăng nhập không chính xác.';
          }
      }
    }


  }
}
