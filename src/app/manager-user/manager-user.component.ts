import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { ManagerUserService } from '../../service/manager-user.service';
import { User } from '../../interface/user.interface';
import { Observable, of } from 'rxjs';
import { Router, ActivatedRoute } from '@angular/router'; // Đảm bảo import đúng Router và ActivatedRoute
import { catchError, finalize, switchMap, tap } from 'rxjs/operators';
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
  displaySearchResult: User[] = []; // Khởi tạo biến để lưu kết quả tìm kiếm
  isSearchCompleted: boolean = false; // Cờ để kiểm tra kết quả tìm kiếm


  currentPage: number = 1; // Trang hiện tại
  currentUsers: User[] = []; // Danh sách người dùng hiện tại
  itemsPerPage: number = 10; // Số lượng người dùng trên mỗi trang
  totalItems: number = 0; // Tổng số người dùng
  pages: (string | number)[] = [];


  totalPages: number = 0;    // Tổng số trang




  filteredUsers: any[] = []; // Danh sách đã lọc
  statusFilter: string = ''; // Trạng thái hiện tại được lọc
  selectedStatus: string = ''; // Biến để lưu trữ trạng thái đã chọn
  selectedSalary: string = ''; // Biến để lưu trữ giá trị lương đã chọn
  searchQuery: string = ''; // Định nghĩa biến searchQuery



  isAddUserVisible = false; // Biến để theo dõi trạng thái hiển thị
  isEditUserVisible = false;
  private isFirstEdit: boolean = true; // Biến để theo dõi lần đầu tiên chọn chỉnh sửa
  isLoading = false; // Trạng thái chờ dữ liệu



  ShowAddUser() : void{
    this.isAddUserVisible = true;
    this.isEditUserVisible = false;
  }

  showFormEditUser(user: any): void {
    console.log(user.status); // Kiểm tra giá trị của user.status
    this.selectedUser = { ...user};  // Cập nhật selectedUser
    console.log(this.selectedUser); // Kiểm tra giá trị của selectedUser
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

    // this.getListUser();
    this.loadUsers();

  }




  getListUser() {
    this.managerService.getUsersWithPagination(this.currentPage, this.itemsPerPage).subscribe({
      next: (response) => {
        this.totalPages = response.totalPages;
        this.users = response.content;
        // this.applyFilter();
      },
      error: (err) => {
        console.error("Error fetching users:", err);
      }
    });

  }
  loadUsers(): void {
    this.isLoading = true;

    this.managerService
      .getUsersWithPagination(this.currentPage, this.itemsPerPage)
      .pipe(
        tap((response) => {
          this.users = response.content;
          this.totalItems = response.totalItems;
          this.totalPages = response.totalPages;
          this.applyFilters(); // Áp dụng bộ lọc sau khi tải dữ liệu
        }),
        catchError((error) => {
          console.error('Lỗi khi tải danh sách người dùng:', error);
          return of([]); // Trả về danh sách rỗng khi có lỗi
        }),
        finalize(() => (this.isLoading = false)) // Dừng trạng thái chờ dữ liệu
      )
      .subscribe();
  }






  updateCurrentPageUsers(): void {
    const start = (this.currentPage - 1) * this.itemsPerPage;
    const end = start + this.itemsPerPage;
    this.currentUsers = this.filteredUsers.slice(start, end); // Sử dụng filteredUsers thay vì users
  }




  previousPage() {
    if (this.currentPage > 1) {
      this.currentPage--; // Giảm trang
      this.loadUsers();
    }
  }

  nextPage() {
    if (this.currentPage < this.totalPages) {
      this.currentPage++; // Tăng trang
      this.loadUsers();
    }
  }

  goToPage(page: string | number) {
    // Chuyển đổi page thành số nếu đó là số, hoặc bỏ qua nếu là dấu ba chấm
    if (typeof page === 'number') {
      this.currentPage = page; // Nếu page là số, gán cho currentPage
      this.loadUsers();
    }
  }

  calculatePages(): void {
    this.pages = [];
    const startPage = Math.max(1, this.currentPage - 1);
    const endPage = Math.min(this.totalPages, this.currentPage + 1);

    if (startPage > 2) this.pages.push(1, '...');
    for (let i = startPage; i <= endPage; i++) this.pages.push(i);
    if (endPage < this.totalPages - 1) this.pages.push('...', this.totalPages);
  }


  isActive(status: string): boolean {
    return status === '1'; // Giả sử '1' là trạng thái "Hoạt động"
  }


  showFormEditUserAuto(id: string): void {
    // Nếu form đang mở và ID người dùng giống nhau, chỉ cần đóng lại
    if (this.isEditUserVisible && this.selectedUser && this.selectedUser.iduser === id) {
      this.isEditUserVisible = false;
      this.selectedUser = null; // Reset selectedUser
      return;
    }

    // Đóng form cũ trước khi mở mới
    this.isEditUserVisible = false;

    setTimeout(() => {
      // Cập nhật thông tin người dùng mới
      this.selectedUser = this.users.find(user => user.iduser === id); // Lấy người dùng theo ID
      this.isEditUserVisible = true; // Mở lại form

      // Cuộn đến form và focus vào ô nhập đầu tiên
      this.scrollToAndFocusForm();
    }, 0); // Timeout nhỏ để đảm bảo Angular cập nhật trạng thái
  }

  // Hàm cuộn đến form và focus vào ô nhập đầu tiên
  private scrollToAndFocusForm(): void {
    setTimeout(() => {
      const editFormElement = document.getElementById('editForm');
      if (editFormElement) {
        const elementPosition = editFormElement.getBoundingClientRect().top + window.scrollY;
        window.scrollTo({ top: elementPosition, behavior: 'smooth' });

        const firstInputElement = editFormElement.querySelector('input');
        if (firstInputElement) {
          (firstInputElement as HTMLElement).focus();
        }
      }
    }, 100); // Timeout nhỏ để đảm bảo DOM được render đầy đủ
  }



  onUserAdded(user: User) {
    console.log('Người dùng mới:', user);
    this.isAddUserVisible = false; // Ẩn form sau khi thêm
    this.loadUsers();

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
      this.loadUsers();
    },
    error: (error) => {
      console.error('Lỗi khi xóa người dùng:', error); // Xử lý lỗi nếu có
    }
  });
}

