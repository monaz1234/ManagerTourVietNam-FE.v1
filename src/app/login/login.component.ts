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


  loadData() {
    this.accountService.account$.subscribe((data: Account[]) => {
      this.accounts = data; // Cập nhật danh sách người dùng

    });
  }

  login(): void {
    // Kiểm tra nếu username hoặc password bị bỏ trống
    if (!this.username || !this.password) {
      this.errorMessage = 'Vui lòng nhập tên đăng nhập và mật khẩu.';
      return;
    }
    const account = this.accounts.find(
      (acc) => acc.username === this.username && acc.password === this.password
    );
    // Kiểm tra đăng nhập admin
    if (account?.typeUser?.idtypeuser === "T001") {
      this.errorMessage = '';
      localStorage.setItem('username', this.username);
      this.router.navigate(['/admin']); // Điều hướng đến trang admin
    } else if (account?.typeUser?.idtypeuser === "T002") {
      this.errorMessage = 'Đăng nhập thành công!';
      localStorage.setItem('username', this.username);
      this.router.navigate(['/admin']); // Điều hướng đến trang customer
    } else (account?.typeUser?.idtypeuser === "T003")
      localStorage.setItem('username', this.username);
      this.router.navigate(['/customer']); // Điều hướng đến trang customer

  }





}
