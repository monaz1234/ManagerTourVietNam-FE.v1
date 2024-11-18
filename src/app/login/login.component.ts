import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Account } from '../../interface/account.interface';
import { AccountService } from '../../service/account/account.service';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {

  imagePath01: string = '../../assets/images/leaf_01.png';

  // Thuộc tính cho form
  username: string = '';
  password: string = '';
  errorMessage: string = '';
  accounts : Account[] = [];

  constructor(
    private router: Router,
    private accountService: AccountService
  ) {}


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

    // Xử lý đăng nhập (ở đây bạn có thể thêm logic gọi API để kiểm tra thông tin đăng nhập)
    if (this.username === 'admin' && this.password === 'password123') {
      this.errorMessage = '';
      localStorage.setItem('username', this.username); // Lưu tên đăng nhập vào LocalStorage
      // Chuyển hướng đến trang chính sau khi đăng nhập thành công
      this.router.navigate(['/customer']);
    } else {
      this.errorMessage = 'Thông tin đăng nhập không chính xác.';

    }


  }
}
}
