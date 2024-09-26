import { Component, OnInit } from '@angular/core';
import { ManagerUserService } from './manager-user.service';
@Component({
  selector: 'app-manager-user',
  templateUrl: './manager-user.component.html',
  styleUrl: './manager-user.component.scss'
})
export class ManagerUserComponent implements OnInit{

  users : any;
  constructor(private pro1: ManagerUserService){

  }
  ngOnInit(): void {
    this.getListUser();
  }
  getListUser() {
    // Bạn cần gọi service và xử lý dữ liệu người dùng ở đây
    this.pro1.getList_User().subscribe((data: any) => {
      this.users = data;
    });
  }



}
