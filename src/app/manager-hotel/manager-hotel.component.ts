import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { Hotel } from '../../interface/hotel.interface';
import { ManagerHotelService } from '../../service/hotel/manager-hotel.service';
import { Router, ActivatedRoute } from '@angular/router'; // Đảm bảo import đúng Router và ActivatedRoute
import { flush } from '@angular/core/testing';
@Component({
  selector: 'app-manager-hotel',
  templateUrl: './manager-hotel.component.html',
  styleUrl: './manager-hotel.component.scss'
})
export class ManagerHotelComponent implements OnInit{

  hotels : Hotel[] = [];
  selectedHotel: any;
  newHotelId: string = '';
  reversedHotels: Hotel[] = []; // Danh sách người dùng đảo ngược

  currentPage: number = 1; // Trang hiện tại
  currentHotels: Hotel[] = []; // Danh sách người dùng hiện tại
  itemsPerPage: number = 10; // Số lượng người dùng trên mỗi trang
  totalItems: number = 0; // Tổng số người dùng
  pages: number[] = []; // Mảng lưu trang


  filteredHotels: any[] = []; // Danh sách đã lọc
  statusFilter: string = ''; // Trạng thái hiện tại được lọc
  selectedStatus: string = ''; // Biến để lưu trữ trạng thái đã chọn
  selectedSalary: string = ''; // Biến để lưu trữ giá trị lương đã chọn
  searchQuery: string = ''; // Định nghĩa biến searchQuery


  isAddHotelVisible =false;
  isEditHotelVisible = false;
  private isFirstEdit: boolean = true; // Biến để theo dõi lần đầu tiên chọn chỉnh sửa

  ShowAddHotel() : void{
    this.isAddHotelVisible = true;
    this.isEditHotelVisible = false;
  }

  ShowFormEditHotel(hotel: any): void {
    console.log(hotel.status); // Kiểm tra giá trị của user.status
    this.selectedHotel = { ...hotel };
    this.isAddHotelVisible = false;
    this.isEditHotelVisible = true
  }

  toggleAddHotel(): void {
    this.isAddHotelVisible = !this.isAddHotelVisible;
    this.isEditHotelVisible = false;
    if(this.isAddHotelVisible){
      this.generateNewHotelId();
    }else{
      this.selectedHotel = null;
    }
  }

  formatSalary(salary: number): string {
    return salary.toLocaleString('vi-VN') + ' đ';
  }

  constructor(
    private managerService: ManagerHotelService,
    private router: Router
  ){}

  ngOnInit(): void {
    this.getListHotel();
  }

  getImageHotelUrl(imageName: string): string {
    const imageString = imageName + ".png";
    return `http://localhost:9000/api/hotel/images/${imageString}`;
  }

  getListHotel(){
    this.managerService.hotels$.subscribe((data: Hotel[]) =>{
      this.hotels = data;
      this.totalItems = data.length; // Cập nhật tổng số người dùng
      this.applyFilter(); // Áp dụng bộ lọc ngay sau khi nhận dữ liệu
      this.calculatePages(); // Tính số trang
      this.updateCurrentPageUsers(); // Cập nhật người dùng hiển thị trên trang hiện tại
    })
  }

  updateCurrentPageUsers(): void {
    const start = (this.currentPage - 1) * this.itemsPerPage;
    const end = start + this.itemsPerPage;
    this.currentHotels = this.hotels.slice(start, end);
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
    return status === '1';
  }

