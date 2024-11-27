import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';
import { ManagerUserService } from '../../../service/manager-user.service';
import { TypeUserService } from '../../../service/type_user/type-user.service';

@Component({
  selector: 'app-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.scss']
})
export class EditComponent implements OnInit {
  @Input() selectedUser: any;
  @Output() closeForm = new EventEmitter<void>();
  @Output() userUpdated = new EventEmitter<any>();
  typeUserOptions: any[] = [];
  errorMessages: string[] = [];

  formFields = [
    { name: 'iduser', label: 'Id thông tin người dùng', type: 'text', required: true },
    { name: 'name', label: 'Tên người dùng', type: 'text', required: false },
    { name: 'birth', label: 'Ngày sinh người dùng', type: 'date', required: false },
    { name: 'email', label: 'Email người dùng', type: 'text', required: false },
    { name: 'phone', label: 'Phone người dùng', type: 'text', required: false },
    { name: 'points', label: 'Điểm của người dùng', type: 'number', required: false },
    {
      name: 'typeUser',
      label: 'Loại người dùng',
      type: 'select',
      required: false,
      options: []
    },
    { name: 'salary', label: 'Lương của người dùng', type: 'text', required: false },
    { name: 'reward', label: 'Thưởng của người dùng', type: 'number', required: false },
    {
      name: 'status',
      label: 'Trạng thái của người dùng',
      type: 'select',
      required: false,
      options: [
        { value: '1', label: 'Hoạt động' },
        { value: '2', label: 'Đã ngưng hoạt động' }
      ]
    }
  ];

  constructor(
    private router: Router,
    private userService: ManagerUserService,
    private typeUserService: TypeUserService
  ) {}

  ngOnInit(): void {
    if (this.selectedUser) {
      console.log('Selected User:', this.selectedUser);
      this.selectedUser.typeUser = this.selectedUser.typeUser?.idtypeuser || '';
    }

    this.loadTypeUserOptions();
  }

  loadTypeUserOptions(): void {
    this.typeUserService.getListType_UserCopppy().subscribe((typeUsers: any[]) => {
      this.typeUserOptions = typeUsers.filter(user => user.status !== 2).map(user => ({
        value: user.idtypeuser,
        label: user.name_type,
        salary: user.salary,
        status : user.status


      }));
      const typeUserField = this.formFields.find(field => field.name === 'typeUser');
      if (typeUserField) typeUserField.options = this.typeUserOptions;

      // Kiểm tra giá trị hiện tại của selectedUser.typeUser và cập nhật lại nếu cần
      if (this.selectedUser && this.selectedUser.typeUser) {
        const selectedTypeUser = this.typeUserOptions.find(option => option.value === this.selectedUser.typeUser);
        if (selectedTypeUser) {
          this.selectedUser.name_type = selectedTypeUser.label;
          this.selectedUser.salary = selectedTypeUser.salary;
          console.log("Vãi lìn");
        }
      }
    });

  }


  onTypeUserChange(selectedTypeUserId: string): void {
    const selectedTypeUser = this.typeUserOptions.find(type => type.value === selectedTypeUserId);
    if (selectedTypeUser) {
      // Cập nhật thông tin salary và name_type
      this.selectedUser.salary = selectedTypeUser.salary || 0;
      this.selectedUser.name_type = selectedTypeUser.label;
      this.selectedUser.typeUser = selectedTypeUser.value;
      this.selectedUser.status = selectedTypeUser.status

      console.log(selectedTypeUser.value);
    } else {
      // Nếu không tìm thấy loại người dùng phù hợp, bạn có thể reset giá trị
      this.selectedUser.salary = 0;
      this.selectedUser.name_type = '';
    }
  }

