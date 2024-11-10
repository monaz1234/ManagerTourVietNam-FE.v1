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
  typeUserOptions12: any[] = [{ value: '', label: 'Chọn loại người dùng' }];
  activeTypeUsers: any[] = [];

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
      options: [],
    },
    { name: 'salary', label: 'Lương của người dùng', type: 'number', required: false},
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
    console.log(this.selectedUser);

    if (this.selectedUser.typeUser) {
      this.selectedUser.typeUser = this.selectedUser.typeUser.idtypeuser; // Cập nhật giá trị id_type_user
    }

    if (!this.selectedUser) {
      console.error('Không tìm thấy người dùng để chỉnh sửa');
      return;
    }

    // Đảm bảo load các options cho typeUser
    this.loadSalaryOptions();
    this.loadTypeUserOptions();
    console.log('Selected Account id_type_user:', this.selectedUser.typeUser);

    // Kiểm tra và cập nhật selectedUser.typeUser
  }



  loadSalaryOptions(): void {
    this.typeUserService.getListType_UserCopppy().subscribe((typeUsers: any[]) => {
      const activeTypeUsers = typeUsers.filter(user => user.status !== 2);
      const typeUserOptions = activeTypeUsers.map(user => ({
        value: user.idtypeuser,
        label: user.name_type
      }));

      // Update options for typeUser field
      const typeUserField = this.formFields.find(field => field.name === 'typeUser');
      if (typeUserField) {
        typeUserField.options = typeUserOptions;
      }

      // Set the selected type user if available
      if (this.selectedUser && this.selectedUser.typeUser) {
        const selectedOption = typeUserOptions.find(option => option.value === this.selectedUser.typeUser.idtypeuser);
        if (selectedOption) {
          this.selectedUser.typeUser = selectedOption;
        }
      }
    });
  }
  onTypeUserChange(selectedTypeUserId: string) {
    const selectedTypeUser = this.typeUserOptions.find(
      (type) => type.idtypeuser === selectedTypeUserId
    );

    if (selectedTypeUser) {
      this.selectedUser.typeUser = {
        idtypeuser: selectedTypeUser.idtypeuser,
        name_type: selectedTypeUser.name_type,
        status: selectedTypeUser.status,
        salary: selectedTypeUser.salary
      };
    }
  }

  onIdTypeUserChange(selectedIdTypeUser: string): void {
    const selectedTypeUser = this.typeUserOptions12.find(user => user.value === selectedIdTypeUser);
    if (selectedTypeUser) {
      this.selectedUser.salary = selectedTypeUser.salary; // Lấy salary từ đối tượng typeUser đã chọn
    } else {
      this.selectedUser.salary = 0; // Reset salary nếu không tìm thấy loại người dùng
    }
  }

  typeUserOptions: { idtypeuser: string; name_type: string; status: number; salary: number }[] = [];
  getTypeUserOptions() {
    this.typeUserService.getListType_UserCopppy().subscribe((data: any) => {
      this.typeUserOptions = data;
    });
  }


  loadTypeUserOptions(): void {
    this.typeUserService.getListType_UserCopppy().subscribe((typeUsers: any[]) => {
      const activeTypeUsers = typeUsers.filter(user => user.status !== 2);
      this.typeUserOptions12 = activeTypeUsers.map(user => ({
        value: user.idtypeuser,
        label: user.name_type,
        salary: user.salary
      }));

      // Cập nhật lại loại người dùng đã chọn
      if (this.selectedUser && this.selectedUser.typeUser) {
        const selectedOption = this.typeUserOptions12.find(option => option.value === this.selectedUser.typeUser.idtypeuser);
        if (selectedOption) {
          this.selectedUser.typeUser = selectedOption;
          console.log('Cập nhật loại người dùng:', this.selectedUser.typeUser);
        }
      }
    });
  }




  onSubmit() {
    // Cập nhật thông tin người dùng với loại người dùng đã chọn
    this.selectedUser = {
      iduser: this.selectedUser.iduser,
      name: this.selectedUser.name,
      birth: this.selectedUser.birth,
      email: this.selectedUser.email,
      phone: this.selectedUser.phone,
      points: this.selectedUser.points,
      salary: this.selectedUser.salary,
      reward: this.selectedUser.reward,
      status: this.selectedUser.status,
      typeUser: (() => {
        const selectedTypeUser = this.typeUserOptions12.find(
          option => option.value === this.selectedUser.typeUser.value
        );

        // Nếu tìm thấy loại người dùng, cập nhật thông tin đầy đủ
        return selectedTypeUser
          ? {
              idtypeuser: selectedTypeUser.value,
              name_type: selectedTypeUser.label,
              status: selectedTypeUser.status,
              salary: selectedTypeUser.salary
            }
          : { idtypeuser: "", name_type: "", status: 0, salary: 0 }; // Giá trị mặc định nếu không tìm thấy
      })()
    };

    // Cập nhật người dùng
    this.userService.updateUser(this.selectedUser.iduser, this.selectedUser).subscribe({
      next: (response) => {
        console.log('Chỉnh sửa thành công:', response);
        this.refreshUserData();
        this.userUpdated.emit(this.selectedUser);
        this.closeForm.emit();
      },
      error: (error) => {
        console.error('Lỗi khi cập nhật người dùng:', error);
      }
    });
  }




  refreshUserData() {
    this.userService.findUser(this.selectedUser.iduser).subscribe(user => {
      console.log('Dữ liệu người dùng mới:', user);
      this.selectedUser = user;
    });
  }
}
