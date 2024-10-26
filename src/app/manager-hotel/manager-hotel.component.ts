import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { Hotel } from '../../interface/hotel.interface';
import { ManagerHotelService } from '../../service/hotel/manager-hotel.service';

@Component({
  selector: 'app-manager-hotel',
  templateUrl: './manager-hotel.component.html',
  styleUrl: './manager-hotel.component.scss'
})
export class ManagerHotelComponent {

  hotels : Hotel[] = [];
  selectedHotel: any;
  newHotelId: string = '';

  currentPage: number = 1; // Trang hiện tại
  currentHotels: Hotel[] = []; // Danh sách người dùng hiện tại
  itemsPerPage: number = 10; // Số lượng người dùng trên mỗi trang
  totalItems: number = 0; // Tổng số người dùng
  pages: number[] = []; // Mảng lưu trang

  isAddHotelVisible =false;

  toggleAddHotel(): void {
    this.isAddHotelVisible = !this.isAddHotelVisible;
    if(this.isAddHotelVisible){
      this.generateNewHotelId();
    }
  }

  constructor(
    private managerService: ManagerHotelService
  ){}

  ngOnInit(): void {
    this.getListHotel();
  }

  getImageHotelUrl(imageName: string): string {
    return `http://localhost:9000/api/hotel/images/${imageName}`;
  }

  getListHotel(){
    this.managerService.hotels$.subscribe((data: Hotel[]) =>{
      this.hotels = data;
      this.totalItems = data.length; // Cập nhật tổng số người dùng
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

  isActive(status: string): boolean {
    return status === '1';
  }

  editHotel(hotel: Hotel): void {
    this.selectedHotel = { ...hotel};
    console.log("Chinh sua thong tin khach san");
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


}
