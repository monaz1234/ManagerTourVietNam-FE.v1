
import { Vehicle } from '../../interface/vehicle.interface';
import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { ManagerVehicleService } from '../../service/vehicle/vehicle.service';
import { User } from '../../interface/user.interface';
import { ManagerUserService } from '../../service/manager-user.service';

@Component({
  selector: 'app-manager-vehicle',
  templateUrl: './manager-vehicle.component.html',
  styleUrl: './manager-vehicle.component.scss',

})
export class ManagerVehicleComponent implements OnInit {

  vehicles: Vehicle[] = [];
  users : User[] = [];
  selectedVehicle: any;
  newVehicleId: string = '';
  reversedUsers: User[] = []; // Danh sách người dùng đảo ngược

  currentPage: number = 1; // Trang hiện tại
  currentVehicles: Vehicle[] = []; // Danh sách người dùng hiện tại
  itemsPerPage: number = 10; // Số lượng người dùng trên mỗi trang
  totalItems: number = 0; // Tổng số người dùng
  pages: number[] = []; // Mảng lưu trang


  filteredVehicles: any[] = []; // Danh sách đã lọc
  statusFilter: string = ''; // Trạng thái hiện tại được lọc
  selectedStatus: string = ''; // Biến để lưu trữ trạng thái đã chọn
  selectedSalary: string = ''; // Biến để lưu trữ giá trị lương đã chọn
  searchQuery: string = ''; // Định nghĩa biến searchQuery

  isAddVehicleVisible =false;
  isEditVehicleVisible = false;
  private isFirstEdit: boolean = true; // Biến để theo dõi lần đầu tiên chọn chỉnh sửa



  showAddVehicle(): void {
    this.isAddVehicleVisible = true;
    this.isEditVehicleVisible = false;
  }

  showEditVehicle(vehicle: any): void {
    console.log(vehicle.status); // Kiểm tra giá trị của user.status
    this.selectedVehicle = { ...vehicle };
    this.isAddVehicleVisible = false;
    this.isEditVehicleVisible = true;
  }

  formatSalary(salary: number): string {
    return salary.toLocaleString('vi-VN') + ' đ';
  }




  toggleAddVehicle(): void {
    this.isAddVehicleVisible = !this.isAddVehicleVisible;
    this.isEditVehicleVisible = false;
    if(this.isAddVehicleVisible){
      this.generateNewVehicleId();
    }
    else{
      this.selectedVehicle = null;
    }

    this.getListVehicle();
  }

  constructor(
    private managerService: ManagerVehicleService,
    private managerServiceUser: ManagerUserService
  ){}


  onVehicleAdded(vehicle : Vehicle) {
    console.log('Người dùng mới:', vehicle);
    this.isAddVehicleVisible = false; // Ẩn form sau khi thêm
    this.getListVehicle();

  }

  ngOnInit(): void {
    this.getListVehicle();
    this.getListUser();
  }
  getImageUrl(imageName: string): string {
    const imageString =imageName+".png";
    return `http://localhost:9000/api/vehicle/images/${imageString}`;
  }