  onSalaryInput(value: string) {
    // Loại bỏ ký tự không hợp lệ
    const rawValue = value.replace(/\./g, '').replace(/[^0-9]/g, '');
    // Chuyển thành số nguyên
    const numericValue = rawValue ? parseInt(rawValue, 10) : 0;
    // Định dạng lại giá trị
    this.selectedUser.salary = numericValue;
    // Cập nhật định dạng hiển thị
    this.selectedUser.salaryFormatted = new Intl.NumberFormat('vi-VN').format(numericValue);
  }


  onSubmit(): void {
    // Làm trống danh sách lỗi trước khi kiểm tra
    this.errorMessages = [];

    // Kiểm tra email
    const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailPattern.test(this.selectedUser.email)) {
      this.errorMessages.push('Email không hợp lệ!');
    }

    // Kiểm tra số điện thoại
    const phonePattern = /^\d{10}$/;
    if (!phonePattern.test(this.selectedUser.phone)) {
      this.errorMessages.push('Số điện thoại không hợp lệ!');
    }

    // Kiểm tra điểm, lương và thưởng không âm
    if (this.selectedUser.points < 0) {
      this.errorMessages.push('Điểm không được âm!');
    }
    if (this.selectedUser.salary < 0) {
      this.errorMessages.push('Lương không được âm!');
    }
    if (this.selectedUser.reward < 0) {
      this.errorMessages.push('Thưởng không được âm!');
    }

    // Kiểm tra ngày sinh
    if (!this.selectedUser.birth) {
      this.errorMessages.push('Ngày sinh không được để trống!');
    } else {
      const birthDate = new Date(this.selectedUser.birth);
      const today = new Date();
      let age = today.getFullYear() - birthDate.getFullYear();
      const monthDifference = today.getMonth() - birthDate.getMonth();
      if (monthDifference < 0 || (monthDifference === 0 && today.getDate() < birthDate.getDate())) {
        age--;
      }

      if (age < 18) {
        this.errorMessages.push('Người dùng phải từ 18 tuổi trở lên!');
      }
    }

    // Kiểm tra loại người dùng
    if (!this.selectedUser.typeUser) {
      this.errorMessages.push('Loại người dùng không được để trống!');
    }

    // Nếu có lỗi, dừng quá trình gửi và hiển thị lỗi
    if (this.errorMessages.length > 0) {
      console.error('Lỗi xác thực:', this.errorMessages);
      return;
    }

    // Tìm typeUser từ typeUserOptions bằng cách so sánh idtypeuser với selectedUser.typeUser
    const selectedTypeUser = this.typeUserOptions.find(option => option.value === this.selectedUser.typeUser);

    // Nếu tìm thấy typeUser trong danh sách options, gán lại dữ liệu vào selectedUser
    if (selectedTypeUser) {
      this.selectedUser = {
        ...this.selectedUser,
        typeUser: {
          idtypeuser: selectedTypeUser.value,  // Đảm bảo gán đúng ID của typeUser
          name_type: selectedTypeUser.label,   // Đảm bảo gán đúng tên loại người dùng
          status: selectedTypeUser.status,
          salary: selectedTypeUser.salary      // Đảm bảo gán đúng lương
        }
      };
    } else {
      // Nếu không tìm thấy, gán giá trị mặc định cho typeUser
      this.selectedUser = {
        ...this.selectedUser,

        typeUser: { idtypeuser: "", name_type: "", salary: 0, status: 1 },
        salaryFormatted: "" // Giá trị hiển thị định dạng
      };
    }

    // Kiểm tra log để đảm bảo rằng selectedUser đã được gán đúng
    console.log('Updated Selected User:', this.selectedUser);

    // Tiến hành gửi yêu cầu cập nhật người dùng
    this.userService.updateUser(this.selectedUser.iduser, this.selectedUser).subscribe({
      next: (response) => {
        console.log('Chỉnh sửa thành công:', response);
        this.userUpdated.emit(this.selectedUser); // Emit người dùng đã cập nhật
        this.closeForm.emit(); // Emit để đóng form
      },
      error: (error) => {
        console.error('Lỗi khi cập nhật người dùng:', error);
      }
    });
  }


}
