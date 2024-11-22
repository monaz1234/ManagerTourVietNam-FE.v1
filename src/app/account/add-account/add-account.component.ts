import { Component, EventEmitter, Input, Output, SimpleChanges } from '@angular/core';
import { AccountService } from '../../../service/account/account.service';
import { Router } from '@angular/router';
import { TypeUserService } from '../../../service/type_user/type-user.service';
import { ManagerUserService } from '../../../service/manager-user.service';
import { Account } from '../../../interface/account.interface';
import { User } from '../../../interface/user.interface';
import { TypeUser } from '../../../interface/typeuser.interface';

@Component({
  selector: 'app-add-account',
  templateUrl: './add-account.component.html',
  styleUrls: ['./add-account.component.scss']
})
export class AddAccountComponent {

  isEditAccountVisible = true;
  @Input() generatedIdAccount: string = '';
  @Output() accountAdded = new EventEmitter<Account>();

  newAccount: any = {
    idaccount: '',
    username: '',
    password: '',
    image: '',
    id_type_user: '',
    iduser: '',
    status: 1,
  };

  errorMessages: string[] = [];
  activeTypeUsers: any[] = [];
  typeUserOptions:  TypeUser[] = [];
  userOptions: User[] = [];


  [key: string]: any; // Thêm chỉ số kiểu string
  formFields: {
    name: string;
    label: string;
    type: string;
    required: boolean;
    options?: { value: string; label: string }[];
  }[] = [
    { name: 'idaccount', label: 'Id thông tin người dùng', type: 'text', required: true },
    { name: 'username', label: 'Tài khoản', type: 'text', required: true },
    { name: 'password', label: 'Mật khẩu', type: 'text', required: true },
    { name: 'id_type_user', label: 'Loại người dùng', type: 'select', required: true, options: [] },
    { name: 'iduser', label: 'Người dùng', type: 'select', required: false, options: [] },
  ];

  constructor(
    private accountService: AccountService,
    private router: Router,
    private type_UserService: TypeUserService,
    private userService: ManagerUserService
  ) {}

  ngOnInit(): void {
    this.newAccount.idaccount = this.generatedIdAccount;

    // Kiểm tra và lấy ID loại người dùng hiện tại
    const currentTypeId = this.newAccount.user?.typeUser?.idtypeuser // Ví dụ: ID của loại người hiện tại
    console.log("Loại người dùng hiện tại:", currentTypeId);

    // Gọi các hàm tải dữ liệu
    this.loadUsersOptions(); // Tải danh sách người dùng
    if (currentTypeId) {
      this.loadTypeUserOptionsCopy(currentTypeId); // Lọc loại người dùng dựa trên ID hiện tại
    }else{
      this.loadTypeUserOptions();
    }

    this.getTypeUserOptions(); // Tải danh sách tất cả loại người dùng
    this.getUserOptions(); // Tải danh sách tất cả người dùng
  }


  ngOnChanges(changes: SimpleChanges): void {
    if (changes['generatedIdAccount']) {
      this.newAccount.idaccount = changes['generatedIdAccount'].currentValue;
    }

  }

  closeForm() {
    this.isEditAccountVisible = false;
    console.log('Form đã được đóng lại');
  }

  resetForm() {
    this.newAccount = {
      idaccount: this.generatedIdAccount,
      username: '',
      password: '',
      image: '',
      id_type_user: '',
      iduser: '',
      status: 1,
    };
    this.errorMessages = [];
  }

  loadTypeUserOptions(): void {
    this.type_UserService.getListType_UserCopppy().subscribe((typeUsers: any[]) => {
      const activeTypeUsers = typeUsers.filter(user => user.status !== 2 && user.name_type !== 'Khách hàng');
      const typeUserOptions = activeTypeUsers.map(user => ({
        value: user.idtypeuser,
        label: user.name_type
      }));

      const field = this.formFields.find(field => field.name === 'id_type_user');
      if (field) {
        field.options = typeUserOptions;
      }
    });
  }
  loadTypeUserOptionsCopy(currentTypeUserId: string): void {
    this.type_UserService.getListType_UserCopppy().subscribe((typeUsers: any[]) => {
      // Lọc loại người dùng dựa trên ID loại người hiện tại
      const activeTypeUsers = typeUsers.filter(
        user => user.status !== 2 && user.idtypeuser === currentTypeUserId
      );

      // Tạo danh sách tùy chọn
      const typeUserOptions = activeTypeUsers.map(user => ({
        value: user.idtypeuser,
        label: user.name_type
      }));

      // Tìm và cập nhật trường 'id_type_user' trong formFields
      const field = this.formFields.find(field => field.name === 'id_type_user');
      if (field) {
        field.options = typeUserOptions;
      }
    });
  }


