import { Component, OnInit } from '@angular/core';
import { ManagerUserService } from '../../service/manager-user.service';
import { User } from '../../interface/user.interface';
import { Observable } from 'rxjs';
import { Router, ActivatedRoute } from '@angular/router'; // Đảm bảo import đúng Router và ActivatedRoute
import { flush } from '@angular/core/testing';

@Component({
  selector: 'app-manager-user',
  templateUrl: './manager-user.component.html',
  styleUrl: './manager-user.component.scss'
})


export class ManagerUserComponent implements OnInit{




  users: User[] = []; // sử dụng interface
  selectedUser: any;
  newUserId: string = '';
  reversedUsers: User[] = []; // Danh sách người dùng đảo ngược



  currentPage: number = 1; // Trang hiện tại
  currentUsers: User[] = []; // Danh sách người dùng hiện tại
  itemsPerPage: number = 10; // Số lượng người dùng trên mỗi trang
  totalItems: number = 0; // Tổng số người dùng
  pages: number[] = []; // Mảng lưu trang


  filteredUsers: any[] = []; // Danh sách đã lọc
  statusFilter: string = ''; // Trạng thái hiện tại được lọc
  selectedStatus: string = ''; // Biến để lưu trữ trạng thái đã chọn
  selectedSalary: string = ''; // Biến để lưu trữ giá trị lương đã chọn
  searchQuery: string = ''; // Định nghĩa biến searchQuery



  isAddUserVisible = false; // Biến để theo dõi trạng thái hiển thị
  isEditUserVisible = false;
  private isFirstEdit: boolean = true; // Biến để theo dõi lần đầu tiên chọn chỉnh sửa



  ShowAddUser() : void{
    this.isAddUserVisible = true;
    this.isEditUserVisible = false;
  }

  showFormEditUser(user: any): void {
    console.log(user.status); // Kiểm tra giá trị của user.status
    this.selectedUser = { ...user };
    this.isAddUserVisible = false;
    this.isEditUserVisible = true;
  }


  formatSalary(salary: number): string {
    return salary.toLocaleString('vi-VN') + ' đ';
  }




  // Hàm hiển thị form thêm người dùng và tạo id mới
toggleAddUser(): void {
  this.isAddUserVisible = !this.isAddUserVisible;
  this.isEditUserVisible = false;
  if (this.isAddUserVisible) {
    this.generateNewUserId(); // Tạo mã ID mới khi hiển thị form thêm
  } else {
    this.selectedUser = null; // Reset người dùng đã chọn nếu có
  }
}






  constructor(private managerService: ManagerUserService, private router: Router){

  }
  ngOnInit(): void {
    this.getListUser();

  }




  getListUser() {
    this.managerService.users$.subscribe((data: User[]) => {
      this.users = data; // Cập nhật danh sách người dùng
      console.log(this.users);

      this.totalItems = data.length; // Cập nhật tổng số người dùng
      this.applyFilter(); // Áp dụng bộ lọc ngay sau khi nhận dữ liệu
      this.calculatePages(); // Tính số trang


      // Cập nhật người dùng hiển thị trên trang hiện tại (nếu cần)
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
    return status === '1'; // Giả sử '1' là trạng thái "Hoạt động"
  }


  showFormEditUserAuto(id: string): void {
    if (this.selectedUser && this.selectedUser.iduser === id) {
      this.isEditUserVisible = false;
      this.selectedUser = null; // Đặt lại selectedUser
    } else {
      this.editUser(id);
      this.isEditUserVisible = true; // Đảm bảo form được hiện thị

      setTimeout(() => {
        const editFormElement = document.getElementById('editForm');
        if (editFormElement) {
          const elementPosition = editFormElement.getBoundingClientRect().top + window.scrollY;
          window.scrollTo({ top: elementPosition, behavior: 'smooth' });

          const firstInputElement = editFormElement.querySelector('input');
          if (firstInputElement) {
            firstInputElement.focus();
          }
        }
      }, 100);
    }
  }




  editUser(id: string): void {
    this.managerService.findUser(id).subscribe({
      next: (user) => {
        this.selectedUser = user; // Gán thông tin người dùng vào selectedUser
        this.isAddUserVisible = false;
        this.isEditUserVisible = true;
      },
      error: (error) => {
        console.error('Lỗi khi lấy thông tin người dùng:', error);
      }
    });
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
    this.newUserId = `U00${userCount}`;  // Định dạng Y00X nếu nhỏ hơn 10
  } else if (userCount < 100) {
    this.newUserId = `U0${userCount}`;   // Định dạng Y0XX nếu nhỏ hơn 100
  } else if (userCount < 1000) {
    this.newUserId = `U${userCount}`;    // Định dạng YXXX nếu nhỏ hơn 1000
  } else {
    console.error("Số lượng người dùng vượt quá giới hạn 999");
  }
}



applyFilter(): void {
  const query = this.searchQuery.trim().toLowerCase(); // Normalize search input

  this.filteredUsers = this.users.filter(user => {
    const matchesStatus = this.statusFilter === '' || user.status.toString() === this.statusFilter;

    const matchesSearchQuery =
      user.name.toLowerCase().includes(query) ||
      user.email.toLowerCase().includes(query)||
      user.phone.toLowerCase().includes(query)||
      user.iduser.toLowerCase().includes(query);

    return matchesStatus && matchesSearchQuery; // Must match both conditions
  });

  this.filteredUsers = this.filteredUsers.reverse(); // Reverse the filtered list
}

onUserUpdated(updatedUser: any): void {
  const index = this.users.findIndex(user => user.iduser === updatedUser.iduser);
  if (index > -1) {
    this.users[index] = { ...updatedUser };  // Cập nhật trong danh sách chính
    this.onSearch();  // Làm mới kết quả tìm kiếm để hiển thị ngay
  }
}



onSearch(): void {
  const query = this.searchQuery.trim().toLowerCase();

  this.filteredUsers = this.users.filter(user =>
    user.name.toLowerCase().includes(query) ||
    user.email.toLowerCase().includes(query)||
    user.iduser.toLowerCase().includes(query)||
    user.phone.toLowerCase().includes(query)
  );

  this.calculatePages();  // Recalculate pages if needed
  this.updateCurrentPageUsers();  // Update the display with filtered results
}

onStatusChange(event: Event): void {
  const selectedStatus = (event.target as HTMLSelectElement).value;
  this.filteredUsers = this.filterUsers(selectedStatus, this.selectedSalary);

  this.calculatePages(); // Cập nhật số trang
  this.updateCurrentPageUsers(); // Cập nhật danh sách người dùng hiển thị
}

// onSalaryChange(event: Event): void {
//   this.selectedSalary = (event.target as HTMLSelectElement).value;
//   this.filteredUsers = this.filterUsers(this.selectedStatus, this.selectedSalary);

//   this.calculatePages(); // Cập nhật số trang
//   this.updateCurrentPageUsers(); // Cập nhật danh sách người dùng hiển thị
// }





filterUsers(selectedStatus: string, selectedSalary: string) {
  return this.users.filter(user => {
    const matchesStatus = selectedStatus ? user.status.toString() === selectedStatus : true;
    return matchesStatus;
  });
}

openEditForm(user: any) {
  this.selectedUser = user;
  this.isEditUserVisible = true;
}
updateSelectedUser(user: any) {
  this.selectedUser = user; // Cập nhật người dùng đang được chỉnh sửa
}

// Hàm để đóng form chỉnh sửa sau khi lưu
handleCloseEditForm() {
  this.isEditUserVisible = false;
  this.updateSelectedUser(null); // Reset lại người dùng đã chọn
}








}
