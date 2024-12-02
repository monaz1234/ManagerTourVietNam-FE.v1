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

  // sendTokenToBackend(token: string): void {
  //   // Gửi token lên API backend (cập nhật endpoint của bạn)
  //   this.http.post('http://localhost:9000/api/auth/google', { token })
  //     .subscribe({
  //       next: (response: any) => {
  //         console.log('Token verified successfully:', response);
  //         // Xử lý phản hồi từ backend (ví dụ, lưu thông tin người dùng và chuyển hướng)
  //         const name = response.name; // Lấy `name` từ phản hồi của backend
  //         localStorage.setItem('name', name); // Lưu `name` vào LocalStorage
  //         this.router.navigate(['/customer']); // Chuyển hướng
  //       },
  //       error: (error) => {
  //         console.error('Token verification failed:', error);
  //         this.errorMessage = 'Xác thực với Google thất bại.';
  //       }
  //     });
  // }

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

  login(): void {
    // Kiểm tra nếu username hoặc password bị bỏ trống
    if (!this.username || !this.password) {
      this.errorMessage = 'Vui lòng nhập tên đăng nhập và mật khẩu.';
      return;
    }

    // Gọi service đăng nhập với username và password
    this.accountService.login(this.username, this.password).subscribe({
      next: (account: any) => {
        if (account) {
          // Kiểm tra quyền của tài khoản
          console.log('Thông tin đăng nhập là:', this.username, this.password);

          // Lưu idaccount vào localStorage để sử dụng cho các yêu cầu khác
          localStorage.setItem('idaccount', account.idaccount);

          // Chuyển hướng theo loại tài khoản
          switch (account.typeUser?.idtypeuser) {
            case 'T001': // Quản trị viên
              localStorage.setItem('username', this.username);
              this.router.navigate(['/admin']);
              break;
            case 'T002': // Người dùng thông thường
              localStorage.setItem('username', this.username);
              this.router.navigate(['/admin']);
              break;
            case 'T003': // Người dùng khác
              const username = account.username || account.name; // Sử dụng username hoặc name
              localStorage.setItem('username', username); // Lưu vào localStorage
              this.router.navigate(['/customer']); // Chuyển hướng
              break;
            default:
              this.errorMessage = 'Loại tài khoản không hợp lệ.';
          }
        } else {
          this.errorMessage = 'Thông tin đăng nhập không chính xác.';
        }
      },
      error: (err) => {
        this.errorMessage = 'Đã xảy ra lỗi trong quá trình đăng nhập. Vui lòng thử lại.';
        console.error(err);
      }
    });
  }


  loadData() {
    this.accountService.account$.subscribe((data: Account[]) => {
      this.accounts = data; // Cập nhật danh sách người dùng
    });
  }
}