  loadUsersOptionsCopy(currentTypeId: string): void {
    this.userService.getList_UserCopppy().subscribe((users: any[]) => {
      // Lọc những người dùng thuộc loại người cụ thể và không phải "Khách hàng"
      const activeUsers = users.filter(user =>
        user.status !== 2 && // Loại bỏ người dùng bị khóa
        user.type_user === currentTypeId && // Chỉ giữ người dùng thuộc loại người hiện tại
        user.name_type !== 'Khách hàng' // Loại bỏ "Khách hàng" (nếu cần)
      );

      // Chuyển đổi danh sách người dùng thành options
      const userOptions = activeUsers.map(user => ({
        value: user.iduser,
        label: user.name
      }));

      // Tìm và cập nhật options cho trường 'iduser'
      const field = this.formFields.find(field => field.name === 'iduser');
      if (field) {
        field.options = userOptions;
      }
    });
  }


  loadUsersOptions(): void {
    this.userService.getList_UserCopppy().subscribe((users: any[]) => {
      const activeUsers = users.filter(user => user.status !== 2 && user.name_type !== 'Khách hàng');
      const userOptions = activeUsers.map(user => ({
        value: user.iduser,
        label: user.name
      }));

      const field = this.formFields.find(field => field.name === 'iduser');
      if (field) {
        field.options = userOptions;
      }
    });
  }




  getTypeUserOptions() {
    this.type_UserService.getListType_UserCopppy().subscribe((data: any) => {
      this.typeUserOptions = data;
    });
  }
  onTypeUserChange(selectedTypeUserId: string) {
    const selectedTypeUser = this.typeUserOptions.find(
      (type) => type.idtypeuser === selectedTypeUserId
    );

    if (selectedTypeUser) {
      this.newAccount.typeUser = {
        idtypeuser: selectedTypeUser.idtypeuser,
        name_type: selectedTypeUser.name_type,
        status: selectedTypeUser.status,
        salary: selectedTypeUser.salary,
      };
    }
  }



  getUserOptions() {
    this.userService.getList_UserCopppy().subscribe((data: any) => {
      this.userOptions = data;
    });
  }
  onUserChange(selectedUserId: string) {
    const selectedUser = this.userOptions.find(
      (type) => type.iduser === selectedUserId
    );

    if (selectedUser) {
      this.newAccount.user = {
        iduser: selectedUser.iduser,
        name: selectedUser.name,
        birth : selectedUser.birth,
        email : selectedUser.email,
        phone : selectedUser.phone,
        points : selectedUser.points,
        salary : selectedUser.salary,
        reward : selectedUser.reward,
        status : selectedUser.status,
        typeUser : selectedUser.typeUser

      };
    }
  }

  onSelectChange(selectedValue: any) {
    // Gọi cả hai hàm khi giá trị thay đổi
    this.onTypeUserChange(selectedValue);
    this.onUserChange(selectedValue);
  }

  validateAccountData(): boolean {
    this.errorMessages = [];
    if (!this.newAccount.idaccount) this.errorMessages.push('ID tài khoản không được để trống.');
    if (!this.newAccount.username) this.errorMessages.push('Tài khoản không được để trống.');
    if (!this.newAccount.password) this.errorMessages.push('Mật khẩu không được để trống.');
    return this.errorMessages.length === 0;
  }



  onSubmit() {
    console.log('Dữ liệu gửi lên', this.newAccount);

    if (!this.validateAccountData()) return;

    // Cập nhật lại các giá trị liên quan đến loại người dùng và người dùng
    this.newAccount = {
      ...this.newAccount,
      status: 1,
      iduser: this.newAccount.iduser,
      id_type_user: this.newAccount.id_type_user,
    };

    this.accountService.addAccount(this.newAccount).subscribe({
      next: (response) => {
        this.accountAdded.emit(this.newAccount);
        this.router.navigate(['admin/account/add']);
        this.closeForm();
        this.resetForm();
      },
      error: (error) => {
        console.error('Lỗi khi thêm tài khoản:', error);
        if (error.error) {
          console.error('Chi tiết lỗi từ backend:', error.error);
        } else {
          console.error('Lỗi không xác định:', error);
        }
      }
    });
  }


}