  showFormEditHotelAuto(id: string): void {
    if (this.selectedHotel && this.selectedHotel.id_hotel === id) {
      this.isEditHotelVisible = false;
      this.selectedHotel = null; // Đặt lại selectedUser
    } else {
      this.editHotel(id);
      this.isEditHotelVisible = true; // Đảm bảo form được hiện thị

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

  editHotel(id: string): void {
    this.managerService.findHotel(id).subscribe({
      next: (hotel) => {
        this.selectedHotel = hotel;
        this.isAddHotelVisible = false;
        this.isEditHotelVisible = true;
      },
      error: (error: any) => {
        console.log('Lỗi khi lấy dữ liệu người dùng', error);
      }
    });
  }

  confirmDeleteHotel(hotel: Hotel): void {
    const confirmed = confirm(`Bạn có chắc chắn muốn xóa người dùng ${hotel.name_hotel}?`);
    if (confirmed) {
      this.deleteHotel(hotel);
    }
  }

  deleteHotel(hotel: Hotel): void {
    this.managerService.deleteHotel(hotel.id_hotel).subscribe({
      next: () => {
        this.hotels = this.hotels.filter((item) => item.id_hotel !== hotel.id_hotel);
        console.log('Xóa phương tiện thành công');
      },
      error: (error: any) => {
        console.log('Xóa phương tiện thất bại', error);
      }
    });
    this.managerService.deleteImage(hotel.image);
  }


  generateNewHotelId(): void {
    const existingIds = this.hotels.map(hotels => parseInt(hotels.id_hotel.slice(1))); // Lấy phần số của iduser
    const vehicleCount = this.hotels.length+1;

    for (let i = 1; i <= vehicleCount; i++) {
      if (!existingIds.includes(i)) {
        this.newHotelId = 'H' + i.toString().padStart(3, '0');
        return;
      }
    }

    if (vehicleCount < 10) {
      this.newHotelId = `H00${vehicleCount}`;  // Định dạng H00X nếu nhỏ hơn 10
    } else if (vehicleCount < 100) {
      this.newHotelId = `H0${vehicleCount}`;   // Định dạng H0XX nếu nhỏ hơn 100
    } else if (vehicleCount < 1000) {
      this.newHotelId = `H${vehicleCount}`;    // Định dạng HXXX nếu nhỏ hơn 1000
    } else {
      console.error("Số lượng khach san vượt quá giới hạn 999");
    }
  }

  applyFilter(): void {
    const query = this.searchQuery.trim().toLowerCase(); // Normalize search input

    this.filteredHotels = this.hotels.filter(hotel => {
      const matchesStatus = this.statusFilter === '' || hotel.status.toString() === this.statusFilter;

      const matchesSearchQuery =
        hotel.name_hotel.toLowerCase().includes(query) ;

      return matchesStatus && matchesSearchQuery; // Must match both conditions
    });

    this.filteredHotels = this.filteredHotels.reverse(); // Reverse the filtered list
  }

  onHotelUpdated(updatedHotel: any): void {
    const index = this.hotels.findIndex(hotel => hotel.id_hotel === updatedHotel.id_hotel);
    if (index > -1) {
      this.hotels[index] = { ...updatedHotel };  // Cập nhật trong danh sách chính
      this.onSearch();  // Làm mới kết quả tìm kiếm để hiển thị ngay
    }
  }

  onSearch(): void {
    const query = this.searchQuery.trim().toLowerCase();

    this.filteredHotels = this.hotels.filter(hotel =>
      hotel.name_hotel.toLowerCase().includes(query)
    );

    this.calculatePages();  // Recalculate pages if needed
    this.updateCurrentPageUsers();  // Update the display with filtered results
  }

  onStatusChange(event: Event): void {
    const selectedStatus = (event.target as HTMLSelectElement).value;
    this.filteredHotels = this.filterHotels(selectedStatus, this.selectedSalary);

    this.calculatePages(); // Cập nhật số trang
    this.updateCurrentPageUsers(); // Cập nhật danh sách người dùng hiển thị
  }

  filterHotels(selectedStatus: string, selectedSalary: string) {
    return this.hotels.filter(hotel => {
      const matchesStatus = selectedStatus ? hotel.status.toString() === selectedStatus : true;
      return matchesStatus;
    });
  }

  openEditForm(user: any) {
    this.selectedHotel = user;
    this.isEditHotelVisible = true;
  }
  updateSelectedhotel(user: any) {
    this.selectedHotel = user; // Cập nhật người dùng đang được chỉnh sửa
  }

  // Hàm để đóng form chỉnh sửa sau khi lưu
  handleCloseEditForm() {
    this.isEditHotelVisible = false;
    this.updateSelectedhotel(null); // Reset lại người dùng đã chọn
  }

}
