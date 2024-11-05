import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Router } from '@angular/router';
import { TypeUserService } from '../../../service/type_user/type-user.service';

@Component({
  selector: 'app-edit-type-user',
  templateUrl: './edit-type-user.component.html',
  styleUrl: './edit-type-user.component.scss'
})
export class EditTypeUserComponent {

  @Input() selectedTypeUser: any;
  @Output() closeForm = new EventEmitter<void>();
  @Output() TypeUserUpdated = new EventEmitter<any>();

  constructor(private router : Router, private typeUserService : TypeUserService){}

  ngOnInit() : void{
    if(!this.selectedTypeUser){
      console.error('Không tìm thấy loại người dùng để chỉnh sửa');
    }
  }
  formFields = [
    {name : 'idtypeuser', label : 'Id loại thông tin người dùng', type: 'text', required: true},
    {name : 'name_type', label: 'Tên loại người dùng', type : 'text', required : true},
    {name: 'salary', label : 'Lương loại người dùng', type: 'number', required : false },
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

  resetFormTypeUser(){
    this.selectedTypeUser = {
      idtypeuser:'',
      name_type:'',
      salary:0
    }
  }

  refreshTypeUserData(){
    this.typeUserService.findTypeUser(this.selectedTypeUser.idtypeuser).subscribe(typeUser =>{
      console.log('Du lieu loai nguoi dung moi', typeUser);
      this.selectedTypeUser = typeUser;
    });
  }
  onSubmit(){
    this.typeUserService.updateTypeUser(this.selectedTypeUser.idtypeuser, this.selectedTypeUser).subscribe({
      next : (response) =>{
        console.log('Chinh sua thanh cong', response);
        this.refreshTypeUserData();
        this.TypeUserUpdated.emit(this.selectedTypeUser);
        this.closeForm.emit();
      },
      error: (error)=>{
        console.error('Loi khi cap nhat nguoi dung', error);
      },
    });
  }
}
