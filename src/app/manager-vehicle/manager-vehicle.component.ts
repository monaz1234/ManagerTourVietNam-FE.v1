import { Vehicle } from '../../interface/vehicle.interface';
import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { ManagerVehicleService } from '../../service/vehicle/vehicle.service';
import { User } from '../../interface/user.interface';
import { ManagerUserService } from '../../service/manager-user.service';

@Component({
  selector: 'app-manager-vehicle',
  templateUrl: './manager-vehicle.component.html',
  styleUrl: './manager-vehicle.component.scss'
})
export class ManagerVehicleComponent implements OnInit {

  vehicles: Vehicle[] = [];
  users : User[] = [];
  selectedVehicle: any;
  newVehicleId: string = '';

  currentPage: number = 1; // Trang hiện tại
  currentVehicles: Vehicle[] = []; // Danh sách người dùng hiện tại
  itemsPerPage: number = 10; // Số lượng người dùng trên mỗi trang
  totalItems: number = 0; // Tổng số người dùng
  pages: number[] = []; // Mảng lưu trang

  isAddVehicleVisible =false;

  toggleAddVehicle(): void {
    this.isAddVehicleVisible = !this.isAddVehicleVisible;
    if(this.isAddVehicleVisible){
      this.generateNewVehicleId();
    }
  }

  constructor(
    private managerService: ManagerVehicleService,
    private managerServiceUser: ManagerUserService
  ){}


  ngOnInit(): void {
    this.getListVehicle();
    this.getListUser();
  }
  getImageUrl(imageName: string): string {
    return `http://localhost:9000/api/vehicle/images/${imageName}`;
  }



  getListVehicle(){
    this.managerService.vehicles$.subscribe((data: Vehicle[]) =>{
      this.vehicles = data;
      this.totalItems = data.length; // Cập nhật tổng số người dùng
      this.calculatePages(); // Tính số trang
      this.updateCurrentPageUsers(); // Cập nhật người dùng hiển thị trên trang hiện tại
    })
  }
  getListUser() {
    this.managerServiceUser.users$.subscribe((data: User[]) => {
      this.users = data; // Cập nhật danh sách người dùng

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

  isActive(status: string): boolean {
    return status === '1';
  }

  editVehicle(vehicle: Vehicle): void {
    this.selectedVehicle = { ...vehicle};
    console.log("Chinh sua thong tin phuong tien");

  }

  confirmDeleteVehicle(vehicle: Vehicle): void {
    const confirmed = confirm(`Bạn có chắc chắn muốn xóa người dùng ${vehicle.name_vehicles}?`);
    if (confirmed) {
      this.deleteVehicle(vehicle);
    }
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

}
