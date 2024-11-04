import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';
import { ManagerUserService } from '../../../service/manager-user.service';
import { TypeUserService } from '../../../service/type_user/type-user.service';

@Component({
  selector: 'app-add',
  templateUrl: './add.component.html',
  styleUrl: './add.component.scss'
})
export class AddComponent {

  isEditUserVisible = true;
  closeForm() {
    this.isEditUserVisible = false; // Đặt lại trạng thái để ẩn form
    console.log('Form đã được đóng lại'); // Kiểm tra trong console
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
    status: 1, // Gán trạng thái mặc định
  };
  errorMessages: string[] = [];



  formFields: {
    name: string;
    label: string;
    type: string;
    required: boolean;
    options?: { value: string; label: string }[];
  }[] = [
    { name: 'iduser', label: 'Id thông tin người dùng', type: 'text', required: true },
    { name: 'name', label: 'Tên người dùng', type: 'text', required: false },
    { name: 'birth', label: 'Ngày sinh người dùng', type: 'date', required: false },
    { name: 'email', label: 'Email người dùng', type: 'text', required: false },
    { name: 'phone', label: 'Phone người dùng', type: 'text', required: false },
    { name: 'points', label: 'Điểm của người dùng', type: 'text', required: false },
    { name: 'salary', label: 'Lương của người dùng', type: 'select', required: false, options: [] },
    { name: 'reward', label: 'Thưởng của người dùng', type: 'text', required: false }
  ];


  constructor(private userService: ManagerUserService, private router: Router, private typeUserService: TypeUserService) {}

  ngOnInit(): void {
    this.newUser.iduser = this.generatedIdUser; // Gán iduser từ cha vào form
    this.loadSalaryOptions(); // Gọi hàm để lấy dữ liệu lương
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
    };
    this.errorMessages = []; // Reset thông báo lỗi
  }

  loadSalaryOptions(): void {
    this.typeUserService.getListType_UserCopppy().subscribe((typeUsers: any[]) => {
      // Filter out typeUsers with status === 2
      const activeTypeUsers = typeUsers.filter(user => user.status !== 2);

      // Map remaining users to the salaryOptions format
      const salaryOptions = activeTypeUsers.map(user => ({
        value: user.salary.toString(),
        label: user.name_type
      }));

      const salaryField = this.formFields.find(field => field.name === 'salary');
      if (salaryField) {
        salaryField.options = salaryOptions;
      }

      // Optionally, remove or hide certain form fields if no typeUsers are active
      if (activeTypeUsers.length === 0) {
        this.formFields = this.formFields.filter(field => field.name !== 'salary');
      }
    });
  }



  onSubmit() {

    console.log('Dữ liệu gửi lên:', this.newUser); // Kiểm tra dữ liệu
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


    this.newUser.status = 1;
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
    status: this.newUser.status,
  };




  this.userService.addUser(this.newUser).subscribe({
    next: (response) => {


      this.closeForm(); // Call a method to close the form
      this.resetForm();
      this.router.navigate(['/gioithieu/add']);

    },
    error: (error) => {
      console.error('Lỗi khi thêm người dùng:', error);
    }
  });





  }

}
