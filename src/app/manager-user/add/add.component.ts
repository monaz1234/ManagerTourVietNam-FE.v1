
import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';
import { ManagerUserService } from '../../../service/manager-user.service';

@Component({
  selector: 'app-add',
  templateUrl: './add.component.html',
  styleUrl: './add.component.scss'
})
export class AddComponent {

  isEditUserVisible = true;
  closeForm() {
    this.isEditUserVisible = false; // Set to false to hide the form
  }

  @Input() generatedIdUser: string = ''; // Nhận giá trị iduser từ component cha
  newUser: any = {
    iduser: '',
    name: '',
    birth: '',
    email: '',
    phone: '',
    points: 0,  // Giá trị mặc định cho điểm
    salary: 0,  // Giá trị mặc định cho lương
    reward: 0,  // Giá trị mặc định cho thưởng
    status: true // Gán trạng thái mặc định
  };
  errorMessages: string[] = [];



  formFields = [
    { name: 'iduser', label: 'Id thông tin người dùng', type: 'text', required: true,  },
    { name: 'name', label: 'Tên người dùng', type: 'text', required: false },
    { name: 'birth', label: 'Ngày sinh người dùng', type: 'date', required: false },
    { name: 'email', label: 'Email người dùng', type: 'text', required: false },
    { name: 'phone', label: 'Phone người dùng', type: 'text', required: false },
    { name: 'points', label: 'Điểm của người dùng', type: 'text', required: false },
    // Thêm trường select để chọn lương dựa trên chức vụ
    // { name: 'salary', label: 'Lương của người dùng', type: 'select', required: false,
    //   options: [
    //     { value: '1000', label: 'Nhân viên' },
    //     { value: '2000', label: 'Quản lý' },
    //     { value: '3000', label: 'Giám đốc' }
    //   ]
    // },
    { name: 'salary', label: 'Lương của người dùng', type: 'text', required: false },
    { name: 'reward', label: 'Thưởng của người dùng', type: 'text', required: false },
    // { name: 'status', label: 'Trạng thái của người dùng', type: 'text', required: false }
  ];


  constructor(private userService: ManagerUserService, private router: Router) {}

  ngOnInit(): void {
    this.newUser.iduser = this.generatedIdUser; // Gán iduser từ cha vào form
  }

  resetForm() {
    this.newUser = {
      iduser: this.generatedIdUser, // Gán ID mới từ component cha
      name: '',
      birth: '',
      email: '',
      phone: '',
      points: 0,
      salary: 0,
      reward: 0,
      status: true
    };
    this.errorMessages = []; // Reset thông báo lỗi
  }



  onSubmit() {

    this.errorMessages = []; // Reset thông báo lỗi mỗi khi submit

    // Xác thực email
    const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailPattern.test(this.newUser.email)) {
      this.errorMessages.push('Email không hợp lệ!');
    }

    // Xác thực số điện thoại
    const phonePattern = /^\d{10}$/;
    if (!phonePattern.test(this.newUser.phone)) {
      this.errorMessages.push('Số điện thoại không hợp lệ!');
    }

    // Kiểm tra các trường không âm
    if (this.newUser.points < 0) {
      this.errorMessages.push('Điểm không được âm!');
    }
    if (this.newUser.salary < 0) {
      this.errorMessages.push('Lương không được âm!');
    }
    if (this.newUser.reward < 0) {
      this.errorMessages.push('Thưởng không được âm!');
    }

    if (!this.newUser.birth) {
      this.errorMessages.push('Ngày sinh không được để trống!');
    } else {
      // Kiểm tra ngày sinh không được dưới 18 tuổi
      const birthDate = new Date(this.newUser.birth);
      const today = new Date();
      let age = today.getFullYear() - birthDate.getFullYear(); // Đổi từ const thành let
      const monthDifference = today.getMonth() - birthDate.getMonth();
      if (monthDifference < 0 || (monthDifference === 0 && today.getDate() < birthDate.getDate())) {
        age--;
      }


      if (age < 18) {
        this.errorMessages.push('Người dùng phải từ 18 tuổi trở lên!');
      }
    }
    // Nếu có lỗi, ngừng quá trình submit
    if (this.errorMessages.length > 0) {
      return;
    }


    this.newUser.status = true;
    // console.log('Dữ liệu người dùng:', this.newUser); // In ra dữ liệu trước khi gửi

  // Đảm bảo rằng newUser có đầy đủ thông tin cần thiết
  this.newUser = {
    iduser: this.newUser.iduser,  // Chuyển đổi nếu cần
    name: this.newUser.name,
    birth: this.newUser.birth,
    email: this.newUser.email,
    phone: this.newUser.phone,
    points: this.newUser.points,
    salary: this.newUser.salary,
    reward: this.newUser.reward,
    status: true,
  };




  this.userService.addUser(this.newUser).subscribe({
    next: (response) => {

      this.resetForm();
      this.closeForm(); // Call a method to close the form
      this.router.navigate(['/gioithieu/add']);

    },
    error: (error) => {
      console.error('Lỗi khi thêm người dùng:', error);
    }
  });





  }

}
