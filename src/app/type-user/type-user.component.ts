import { TypeUserService } from '../../service/type_user/type-user.service';
import { Component, OnInit } from '@angular/core';
import { TypeUser } from '../../interface/typeuser.interface';

@Component({
  selector: 'app-type-user',
  templateUrl: './type-user.component.html',
  styleUrl: './type-user.component.scss'
})
export class TypeUserComponent implements OnInit{

  typeTypeUsers : TypeUser[] = [];
  selectedTypeUser: any;

  newTypeUser : string = '';



  currentPage: number = 1; // Trang hiện tại
  currentTypeUsers: TypeUser[] = []; // Danh sách người dùng hiện tại
  itemsPerPage: number = 10; // Số lượng người dùng trên mỗi trang
  totalItemTypeUser : number = 0;
  pages: number[] = []; // Mảng lưu trang


  filteredTypeUser: any[] = []; // Danh sách đã lọc
  statusFilter: string = ''; // Trạng thái hiện tại được lọc
  selectedStatus: string = ''; // Biến để lưu trữ trạng thái đã chọn
  selectedSalary: number = 0; // Biến để lưu trữ giá trị lương đã chọn
  searchQuery: string = ''; // Định nghĩa biến searchQuery



  isAddTypeUserVisible = false; // Biến để theo dõi trạng thái hiển thị
  isEditTypeUserVisible = false;
  private isFirstEdit: boolean = true; // Biến để theo dõi lần đầu tiên chọn chỉnh sửa




  ShowAddUser() : void{
    this.isAddTypeUserVisible = true;
    this.isEditTypeUserVisible = false;
  }

  showFormEditUser(typeuser: any): void {
    console.log(typeuser.status); // Kiểm tra giá trị của user.status
    this.selectedTypeUser = { ...typeuser };
    this.isAddTypeUserVisible = false;
    this.isEditTypeUserVisible = true;
  }


  formatSalary(salary: number): string {
    return salary.toLocaleString('vi-VN') + ' đ';
  }


  // Hàm hiển thị form thêm người dùng và tạo id mới
toggleAddTypeUser(): void {
  this.isAddTypeUserVisible = !this.isAddTypeUserVisible;
  this.isEditTypeUserVisible = false;
  if (this.isAddTypeUserVisible) {
    this.generateNewTypeUserId(); // Tạo mã ID mới khi hiển thị form thêm
  } else {
    this.selectedTypeUser = null; // Reset người dùng đã chọn nếu có
  }
}




  ngOnInit(): void {
      this.getListTypeUser();
  }

  constructor(private typeUserService: TypeUserService) { }

  getListTypeUser(){
    this.typeUserService.TypeUser$.subscribe((data : TypeUser[])=>{
      this.typeTypeUsers = data;
      console.log(this.typeTypeUsers);

    this.totalItemTypeUser = data.length;
    this.applyFilterTypeUser();
    this.calculatePages();

    this.updateCurrentPageUsers();

    })
  }

  updateCurrentPageUsers(): void {
    const start = (this.currentPage - 1) * this.itemsPerPage;
    const end = start + this.itemsPerPage;
    this.currentTypeUsers = this.typeTypeUsers.slice(start, end);
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
    const pageCount = Math.ceil(this.totalItemTypeUser / this.itemsPerPage);
    this.pages = Array.from({ length: pageCount }, (_, i) => i + 1);
  }




  isActive(status: string): boolean {
    return status === '1'; // Giả sử '1' là trạng thái "Hoạt động"
  }

  editTypeUser(id: string): void {
    this.typeUserService.findTypeUser(id).subscribe({
      next: (typeuser) => {
        this.selectedTypeUser = typeuser; // Gán thông tin người dùng vào selectedUser
        this.isAddTypeUserVisible = false;
        this.isEditTypeUserVisible = true;
      },
      error: (error) => {
        console.error('Lỗi khi lấy thông tin người dùng:', error);
      }
    });
  }

