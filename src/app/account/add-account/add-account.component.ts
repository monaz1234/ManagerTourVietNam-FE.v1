import { Component, Input } from '@angular/core';
import { AccountService } from '../../../service/account/account.service';
import { Router } from '@angular/router';
import { TypeUserService } from '../../../service/type_user/type-user.service';
import { ManagerUserService } from '../../../service/manager-user.service';

@Component({
  selector: 'app-add-account',
  templateUrl: './add-account.component.html',
  styleUrl: './add-account.component.scss'
})
export class AddAccountComponent {

  isEditAccountVisible = true;
  closeForm() {
    this.isEditAccountVisible = false; // Đặt lại trạng thái để ẩn form
    console.log('Form đã được đóng lại'); // Kiểm tra trong console
  }

  @Input() generatedIdAccount: string = '';
  newAccount: any = {
    idaccount : '',
    username : '',
    password: '',
    image: '',
    id_type_user:'',
    iduser:'',
    status: 1,
  };

  errorMessages: string[] = [];

  formFields:{
    name: string;
    label: string;
    type: string;
    required: boolean;
    options?:{value : string; label: string}[];
  }[] = [
    {name : 'idaccount', label: 'Id thông tin người dùng', type: 'text', required: true},
    {name : 'username', label: 'Tài khoản', type: 'text', required: false},
    {name: 'password', label : 'Mật khẩu', type: 'text', required : false},
    { name: 'id_type_user', label: 'Loại người dùng', type: 'select', required: false, options: [] },
    { name: 'iduser', label: 'Người dùng', type: 'select', required: false, options: [] },
  ]

  constructor(private accountService : AccountService, private router : Router, private type_UserService : TypeUserService, private userService : ManagerUserService){}

  ngOnInit() : void{
    this.newAccount.idaccount = this.generatedIdAccount;
    this.loadTypeUserOptions();
    this.loadUsersOptions();
  }

  resetForm(){
    this.newAccount = {
      idaccount : this.generatedIdAccount,
      username : '',
      password: '',
    };
    this.errorMessages = [];
  }

  loadTypeUserOptions(): void {
    this.type_UserService.getListType_UserCopppy().subscribe((typeUsers: any[]) => {
      // Filter out typeUsers with status === 2
      const activeTypeUsers = typeUsers.filter(user => user.status !== 2);

      // Map remaining users to the salaryOptions format
      const typeUserOptions = activeTypeUsers.map(user => ({
        value: user.idtypeuser,
        label: user.name_type
      }));

      const nameField = this.formFields.find(field => field.name === 'id_type_user');
      if (nameField) {
        nameField.options = typeUserOptions;
      }

      // Optionally, remove or hide certain form fields if no typeUsers are active
      if (activeTypeUsers.length === 0) {
        this.formFields = this.formFields.filter(field => field.name !== 'id_type_user');
      }
    });
  }

  loadUsersOptions(): void {
    this.userService.getList_UserCopppy().subscribe((users: any[]) => {
      // Lọc người dùng có status khác 2 và id_type_user khác "T003"
      const activeUsers = users.filter(user => user.status !== 2 && user.id_type_user !== "T003");

      // Chuyển đổi những người dùng còn lại thành dạng UserOptions
      const UserOptions = activeUsers.map(user => ({
        value: user.iduser,
        label: user.name
      }));

      const nameField = this.formFields.find(field => field.name === 'iduser');
      if (nameField) {
        nameField.options = UserOptions;
      }

      // Nếu không có người dùng hợp lệ, loại bỏ trường 'iduser'
      if (activeUsers.length === 0) {
        this.formFields = this.formFields.filter(field => field.name !== 'iduser');
      }
    });
  }


  onSubmit(){
    console.log('Dữ liệu gửi lên', this.newAccount);
    this.errorMessages = [];
    if(this.errorMessages.length > 0){
      return;
    }
    this.newAccount.status = 1;
    this.newAccount = {
      idaccount : this.newAccount.idaccount,
      username : this.newAccount.username,
      password : this.newAccount.password,
      image : this.newAccount.image,
      status : this.newAccount.status,
      id_type_user: this.newAccount.id_type_user,
      iduser : this.newAccount.iduser,
    };
    this.accountService.addAccount(this.newAccount).subscribe({
      next: (response) =>{
        this.closeForm();
        this.resetForm();
        this.router.navigate(['admin/account/add']);
      },
      error : (error) =>{
        console.log('Lỗi khi thêm tài khoản người dùng', error);
      }
    });
  }


}
