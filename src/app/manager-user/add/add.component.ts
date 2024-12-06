import { Component, EventEmitter, Input, Output, SimpleChanges } from '@angular/core';
import { Router } from '@angular/router';
import { ManagerUserService } from '../../../service/manager-user.service';
import { TypeUserService } from '../../../service/type_user/type-user.service';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { User } from '../../../interface/user.interface';

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
  @Output() userAdded = new EventEmitter<User>(); // Phát sự kiện với kiểu User
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
    typeUser: '',
  };
  errorMessages: string[] = [];
  activeTypeUsers: any[] = [];


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
    { name: 'points', label: 'Điểm của người dùng', type: 'number', required: false },
    { name: 'salary', label: 'Lương của người dùng', type: 'number', required: false },
    { name: 'reward', label: 'Thưởng của người dùng', type: 'number', required: false },
    {
      name: 'typeUser',
      label: 'Loại người dùng',
      type: 'select',
      required: false,
      options: []
    },
  ];



  constructor(private userService: ManagerUserService, private router: Router, private typeUserService: TypeUserService, private httpClient: HttpClient) {}

  ngOnInit(): void {
    console.log('ID nhận từ cha:', this.generatedIdUser); // Kiểm tra giá trị
    this.newUser.iduser = this.generatedIdUser; // Gán iduser từ cha vào form
    this.loadSalaryOptions();
    this.loadTypeUserOptions();
    this.getTypeUserOptions();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['generatedIdUser']) {
      console.log('ID nhận được:', changes['generatedIdUser'].currentValue);
      this.newUser.iduser = changes['generatedIdUser'].currentValue;
    }
  }


  resetForm() {
    this.newUser = {
      iduser: this.generatedIdUser, // Gán ID mới từ component cha
      name: '',
      birth: '',
      email: '',
      typeUser:'',
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

  loadTypeUserOptions(): void {
    this.typeUserService.getListType_UserCopppy().subscribe((typeUsers: any[]) => {
      // Filter out typeUsers with status === 2
      this.activeTypeUsers = typeUsers.filter(user => user.status !== 2);

      // Map active users to the id_type_user options format
      const idTypeUserOptions = this.activeTypeUsers.map(user => ({
        value: user.idtypeuser,
        label: user.name_type
      }));

      const idTypeUserField = this.formFields.find(field => field.name === 'typeUser');
      if (idTypeUserField) {
        idTypeUserField.options = idTypeUserOptions;
      }

      // Optionally, hide id_type_user field if no active users
      if (this.activeTypeUsers.length === 0) {
        this.formFields = this.formFields.filter(field => field.name !== 'typeUser');
      }
    });
  }

  onIdTypeUserChange(selectedIdTypeUser: string): void {
    const selectedTypeUser = this.activeTypeUsers.find(user => user.idtypeuser === selectedIdTypeUser);
    if (selectedTypeUser) {
      this.newUser.salary = selectedTypeUser.salary; // Lấy salary từ đối tượng typeUser đã chọn
    } else {
      this.newUser.salary = 0; // Reset salary nếu không tìm thấy loại người dùng
    }
  }

  typeUserOptions: { idtypeuser: string; name_type: string; status: number; salary: number }[] = [];
  getTypeUserOptions() {
    this.typeUserService.getListType_UserCopppy().subscribe((data: any) => {
      this.typeUserOptions = data;
    });
  }


  onTypeUserChange(selectedTypeUserId: string) {
    const selectedTypeUser = this.typeUserOptions.find(
      (type) => type.idtypeuser === selectedTypeUserId
    );

    if (selectedTypeUser) {
      this.newUser.typeUser = {
        idtypeuser: selectedTypeUser.idtypeuser,
        name_type: selectedTypeUser.name_type,
        status: selectedTypeUser.status,
        salary: selectedTypeUser.salary,
      };
    }
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
    }
    if(!this.newUser.typeUser){
      this.errorMessages.push('Không được để trống loại người dùng');
    }
    else {
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
    iduser: this.newUser.iduser,
    name: this.newUser.name,
    birth: this.newUser.birth,
    email: this.newUser.email,
    phone: this.newUser.phone,
    points: this.newUser.points,
    salary: this.newUser.salary,
    reward: this.newUser.reward,
    status: this.newUser.status,
    typeUser: (() => {
      const selectedTypeUser = this.typeUserOptions.find(
        option => option.idtypeuser === this.newUser.typeUser
      );

      return selectedTypeUser
        ? {
            idtypeuser: selectedTypeUser.idtypeuser,
            name_type: selectedTypeUser.name_type,
            status: selectedTypeUser.status,
            salary: selectedTypeUser.salary
          }
        : { idtypeuser: "", name_type: "", status: 0, salary: 0 }; // Giá trị mặc định nếu không tìm thấy
    })()
  };



  this.userService.addUser(this.newUser).subscribe({
    next: (response) => {

      this.userAdded.emit(this.newUser);
      this.closeForm(); // Call a method to close the form
      this.resetForm();
      this.router.navigate(['admin/gioithieu/add']);
    },
    error: (error) => {
      console.error('Lỗi khi thêm người dùng:', error);
      if (error.error) {
        console.error('Chi tiết lỗi từ backend:', error.error);
      } else {
        console.error('Lỗi không xác định:', error);
      }
    }
  });







  }

}
