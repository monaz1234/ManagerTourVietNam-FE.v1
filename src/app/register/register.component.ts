import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { User } from '../../interface/user.interface';
import { ManagerUserService } from '../../service/manager-user.service';
import { Account } from '../../interface/account.interface';
import { AccountService } from '../../service/account/account.service';
@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss'
})
export class RegisterComponent {
  registerForm: FormGroup;
  users: User[] = [];
  accounts: Account[] = [];
  newUserId: string = '';
  newAccountid: string = '';
  newUser: any = {
    iduser: '',
    name: '',
    birth: '',
    email: '',
    phone: '',
    points: 0,  // Giá trị mặc định cho điểm
    salary: 0,  // Giá trị mặc định cho lương
    reward: 0,  // Giá trị mặc định cho thưởng
    status: 1, // Gán trạng thái mặc định
    typeUser: {
      idtypeuser: '',
      name_type: '',
      status: 1,
      salary: 0
    }
  };
  newAccount: any = {
    idaccount: '',
    username: '',
    password: '',
    status: 1,
    image: '',
    typeUser: {
      idtypeuser: '',
      name_type: '',
      status: 1,
      salary: 0
    },
    user: {
      iduser: '',
      name: '',
      birth: '',
      email: '',
      phone: '',
      points: 0,
      salary: 0,
      reward: 0,
      status: 1,
      typeUser: {
        idtypeuser: '',
        name_type: '',
        status: 1,
        salary: 0
      }
    }
  };
  constructor(
    private fb: FormBuilder,
    private accountService: AccountService,
    private managerUserService: ManagerUserService
  ) {
    this.registerForm = this.fb.group(
      {
        username: ['', [Validators.required]],
        password: ['', [Validators.required, Validators.minLength(6)]],
        confirmPassword: ['', Validators.required]
      },
      { validator: this.passwordMatchValidator }
    );
  }

  loadData() {
    this.accountService.account$.subscribe((data: Account[]) => {
      this.accounts = data;
    });
    this.managerUserService.users$.subscribe((data: User[]) => {
      this.users = data;
    });
  }
  passwordMatchValidator(form: FormGroup) {
    const password = form.get('password')?.value;
    const confirmPassword = form.get('confirmPassword')?.value;

    if (password !== confirmPassword) {
      form.get('confirmPassword')?.setErrors({ passwordMismatch: true });
    } else {
      form.get('confirmPassword')?.setErrors(null);
    }
    return null;
  }
  //tao id user moi
  generateNewUserId() {

    // Tạo một mảng chứa tất cả các iduser hiện tại
    const existingIds = this.users.map(user => parseInt(user.iduser.slice(1))); // Lấy phần số của iduser
    const userCount = this.users.length + 1; // Số lượng người dùng hiện tại + 1

    // Tìm số iduser nhỏ nhất bị thiếu
    for (let i = 1; i <= userCount; i++) {
      if (!existingIds.includes(i)) {
        this.newUserId = `U${i.toString().padStart(3, '0')}`; // Định dạng Y00X
        return; // Trả về ngay khi tìm thấy số thiếu
      }
    }

    if (userCount < 10) {
      this.newUserId = `U00${userCount}`;  // Định dạng Y00X nếu nhỏ hơn 10
    } else if (userCount < 100) {
      this.newUserId = `U0${userCount}`;   // Định dạng Y0XX nếu nhỏ hơn 100
    } else if (userCount < 1000) {
      this.newUserId = `U${userCount}`;    // Định dạng YXXX nếu nhỏ hơn 1000
    } else {
      console.error("Số lượng người dùng vượt quá giới hạn 999");
    }
  }

  generateNewAccountId() {

    // Tạo một mảng chứa tất cả các iduser hiện tại
    const existingIds = this.accounts.map(account => parseInt(account.idaccount.slice(1))); // Lấy phần số của iduser
    const accountCount = this.accounts.length + 1; // Số lượng người dùng hiện tại + 1

    // Tìm số iduser nhỏ nhất bị thiếu
    for (let i = 1; i <= accountCount; i++) {
      if (!existingIds.includes(i)) {
        this.newAccountid = `A${i.toString().padStart(3, '0')}`; // Định dạng Y00X
        return; // Trả về ngay khi tìm thấy số thiếu
      }
    }

    if (accountCount < 10) {
      this.newAccountid = `A00${accountCount}`;  // Định dạng Y00X nếu nhỏ hơn 10
    } else if (accountCount < 100) {
      this.newAccountid = `A0${accountCount}`;   // Định dạng Y0XX nếu nhỏ hơn 100
    } else if (accountCount < 1000) {
      this.newAccountid = `A${accountCount}`;    // Định dạng YXXX nếu nhỏ hơn 1000
    } else {
      console.error("Số lượng người dùng vượt quá giới hạn 999");
    }
  }
  createNewuser(){
    this.newUser = {
      iduser: this.newUserId,
      name: '',
      birth: '',
      email: '',
      phone: '',
      points: 0,
      salary: 0,
      reward: 0,
      status: 1,
      typeUser: {
        idtypeuser: 'T003',
        name_type: 'khach hang',
        status: 1,
        salary: 0
      }
    };
    console.log("New user:", this.newUser);

    // this.managerUserService.addUser(newUser);
    this.managerUserService.addUser(this.newUser).subscribe({
      next: (data) => {
        console.log('Thêm người dùng thành công:', data);
        this.createNewAccount();
      },
      error: (error) => {
        console.error('Lỗi khi thêm người dùng:', error);
      }
    });
  }
  createNewAccount(){

    this.newAccount = {
      idaccount: this.newAccountid,
      username: this.registerForm.value.username,
      password: this.registerForm.value.password,
      status: 1,
      image: '',
      typeUser: {
        idtypeuser: 'T003',
        name_type: 'khach hang',
        status: 1,
        salary: 0
      },
      user: {
        iduser: this.newUserId,
        name: '',
        birth: '',
        email: '',
        phone: '',
        points: 0,
        salary: 0,
        reward: 0,
        status: 1,
        typeUser: {
          idtypeuser: 'T003',
          name_type: 'khach hang',
          status: 1,
          salary: 0
        }
      }
    };
    this.accountService.addAccount(this.newAccount).subscribe({
      next: (data) => {
        console.log('Thêm tài khoản thành công:', data);
        window.location.href = '/login';
      },
      error: (error) => {
        console.error('Lỗi khi thêm tài khoản:', error);
      }
    });
  }
  onSubmit() {
    if (this.registerForm.valid) {
      console.log("Form đăng ký thành công", this.registerForm.value);
      // Xử lý đăng ký ở đây
      this.loadData();
      this.generateNewUserId();
      this.generateNewAccountId();
      // console.log("Data account:", this.accounts);
      // console.log("Data user:", this.users);
      // console.log("New user id:", this.newUserId);
      // console.log("New account id:", this.newAccountid);
      this.createNewuser();
      // Navigate to login page after successful registration
      // window.location.href = '/';



    }
  }
}