  getListVehicle(){
    this.managerService.vehicles$.subscribe((data: Vehicle[]) =>{
      this.vehicles = data;
      this.totalItems = data.length; // Cập nhật tổng số người dùng
      this.applyFilter(); // Áp dụng bộ lọc ngay sau khi nhận dữ liệu
      this.calculatePages(); // Tính số trang
      this.updateCurrentPageUsers(); // Cập nhật người dùng hiển thị trên trang hiện tại
    })
  }
  getListUser() {
    this.managerServiceUser.users$.subscribe((data: User[]) => {
      this.users = data; // Cập nhật danh sách người dùng
      console.log('Danh sách người dùng:', this.users);

    });
  }
  getDriverName(driverId: string): string {
    const driver = this.users.find(d => d.iduser === driverId);
    return driver ? driver.name : 'Không tìm thấy';
  }
  updateCurrentPageUsers(): void {
    const start = (this.currentPage - 1) * this.itemsPerPage;
    const end = start + this.itemsPerPage;
    this.currentVehicles = this.vehicles.slice(start, end);
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

  isActive(status: any): boolean {
    return status === true;
  }


  confirmDeleteVehicle(vehicle: Vehicle): void {
    const confirmed = confirm(`Bạn có chắc chắn muốn xóa người dùng ${vehicle.name_vehicles}?`);
    if (confirmed) {
      this.deleteVehicle(vehicle);
    }
  }

  showFormEditVehicleAuto(id: string): void {
    if (this.selectedVehicle && this.selectedVehicle.id_vehicles === id) {
      this.isEditVehicleVisible = false;
      this.selectedVehicle = null; // Đặt lại selectedUser
    } else {
      this.editVehicle(id);
      this.isEditVehicleVisible = true; // Đảm bảo form được hiện thị

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


  editVehicle(id: string): void {
    this.managerService.findVehicle(id).subscribe({
      next: (vehicle) => {
        this.selectedVehicle = vehicle; // Gán thông tin người dùng vào selectedUser
        this.isAddVehicleVisible = false;
        this.isEditVehicleVisible = true;
        this.getListVehicle();
      },
      error: (error) => {
        console.error('Lỗi khi lấy thông tin người dùng:', error);
      }
    });
  }




  deleteVehicle(vehicle: Vehicle): void {
    this.managerService.deleteVehicle(vehicle.id_vehicles).subscribe({
      next: () => {
        this.vehicles = this.vehicles.filter((item) => item.id_vehicles !== vehicle.id_vehicles);
        console.log('Xóa phương tiện thành công');
      },
      error: (error: any) => {
        console.log('Xóa phương tiện thất bại', error);
      }
    });
    this.managerService.deleteImage(vehicle.image);
  }

  generateNewVehicleId(): void {
    const existingIds = this.vehicles.map(vehicles => parseInt(vehicles.id_vehicles.slice(1))); // Lấy phần số của iduser
    const vehicleCount = this.vehicles.length+1;

    for (let i = 1; i <= vehicleCount; i++) {
      if (!existingIds.includes(i)) {
        this.newVehicleId = 'V' + i.toString().padStart(3, '0');
        return;
      }
    }

    if (vehicleCount < 10) {
      this.newVehicleId = `Y00${vehicleCount}`;  // Định dạng Y00X nếu nhỏ hơn 10
    } else if (vehicleCount < 100) {
      this.newVehicleId = `Y0${vehicleCount}`;   // Định dạng Y0XX nếu nhỏ hơn 100
    } else if (vehicleCount < 1000) {
      this.newVehicleId = `Y${vehicleCount}`;    // Định dạng YXXX nếu nhỏ hơn 1000
    } else {
      console.error("Số lượng phuong tien vượt quá giới hạn 999");
    }
  }


  applyFilter(): void {
    const query = this.searchQuery.trim().toLowerCase(); // Normalize search input

    this.filteredVehicles = this.vehicles.filter(vehicle => {
      const matchesStatus = this.statusFilter === '' || vehicle.status.toString() === this.statusFilter;

      const matchesSearchQuery =
        vehicle.name_vehicles.toLowerCase().includes(query) ||
        vehicle.place_vehicles.toString().toLowerCase().includes(query)||
        vehicle.driver.toLowerCase().includes(query)||
        vehicle.id_vehicles.toLowerCase().includes(query);

      return matchesStatus && matchesSearchQuery; // Must match both conditions
    });

    this.filteredVehicles = this.filteredVehicles.reverse(); // Reverse the filtered list
  }


  onVehicleUpdated(updateVehicle: any): void {
    const index = this.vehicles.findIndex(vehicle => vehicle.id_vehicles === updateVehicle.id_vehicles);
    if (index > -1) {
      this.vehicles[index] = { ...updateVehicle };  // Cập nhật trong danh sách chính
      this.onSearch();  // Làm mới kết quả tìm kiếm để hiển thị ngay
    }
  }

  onSearch(): void {
    const query = this.searchQuery.trim().toLowerCase();

    this.filteredVehicles = this.vehicles.filter(vehicle =>
      vehicle.name_vehicles.toLowerCase().includes(query) ||
      vehicle.place_vehicles.toString().toLowerCase().includes(query)||
      vehicle.driver.toLowerCase().includes(query)||
      vehicle.id_vehicles.toLowerCase().includes(query)
    );

    this.calculatePages();  // Recalculate pages if needed
    this.updateCurrentPageUsers();  // Update the display with filtered results
  }

  onStatusChange(event: Event): void {
    const selectedStatus = (event.target as HTMLSelectElement).value;
    this.filteredVehicles = this.filterVehicles(selectedStatus, this.selectedSalary);

    this.calculatePages(); // Cập nhật số trang
    this.updateCurrentPageUsers(); // Cập nhật danh sách người dùng hiển thị
  }


  filterVehicles(selectedStatus: string, selectedSalary: string) {
    return this.vehicles.filter(vehicle => {
      const matchesStatus = selectedStatus ? vehicle.status.toString() === selectedStatus : true;
      return matchesStatus;
    });
  }
  // showFormEditUserAuto(id: string): void {
  //   if (this.selectedUser && this.selectedUser.iduser === id) {
  //     this.isEditUserVisible = false;
  //     this.selectedUser = null; // Đặt lại selectedUser
  //   } else {
  //     this.editUser(id);
  //     this.isEditUserVisible = true; // Đảm bảo form được hiện thị

  //     setTimeout(() => {
  //       const editFormElement = document.getElementById('editForm');
  //       if (editFormElement) {
  //         const elementPosition = editFormElement.getBoundingClientRect().top + window.scrollY;
  //         window.scrollTo({ top: elementPosition, behavior: 'smooth' });

  //         const firstInputElement = editFormElement.querySelector('input');
  //         if (firstInputElement) {
  //           firstInputElement.focus();
  //         }
  //       }
  //     }, 100);
  //   }
  // }




  // editUser(id: string): void {
  //   this.managerService.findUser(id).subscribe({
  //     next: (user) => {
  //       this.selectedUser = user; // Gán thông tin người dùng vào selectedUser
  //       this.isAddUserVisible = false;
  //       this.isEditUserVisible = true;
  //     },
  //     error: (error) => {
  //       console.error('Lỗi khi lấy thông tin người dùng:', error);
  //     }
  //   });
  // }
  openEditForm(vehicle: any) {
    this.selectedVehicle = vehicle;
    this.isEditVehicleVisible = true;
  }
  updateSelectedVehicle(vehicle: any) {
    this.selectedVehicle = vehicle; // Cập nhật người dùng đang được chỉnh sửa
  }

  // Hàm để đóng form chỉnh sửa sau khi lưu
  handleCloseEditForm() {
    this.isEditVehicleVisible = false;
    this.updateSelectedVehicle(null); // Reset lại người dùng đã chọn
  }


}
