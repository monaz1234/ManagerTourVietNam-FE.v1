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
  @Input() selectedAccount: any;  // Chỉ cần khai báo một lần từ @Input()
  @Output() closeForm = new EventEmitter<void>();
  @Output() accountUserUpdated = new EventEmitter<void>();

  // Khai báo các biến options
  typeUserOptions: any[] = [{ value: 'T001', label: 'Chọn loại người dùng' }];  // Mảng chứa đối tượng mặc định
  userOptions: any[] = [{ value: 'Y001', label: 'Chọn người dùng' }];            // Mảng chứa đối tượng mặc định


  formFields = [
    {name : 'idaccount', label: 'Id thông tin người dùng', type: 'text', required: true, displayName: ''},
    {name : 'username', label: 'Tài khoản', type: 'text', required: false, displayName: ''},
    {name: 'password', label : 'Mật khẩu', type: 'text', required : false, displayName: ''},
    {
      name: 'id_type_user',
      label: 'Loại người dùng',
      type: 'select',
      required: false,
      options: this.typeUserOptions,  // Sử dụng typeUserOptions đã khai báo
      displayName: ''  // Chưa có giá trị mặc định, sẽ cập nhật sau
    },
    {
      name: 'iduser',
      label: 'Người dùng',
      type: 'select',
      required: false,
      options: this.userOptions,      // Sử dụng userOptions đã khai báo
      displayName: ''  // Chưa có giá trị mặc định, sẽ cập nhật sau
    },
    {
      name: 'status',
      label: 'Trạng thái của người dùng',
      type: 'select',
      required: false,
      options: [
        { value: '1', label: 'Hoạt động' },
        { value: '2', label: 'Đã ngưng hoạt động' }
      ],
      displayName: ''
    }
  ];

  constructor(
    private router: Router,
    private accountService: AccountService,
    private type_userService: TypeUserService,
    private userService: ManagerUserService
  ) {}

  ngOnInit(): void {
    console.log('Selected Account:', this.selectedAccount);

    // Kiểm tra nếu selectedAccount đã có giá trị
    if (this.selectedAccount) {
      // Cập nhật giá trị mặc định cho id_type_user và iduser
      if (this.selectedAccount.typeUser) {
        this.selectedAccount.id_type_user = this.selectedAccount.typeUser.idtypeuser; // Cập nhật giá trị id_type_user
      }
      if (this.selectedAccount.user) {
        this.selectedAccount.iduser = this.selectedAccount.user.iduser; // Cập nhật giá trị iduser
      }

      // Tìm và cập nhật displayName cho các trường
      const idTypeUserField = this.formFields.find(field => field.name === 'id_type_user');
      if (idTypeUserField) {
        idTypeUserField.displayName = this.selectedAccount.typeUser?.name_type || '';
      }

      const idUserField = this.formFields.find(field => field.name === 'iduser');
      if (idUserField) {
        idUserField.displayName = this.selectedAccount.user?.name || '';
      }

      // Tải các tùy chọn (options) cho các dropdown
      this.loadTypeUserOptions();
      this.loadUsersOptions();

      // Kiểm tra giá trị của iduser và idtypeuser sau khi gán
      console.log('Selected Account iduser:', this.selectedAccount.iduser);
      console.log('Selected Account id_type_user:', this.selectedAccount.id_type_user);
    }
  }

  loadTypeUserOptions(): void {
    this.type_userService.getListType_UserCopppy().subscribe((typeUsers: any[]) => {
      const activeTypeUsers = typeUsers.filter(user => user.status !== 2);
      this.typeUserOptions = activeTypeUsers.map(user => ({
        value: user.idtypeuser,
        label: user.name_type
      }));

      // Cập nhật lại options cho trường 'id_type_user'
      const typeUserField = this.formFields.find(field => field.name === 'id_type_user');
      if (typeUserField) {
        typeUserField.options = this.typeUserOptions;
      }
    });
  }

  loadUsersOptions(): void {
    this.userService.getList_UserCopppy().subscribe((users: any[]) => {
      const activeUsers = users.filter(user => user.status !== 2);
      this.userOptions = activeUsers.map(user => ({
        value: user.iduser,
        label: user.name
      }));

      // Cập nhật lại options cho trường 'iduser'
      const userField = this.formFields.find(field => field.name === 'iduser');
      if (userField) {
        userField.options = this.userOptions;
      }
    });
  }

  onSubmit(): void {
    this.accountService.updateAccount(this.selectedAccount.idaccount, this.selectedAccount).subscribe({
      next: (response) => {
        console.log('Chỉnh sửa thành công', response);
        this.refreshAccountUserData();
        this.accountUserUpdated.emit(this.selectedAccount);
        this.closeForm.emit();
      },
      error: (error) => {
        console.error('Lỗi khi cập nhập người dùng', error);
      }
    });
  }

  refreshAccountUserData(): void {
    this.accountService.findAccount(this.selectedAccount.idaccount).subscribe(account => {
      console.log('Dữ liệu tài khoản mới', account);
      this.selectedAccount = account;
    });
  }
}
