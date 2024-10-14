import { Component, OnInit, Input } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ManagerUserService } from '../../../service/manager-user.service';

@Component({
  selector: 'app-edit',
  templateUrl: './edit.component.html',
  styleUrl: './edit.component.scss'
})
export class EditComponent{
  @Input() selectedUser: any; // Nhận dữ liệu người dùng đang được chỉnh sửa

  ngOnInit(): void {
    // Nếu cần, bạn có thể thực hiện các thao tác khởi tạo ở đây
  }

  // Phương thức để gửi thông tin chỉnh sửa (có thể bao gồm xác thực)
  onSubmit() {
    // Gửi yêu cầu chỉnh sửa người dùng đến server
    console.log('Dữ liệu chỉnh sửa:', this.selectedUser);
    // Thực hiện gọi service để chỉnh sửa người dùng ở đây
  }

}