  showFormEditTypeUserAuto(id: string): void {
    if (this.selectedTypeUser && this.selectedTypeUser.idtypeuser === id) {
      this.isEditTypeUserVisible = false;
      this.selectedTypeUser = null; // Đặt lại selectedUser
    } else {
      this.editTypeUser(id);
      this.isEditTypeUserVisible = true; // Đảm bảo form được hiện thị

      setTimeout(() => {
        const editFormElement = document.getElementById('editTypeUserForm');
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





  applyFilterTypeUser(): void {
    const query = this.searchQuery.trim().toLowerCase(); // Normalize search input

    this.filteredTypeUser = this.typeTypeUsers.filter(typeuser => {
      const matchesStatus = this.statusFilter === '' || typeuser.status?.toString() === this.statusFilter;

      const matchesSearchQuery =
        (typeuser.name_type || '').toLowerCase().includes(query) ||
        (typeuser.power || '').toLowerCase().includes(query) ||
        typeuser.salary?.toString().includes(query) ||
        (typeuser.idtypeuser || '').toLowerCase().includes(query);

      return matchesStatus && matchesSearchQuery; // Must match both conditions
    });

    this.filteredTypeUser = this.filteredTypeUser.reverse(); // Reverse the filtered list
  }


  deleteTypeUser(id: string): void {
    this.typeUserService.deleteTypeUser(id).subscribe({
      next: () => {
        this.typeTypeUsers = this.typeTypeUsers.filter(typeuser => typeuser.idtypeuser !== id); // Cập nhật danh sách người dùng
        console.log(`Đã xóa thông tin người dùng với id ${id}`);
      },
      error: (error) => {
        console.error('Lỗi khi xóa người dùng:', error); // Xử lý lỗi nếu có
      }
    });
  }

  // Hàm xác nhận và xóa người dùng
confirmDelete(typeuser: any): void {
  const confirmed = confirm(`Bạn có chắc chắn muốn xóa người dùng ${typeuser.name_type}?`);
  if (confirmed) {
    this.deleteTypeUser(typeuser.idtypeuser); // Gọi hàm xóa
  }
}




  generateNewTypeUserId() {

    // Tạo một mảng chứa tất cả các iduser hiện tại
    const existingIds = this.typeTypeUsers.map(typeUsers => parseInt(typeUsers.idtypeuser.slice(1))); // Lấy phần số của iduser
    const userCount = this.typeTypeUsers.length + 1; // Số lượng người dùng hiện tại + 1

    // Tìm số iduser nhỏ nhất bị thiếu
    for (let i = 1; i <= userCount; i++) {
      if (!existingIds.includes(i)) {
        this.newTypeUser = `T${i.toString().padStart(3, '0')}`; // Định dạng Y00X
        return; // Trả về ngay khi tìm thấy số thiếu
      }
    }

    if (userCount < 10) {
      this.newTypeUser = `T00${userCount}`;  // Định dạng Y00X nếu nhỏ hơn 10
    } else if (userCount < 100) {
      this.newTypeUser = `T0${userCount}`;   // Định dạng Y0XX nếu nhỏ hơn 100
    } else if (userCount < 1000) {
      this.newTypeUser = `T${userCount}`;    // Định dạng YXXX nếu nhỏ hơn 1000
    } else {
      console.error("Số lượng người dùng vượt quá giới hạn 999");
    }
  }

  onUserUpdated(updatedTypeUser: any): void {
    const index = this.typeTypeUsers.findIndex(typeuser => typeuser.idtypeuser === updatedTypeUser.idtypeuser);
    if (index > -1) {
      this.typeTypeUsers[index] = { ...updatedTypeUser };  // Cập nhật trong danh sách chính
      this.onSearch();  // Làm mới kết quả tìm kiếm để hiển thị ngay
    }
  }

  onSearch(): void {
    const query = this.searchQuery.trim().toLowerCase();

    this.filteredTypeUser = this.typeTypeUsers.filter(typeuser =>
      typeuser.name_type.toLowerCase().includes(query) ||
      typeuser.idtypeuser.toLowerCase().includes(query)
    );

    this.calculatePages();  // Recalculate pages if needed
    this.updateCurrentPageUsers();  // Update the display with filtered results
  }

  onStatusChange(event: Event): void {
    const selectedStatus = (event.target as HTMLSelectElement).value;
    this.filteredTypeUser = this.filterUsers(selectedStatus, this.selectedSalary);

    this.calculatePages(); // Cập nhật số trang
    this.updateCurrentPageUsers(); // Cập nhật danh sách người dùng hiển thị
  }

  filterUsers(selectedStatus: string, selectedSalary: number) {
    return this.typeTypeUsers.filter(typeuser => {
      const matchesStatus = selectedStatus ? typeuser.status.toString() === selectedStatus : true;
      return matchesStatus;
    });
  }

  openEditTypeForm(typeuser: any) {
    this.selectedTypeUser = typeuser;
    this.isEditTypeUserVisible = true;
  }
  updateSelectedTypeUser(typeuser: any) {
    this.selectedTypeUser = typeuser; // Cập nhật người dùng đang được chỉnh sửa
  }

  // Hàm để đóng form chỉnh sửa sau khi lưu
  handleCloseEditForm() {
    this.isEditTypeUserVisible = false;
    this.updateSelectedTypeUser(null); // Reset lại người dùng đã chọn
  }


}
