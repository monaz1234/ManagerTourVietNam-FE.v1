import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ManagerUserService } from '../../../service/manager-user.service';
import { TypeUserService } from '../../../service/type_user/type-user.service';

@Component({
  selector: 'app-edit',
  templateUrl: './edit.component.html',
  styleUrl: './edit.component.scss'
})
export class EditComponent{
  @Input() selectedUser: any; // Nhận dữ liệu người dùng đang được chỉnh sửa
  @Output() closeForm = new EventEmitter<void>(); // Emit sự kiện đóng form
  @Output() userUpdated = new EventEmitter<any>(); // Phát sự kiện sau khi cập nhật



  constructor(private router: Router, private userService: ManagerUserService, private typeUserService: TypeUserService) {}


 ngOnInit(): void {
    if (this.selectedUser) {
      console.error('Không tìm thấy người dùng để chỉnh sửa');
    }
    this.loadSalaryOptions();
  }

  formFields = [
    { name: 'iduser', label: 'Id thông tin người dùng', type: 'text', required: true,  },
    { name: 'name', label: 'Tên người dùng', type: 'text', required: false },
    { name: 'birth', label: 'Ngày sinh người dùng', type: 'date', required: false },
    { name: 'email', label: 'Email người dùng', type: 'text', required: false },
    { name: 'phone', label: 'Phone người dùng', type: 'text', required: false },
    { name: 'points', label: 'Điểm của người dùng', type: 'text', required: false },

    {name: 'salary', label : 'Lương của người dùng', type: 'select', required : false, options: []}, // Để options rỗng trước

    { name: 'reward', label: 'Thưởng của người dùng', type: 'text', required: false },

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

  resetForm() {
    this.selectedUser = {
      iduser: '',
      name: '',
      birth: '',
      email: '',
      phone: '',
      points: 0,
      salary: 0,
      reward: 0,
      status: 1
    };
  }

 // Hàm lấy dữ liệu lương từ dịch vụ và cập nhật vào options
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
    // Gửi yêu cầu cập nhật người dùng
    this.userService.updateUser(this.selectedUser.iduser, this.selectedUser).subscribe({
      next: (response) => {
        console.log('Chỉnh sửa thành công:', response);
        this.refreshUserData(); // Gọi hàm làm mới dữ liệu
        this.userUpdated.emit(this.selectedUser); // Phát sự kiện cập nhật
        this.closeForm.emit(); // Phát sự kiện để đóng form
      },
      error: (error) => {
        console.error('Lỗi khi cập nhật người dùng:', error);
        // Bạn có thể hiển thị thông báo lỗi ở đây nếu cần
      },
    });
}

  // Hàm để cập nhật thông tin đã chỉnh sửa trong danh sách hiển thị




    // Hàm để làm mới dữ liệu người dùng từ server
    refreshUserData() {
      this.userService.findUser(this.selectedUser.iduser).subscribe(user => {
        console.log('Dữ liệu người dùng mới:', user); // Kiểm tra dữ liệu nhận được
        this.selectedUser = user; // Cập nhật selectedUser bằng dữ liệu mới
      });
    }


}
