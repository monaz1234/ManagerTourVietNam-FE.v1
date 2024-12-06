import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Account } from '../../interface/account.interface';
import { AccountService } from '../../service/account/account.service';
import { HttpClient } from '@angular/common/http';

declare const google: any;

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  imagePath01: string = '../../assets/images/leaf_01.png';
  username: string = '';
  password: string = '';
  errorMessage: string = '';
  accounts: Account[] = [];
  user: any;

  constructor(
    private router: Router,
    private accountService: AccountService,
    private http: HttpClient // Thêm HttpClient vào constructor
  ) {}

  ngOnInit(): void {
    console.log(window.location.origin); // In ra origin hiện tại trong console

    // Initialize Google login
    google.accounts.id.initialize({
      client_id: '194956155091-rvbqge5cnpv1u0mdqimkssankmvpmuu5.apps.googleusercontent.com', // Thay bằng Client ID đúng
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
    const payload = JSON.parse(atob(token.split('.')[1])); // Decode token
    console.log('User Info:', payload);
    const name = payload.name; // Tên
    const email = payload.email; // Email
    console.log(`Name: ${name}, Email: ${email}`);
    this.sendTokenToBackend(token, email);
  }


  sendTokenToBackend(token: string, email: string | null): void {
    this.http.post('http://localhost:9000/api/auth/google', { token, email })
      .subscribe({
        next: (response: any) => {
          console.log('Token verified successfully:', response);

          // Lưu thông tin cần thiết
          const username = response.username || email; // Ưu tiên username, fallback là email
          localStorage.setItem('username', username);
          localStorage.setItem('idaccount', response.idaccount);

          // Điều hướng
          this.router.navigate(['/customer']);
        },
        error: (error) => {
          console.error('Token verification failed:', error);
          this.errorMessage = 'Xác thực với Google thất bại.';
        }
      });
  }

  startSessionTimeout(): void {
    const sessionDuration = 15 * 60 * 1000; // 30 phút (hoặc bất kỳ thời gian nào bạn muốn)
    setTimeout(() => {
      alert('Phiên làm việc của bạn đã hết. Vui lòng đăng nhập lại.');
      this.logout();
    }, sessionDuration);
  }

  logout(): void {
    // Xóa thông tin người dùng khỏi localStorage
    localStorage.removeItem('idaccount');
    localStorage.removeItem('username');

    // Điều hướng về trang đăng nhập
    this.router.navigate(['/login']);
  }

  login(): void {
    // Kiểm tra nếu username hoặc password bị bỏ trống
    if (!this.username || !this.password) {
      this.errorMessage = 'Vui lòng nhập tên đăng nhập và mật khẩu.';
      return;
    }

    // Gọi service đăng nhập với username và password
    this.accountService.login(this.username, this.password).subscribe({
      next: (response: any) => {
        if (response && response.account) {
          const account = response.account;
          console.log('Thông tin đăng nhập là:', this.username, this.password);

          console.log('Thông tin đăng nhập:', account);

          // Lưu idaccount và username vào localStorage
          localStorage.setItem('idaccount', account.idaccount);
          localStorage.setItem('username', account.username);

          // Kiểm tra loại người dùng (idTypeUser hoặc account.typeUser.idtypeuser)
          const idTypeUser = response.idTypeUser || account.typeUser?.idtypeuser;

          switch (idTypeUser) {
            case 'T001': // Quản trị viên
              this.router.navigate(['/admin']);
              break;

            case 'T002': // Người dùng thông thường
              this.router.navigate(['/admin']);
              break;

            case 'T003': // Khách hàng
              this.router.navigate(['/customer']);
              break;

            default:
              this.errorMessage = 'Loại tài khoản không hợp lệ.';
              break;
          }
        } else {
          this.errorMessage = 'Thông tin đăng nhập không chính xác.';
        }
      },
      error: (err) => {
        this.errorMessage = 'Đã xảy ra lỗi trong quá trình đăng nhập. Vui lòng thử lại.';
        console.error('Lỗi đăng nhập:', err);
      }
    });
  }



  loadData() {
    this.accountService.account$.subscribe((data: Account[]) => {
      this.accounts = data; // Cập nhật danh sách người dùng
    });
  }
}
