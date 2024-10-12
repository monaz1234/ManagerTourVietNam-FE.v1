import { Component, OnInit } from '@angular/core';
import { ManagerUserService } from '../../service/manager-user.service';
import { User } from '../../interface/user.interface';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-manager-user',
  templateUrl: './manager-user.component.html',
  styleUrl: './manager-user.component.scss'
})
export class ManagerUserComponent implements OnInit{




  users: User[] = []; // sử dụng interface
  selectedUser: any;
  newUserId: string = '';



  currentPage: number = 1; // Trang hiện tại
  currentUsers: User[] = []; // Danh sách người dùng hiện tại
  itemsPerPage: number = 10; // Số lượng người dùng trên mỗi trang
  totalItems: number = 0; // Tổng số người dùng
  pages: number[] = []; // Mảng lưu trang



  isAddUserVisible = false; // Biến để theo dõi trạng thái hiển thị

  // Hàm hiển thị form thêm người dùng và tạo id mới
toggleAddUser(): void {
  this.isAddUserVisible = !this.isAddUserVisible;
  if (this.isAddUserVisible) {
    this.generateNewUserId(); // Tạo mã ID mới khi form được hiển thị
  }
}




  constructor(private managerService: ManagerUserService){

  }
  ngOnInit(): void {
    this.getListUser();
  }


  // getListUser() {
  //   this.pro1.getList_User().subscribe((data: User[]) => {
  //     this.users = data;
  //   });
  // }

  getListUser() {
    this.managerService.users$.subscribe((data: User[]) => {
      this.users = data; // Cập nhật danh sách người dùng
      this.totalItems = data.length; // Cập nhật tổng số người dùng
      this.calculatePages(); // Tính số trang
      this.updateCurrentPageUsers(); // Cập nhật người dùng hiển thị trên trang hiện tại
    });
  }

  updateCurrentPageUsers(): void {
    const start = (this.currentPage - 1) * this.itemsPerPage;
    const end = start + this.itemsPerPage;
    this.currentUsers = this.users.slice(start, end);
  }

  goToPage(page: number): void {
    this.currentPage = page;
    this.updateCurrentPageUsers();
  }

  nextPage(): void {
    if (this.currentPage < this.pages.length) {
      this.currentPage++;
      this.updateCurrentPageUsers();
    }
  }

  previousPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.updateCurrentPageUsers();
    }
  }


  calculatePages(): void {
    const pageCount = Math.ceil(this.totalItems / this.itemsPerPage);
    this.pages = Array.from({ length: pageCount }, (_, i) => i + 1);
  }

  isActive(status: string): boolean {
    return status === '1';
  }





  // Hàm chỉnh sửa người dùng
  editUser(user: any): void {
    this.selectedUser = { ...user }; // Sao chép dữ liệu người dùng để chỉnh sửa
    console.log('Chỉnh sửa thông tin người dùng:', this.selectedUser);
    // Ở đây, bạn có thể hiển thị một modal hoặc chuyển hướng đến trang chỉnh sửa
  }



// Hàm xác nhận và xóa người dùng
confirmDelete(user: any): void {
  const confirmed = confirm(`Bạn có chắc chắn muốn xóa người dùng ${user.name}?`);
  if (confirmed) {
    this.deleteUser(user.iduser); // Gọi hàm xóa
  }
}

// Hàm thực hiện xóa người dùng
deleteUser(id: string): void {
  this.managerService.deleteUser(id).subscribe({
    next: () => {
      this.users = this.users.filter(user => user.iduser !== id); // Cập nhật danh sách người dùng
      console.log(`Đã xóa thông tin người dùng với id ${id}`);
    },
    error: (error) => {
      console.error('Lỗi khi xóa người dùng:', error); // Xử lý lỗi nếu có
    }
  });
}

generateNewUserId() {

  // Tạo một mảng chứa tất cả các iduser hiện tại
  const existingIds = this.users.map(user => parseInt(user.iduser.slice(1))); // Lấy phần số của iduser
  const userCount = this.users.length + 1; // Số lượng người dùng hiện tại + 1

  // Tìm số iduser nhỏ nhất bị thiếu
  for (let i = 1; i <= userCount; i++) {
    if (!existingIds.includes(i)) {
      this.newUserId = `Y${i.toString().padStart(3, '0')}`; // Định dạng Y00X
      return; // Trả về ngay khi tìm thấy số thiếu
    }
  }

  if (userCount < 10) {
    this.newUserId = `Y00${userCount}`;  // Định dạng Y00X nếu nhỏ hơn 10
  } else if (userCount < 100) {
    this.newUserId = `Y0${userCount}`;   // Định dạng Y0XX nếu nhỏ hơn 100
  } else if (userCount < 1000) {
    this.newUserId = `Y${userCount}`;    // Định dạng YXXX nếu nhỏ hơn 1000
  } else {
    console.error("Số lượng người dùng vượt quá giới hạn 999");
  }
}







}
