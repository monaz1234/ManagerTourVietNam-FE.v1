import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';
import { TypeUserService } from '../../../service/type_user/type-user.service';

@Component({
  selector: 'app-add-Type',
  templateUrl: './add.component.html',
  styleUrl: './add.component.scss'
})
export class AddTypeComponent {

   isEditTypeUserVisible = true;

   closeForm(){
      this.isEditTypeUserVisible = false;
      console.log('Form đã được đóng lại');
   }

   @Input() generateNewTypeUserId: string = '';
    newTypeUser: any = {
      idtypeuser : '',
      name_type: '',
      status : '',
      salary : 0,

    };
    errorMessages: string[] = [];


    formFields = [
      {name : 'idtypeuser', label : 'Id loại thông tin người dùng', type: 'text', required: true},
      {name : 'name_type', label: 'Tên loại người dùng', type : 'text', required : true},
      {name: 'salary', label : 'Lương loại người dùng', type: 'number', required : false },
    ];

    constructor(private type_userService : TypeUserService, private router : Router){}


    ngOnInit(): void{
      this.newTypeUser.idtypeuser = this.generateNewTypeUserId;
    }

    resetForm(){
      this.newTypeUser = {
        idtypeuser : this.generateNewTypeUserId,
        name_type : '',
        status : '',
        salary : 0,
      }
      this.errorMessages = [];
    }


    onSubmit(){
      console.log('Dữ liệu gửi lên', this.newTypeUser);
      this.errorMessages = [];
      this.newTypeUser.status = 1;

      this.newTypeUser = {
        idtypeuser : this.newTypeUser.idtypeuser,
        name_type : this.newTypeUser.name_type,
        status : this.newTypeUser.status,
        salary : this.newTypeUser.salary
      };

      this.type_userService.addTypeUser(this.newTypeUser).subscribe({
        next : (response) =>{

          this.closeForm();
          this.resetForm();
          this.router.navigate(['admin/type_user/add']);
        },
        error : (error) =>{
          console.error('Lỗi khi thêm thông loại người dùng', error);
        }
      });

    }
}




