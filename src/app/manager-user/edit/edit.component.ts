import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ManagerUserService } from '../../../service/manager-user.service';

@Component({
  selector: 'app-edit',
  templateUrl: './edit.component.html',
  styleUrl: './edit.component.scss'
})
export class EditComponent{
  @Input() selectedUser: any; // Nhận dữ liệu người dùng đang được chỉnh sửa
  @Output() closeForm = new EventEmitter<void>(); // Emit sự kiện đóng form


  constructor(private router: Router, private userService: ManagerUserService) {}


 ngOnInit(): void {
    if (!this.selectedUser) {
      console.error('Không tìm thấy người dùng để chỉnh sửa');
    }
  }

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

  // Phương thức để gửi thông tin chỉnh sửa (có thể bao gồm xác thực)
  onSubmit() {
    console.log('Dữ liệu chỉnh sửa:', this.selectedUser);

    this.userService.updateUser(this.selectedUser.iduser, this.selectedUser).subscribe({
      next: (response) => {
        console.log('Chỉnh sửa thành công:', response);
        this.closeForm.emit(); // Phát sự kiện để đóng form
      },
      error: (error) => {
        console.error('Lỗi khi cập nhật người dùng:', error);
      },
    });
  }


}
