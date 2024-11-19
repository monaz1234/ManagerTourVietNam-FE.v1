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



  ngOnInit(): void {
    // Tải danh sách tài khoản ngay khi component được khởi tạo
    this.loadData();
  }


  loadData(): void {
    this.accountService.account$.subscribe((data: Account[]) => {
      this.accounts = data; // Cập nhật danh sách tài khoản
    });
  }

  // Xử lý đăng nhập
  login(): void {
    // Kiểm tra nếu username hoặc password bị bỏ trống
    if (!this.username || !this.password) {
      this.errorMessage = 'Vui lòng nhập tên đăng nhập và mật khẩu.';
      return;
    }

    // Gửi thông tin username và password đến server qua service
    this.accountService.login(this.username, this.password).subscribe({
      next: (account) => {
        if (account) {
          // Kiểm tra quyền của tài khoản
          console.log("Thông tin đăng nhập là :"  +this.username , this.password);
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
              localStorage.setItem('username', this.username);
              this.router.navigate(['/customer']);
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




}
