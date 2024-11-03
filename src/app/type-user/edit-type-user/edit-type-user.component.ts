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
  {name : 'idtypeuser', label : 'Id loại người dùng', type : 'text', require : true},
  {name : 'name_type'}
]
}
