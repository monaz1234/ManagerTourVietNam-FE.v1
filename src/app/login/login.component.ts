import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Account } from '../../interface/account.interface';
import { AccountService } from '../../service/account/account.service';
import { HttpClient } from '@angular/common/http';

declare const google: any;

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'] // Sửa từ styleUrl thành styleUrls
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
    private http: HttpClient
  ) {}

  ngOnInit(): void {
    const googleSignInDiv = document.getElementById('googleSignInDiv');
    if (googleSignInDiv) {
      google.accounts.id.initialize({
        client_id: 'YOUR_GOOGLE_CLIENT_ID', // Thay bằng Client ID
        callback: this.handleCredentialResponse.bind(this),
      });
      google.accounts.id.renderButton(googleSignInDiv, {
        theme: 'outline',
        size: 'large',
      });
    } else {
      console.error('Div element for Google Sign-In button not found');
    }
  }

  handleCredentialResponse(response: any): void {
    const token = response.credential;
    console.log('Token:', token);
    this.sendTokenToBackend(token);
  }

  sendTokenToBackend(token: string): void {
    this.http.post('http://localhost:9000/api/auth/google', { token }).subscribe({
      next: (response) => {
        console.log('Token verified successfully:', response);
        this.router.navigate(['/customer']);
      },
      error: (error) => {
        console.error('Token verification failed:', error);
        this.errorMessage = 'Xác thực với Google thất bại.';
      },
    });
  }

  login(): void {
    if (!this.username || !this.password) {
      this.errorMessage = 'Vui lòng nhập tên đăng nhập và mật khẩu.';
      return;
    }

    this.accountService.login(this.username, this.password).subscribe({
      next: (account) => {
        if (account) {
          this.handleLoginSuccess(account);
        } else {
          this.errorMessage = 'Thông tin đăng nhập không chính xác.';
        }
      },
      error: (err) => {
        this.errorMessage = 'Đã xảy ra lỗi trong quá trình đăng nhập. Vui lòng thử lại.';
        console.error(err);
      },
    });
  }

  private handleLoginSuccess(account: Account): void {
    localStorage.setItem('username', this.username);

    switch (account.typeUser?.idtypeuser) {
      case 'T001':
      case 'T002':
        this.router.navigate(['/admin']);
        break;
      case 'T003':
        this.router.navigate(['/customer']);
        break;
      default:
        this.errorMessage = 'Loại tài khoản không hợp lệ.';
    }
  }

  loadData(): void {
    this.accountService.account$.subscribe((data: Account[]) => {
      this.accounts = data;
    });
  }
}
