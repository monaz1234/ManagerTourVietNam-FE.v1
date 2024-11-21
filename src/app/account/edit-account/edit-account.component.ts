import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Router } from '@angular/router';
import { AccountService } from '../../../service/account/account.service';
import { TypeUserService } from '../../../service/type_user/type-user.service';
import { ManagerUserService } from '../../../service/manager-user.service';

@Component({
  selector: 'app-edit-account',
  templateUrl: './edit-account.component.html',
  styleUrls: ['./edit-account.component.scss']
})
export class EditAccountComponent {
  @Input() selectedAccount: any;  // Input property for the selected account
  @Output() closeForm = new EventEmitter<void>();
  @Output() accountUserUpdated = new EventEmitter<void>();

  // Options for type users and users
  typeUserOptions: any[] = [];
  userOptions: any[] = [];

  formFields = [
    { name: 'idaccount', label: 'Id thông tin người dùng', type: 'text', required: true },
    { name: 'username', label: 'Tài khoản', type: 'text', required: false },
    { name: 'password', label: 'Mật khẩu', type: 'text', required: false },
    {
      name: 'id_type_user',
      label: 'Loại người dùng',
      type: 'select',
      required: false,
      options: [],  // This will be updated dynamically
      displayName: ''
    },
    {
      name: 'iduser',
      label: 'Người dùng',
      type: 'select',
      required: false,
      options: [],  // This will be updated dynamically
      displayName: ''
    },
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
    private accountService: AccountService,
    private type_userService: TypeUserService,
    private userService: ManagerUserService
  ) {}

  ngOnInit(): void {
    if (this.selectedAccount) {
      // Set the initial values of type and user based on the selected account
      this.selectedAccount.id_type_user = this.selectedAccount.typeUser?.idtypeuser || '';
      this.selectedAccount.iduser = this.selectedAccount.user?.iduser || '';

      // this.loadTypeUserOptions();
      const currentUserTypeId = this.selectedAccount.user?.typeUser?.idtypeuser;
      console.log("Loại người dùng :" + currentUserTypeId) // Ví dụ: ID loại người hiện tại của user
      this.loadTypeUserOptionsCopy(currentUserTypeId);
      this.loadUsersOptions();
    }
  }

  loadTypeUserOptions(): void {
    this.type_userService.getListType_UserCopppy().subscribe((typeUsers: any[]) => {
      this.typeUserOptions = typeUsers
        .filter(user => user.status !== 2 && user.name_type !== 'Khách hàng') // Thêm điều kiện loại trừ "Khách hàng"
        .map(user => ({
          value: user.idtypeuser,
          label: user.name_type
        }));

      const typeUserField = this.formFields.find(field => field.name === 'id_type_user');
      if (typeUserField) typeUserField.options = this.typeUserOptions;
    });
  }

  loadTypeUserOptionsCopy(currentUserTypeId: string): void {
    this.type_userService.getListType_UserCopppy().subscribe((typeUsers: any[]) => {
      // Lọc các loại người dùng giống với loại người của user hiện tại
      this.typeUserOptions = typeUsers
        .filter(user =>
          user.status !== 2 && // Loại bỏ loại người dùng không hoạt động
          user.name_type !== 'Khách hàng' && // Loại bỏ "Khách hàng"
          user.idtypeuser === currentUserTypeId // Chỉ giữ loại người giống với user hiện tại
        )
        .map(user => ({
          value: user.idtypeuser,
          label: user.name_type
        }));

      // Tìm trường 'id_type_user' và cập nhật options
      const typeUserField = this.formFields.find(field => field.name === 'id_type_user');
      if (typeUserField) typeUserField.options = this.typeUserOptions;
    });
  }



  loadUsersOptions(): void {
    this.userService.getList_UserCopppy().subscribe((users: any[]) => {
      this.userOptions = users.filter(user => user.status !== 2 && user.type_user !== 'T003').map(user => ({
        value: user.iduser,
        label: user.name
      }));

      const userField = this.formFields.find(field => field.name === 'iduser');
      if (userField) userField.options = this.userOptions;
    });
  }

  onSubmit(): void {
    // Update the account with the selected user and type user
    this.selectedAccount.typeUser = {
      idtypeuser: this.selectedAccount.id_type_user,
      name_type: this.typeUserOptions.find(option => option.value === this.selectedAccount.id_type_user)?.label || '',
      salary: 0,  // Set this value according to your requirements, maybe from the options
      status: 1
    };

    this.selectedAccount.user = {
      iduser: this.selectedAccount.iduser,
      name: this.userOptions.find(option => option.value === this.selectedAccount.iduser)?.label || '',
      status: 1
    };

    // Call service to update the account
    this.accountService.updateAccount(this.selectedAccount.idaccount, this.selectedAccount).subscribe({
      next: (response) => {
        console.log('Chỉnh sửa thành công', response);
        this.accountUserUpdated.emit(this.selectedAccount);
        this.closeForm.emit();
      },
      error: (error) => {
        console.error('Lỗi khi cập nhật người dùng', error);
      }
    });
  }
}