generateNewUserId(): void {
  this.managerService.getUserIds().subscribe(existingIds => {
    // Loại bỏ chữ 'Y' và chuyển đổi thành số
    const numericIds = existingIds.map(id => parseInt(id.slice(1), 10));

    // Tìm ID bị thiếu
    const missingId = Array.from({ length: numericIds.length + 1 }, (_, i) => i + 1)
      .find(id => !numericIds.includes(id));

    // Kiểm tra nếu missingId là undefined
    if (missingId === undefined) {
      throw new Error('Unable to generate new ID');
    }


    // Tạo ID mới
    this.newUserId = `U${missingId.toString().padStart(3, '0')}`;
    console.log(this.newUserId)
  });

}







applyFilters(): void {
  const query = this.searchQuery.trim().toLowerCase();

  this.filteredUsers = this.users.filter((user) => {
    const matchesSearchQuery =
      user.name.toLowerCase().includes(query) ||
      user.email.toLowerCase().includes(query) ||
      user.phone.toLowerCase().includes(query) ||
      user.iduser.toLowerCase().includes(query) ||
      user.typeUser?.name_type.toLowerCase().includes(query);

    const matchesStatus =
      !this.statusFilter || user.status.toString() === this.statusFilter;

    return matchesSearchQuery && matchesStatus;
  });

  this.totalItems = this.filteredUsers.length; // Cập nhật tổng số người dùng sau khi lọc
  this.calculatePages(); // Tính lại số trang
  this.updateCurrentPageUsers(); // Cập nhật danh sách hiển thị
}


onUserUpdated(updatedUser: any): void {
  const index = this.users.findIndex(user => user.iduser === updatedUser.iduser);
  if (index > -1) {
    this.users[index] = { ...updatedUser }; // Cập nhật trong danh sách chính
    this.onSearch(this.searchQuery);       // Truyền giá trị tìm kiếm hiện tại
  }
}




// onSearch(): void {
//   const query = this.searchQuery.trim().toLowerCase();

//   this.filteredUsers = this.users.filter(user =>
//     user.name.toLowerCase().includes(query) ||
//     user.email.toLowerCase().includes(query)||
//     user.iduser.toLowerCase().includes(query)||
//     user.phone.toLowerCase().includes(query)||
//     user.typeUser?.name_type.toLowerCase().includes(query)
//   );

//   this.calculatePages();  // Recalculate pages if needed
//   this.updateCurrentPageUsers();
// }

// Hàm tìm kiếm người dùng
onSearch(query: string): void {
  if (query) {
    this.managerService.getUsersBySearch(query).subscribe({
      next: (results) => {
        this.filteredUsers = results; // Cập nhật danh sách người dùng đã lọc
        this.isSearchCompleted = true; // Đánh dấu kết quả tìm kiếm đã hoàn tất
        console.log('Kết quả tìm kiếm:', results);
      },
      error: (err) => {
        console.error('Lỗi khi tìm kiếm:', err);
        this.isSearchCompleted = false; // Nếu có lỗi, ẩn kết quả tìm kiếm
      }
    });
  } else {
    this.filteredUsers = this.users;  // Nếu không có tìm kiếm, hiển thị tất cả
    this.isSearchCompleted = false; // Chưa tìm kiếm
  }
}


searchAcrossPages(query: string, pageNumber: number = 0): void {
  const pageSize = 5; // Kích thước mỗi trang
  this.managerService.getUsersWithPagination(pageNumber, pageSize).subscribe({
    next: (response: any) => {
      // Tìm kiếm trong dữ liệu của trang hiện tại
      const matchedUser = response.content.find((user: any) => user.iduser === query);

      if (matchedUser) {
        console.log('Kết quả tìm thấy:', matchedUser);
        // Gán kết quả tìm thấy vào displaySearchResult
        this.displaySearchResult = [matchedUser];
      } else if (!response.last) {
        // Nếu không phải trang cuối, tìm tiếp trên trang sau
        this.searchAcrossPages(query, pageNumber + 1);
      } else {
        console.log('Không tìm thấy kết quả!');
        // Hiển thị thông báo không tìm thấy nếu đã hết dữ liệu
        this.displaySearchResult = []; // Đặt kết quả rỗng
      }
    },
    error: (error) => {
      console.error('Lỗi khi tải dữ liệu:', error);
    }
  });
}



onStatusChange(event: Event): void {
  const selectedStatus = (event.target as HTMLSelectElement).value;
  this.filteredUsers = this.filterUsers(selectedStatus, this.selectedSalary);

  this.calculatePages(); // Cập nhật số trang
  this.updateCurrentPageUsers(); // Cập nhật danh sách người dùng hiển thị
}


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
