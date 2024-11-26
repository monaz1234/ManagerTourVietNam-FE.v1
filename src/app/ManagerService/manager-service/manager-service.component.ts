import { Component, OnInit } from '@angular/core';
import { ServiceService } from '../../../service/ServiceService/service.service';
import { Router } from '@angular/router';
import { Service } from '../../../interface/service.interface';
import { catchError, finalize, of, tap } from 'rxjs';

@Component({
  selector: 'app-manager-service',
  templateUrl: './manager-service.component.html',
  styleUrl: './manager-service.component.scss'
})
export class ManagerServiceComponent implements OnInit{

  isLoading = false;

  services: Service[] = []; // sử dụng interface
  selectedService: any;
  newServiceId: string = '';
  reversedServices: Service[] = []; // Danh sách người dùng đảo ngược
  displaySearchResult: Service[] = []; // Khởi tạo biến để lưu kết quả tìm kiếm
  isSearchCompleted: boolean = false; // Cờ để kiểm tra kết quả tìm kiếm


  currentPage: number = 1; // Trang hiện tại
  currentServices: Service[] = []; // Danh sách người dùng hiện tại
  itemsPerPage: number = 10; // Số lượng người dùng trên mỗi trang
  totalItems: number = 0; // Tổng số người dùng
  pages: (string | number)[] = [];


  totalPages: number = 0;    // Tổng số trang




  filteredServices: any[] = []; // Danh sách đã lọc
  statusFilter: string = ''; // Trạng thái hiện tại được lọc
  selectedStatus: string = ''; // Biến để lưu trữ trạng thái đã chọn
  selectedSalary: string = ''; // Biến để lưu trữ giá trị lương đã chọn
  searchQuery: string = ''; // Định nghĩa biến searchQuery



  isAddServiceVisible = false; // Biến để theo dõi trạng thái hiển thị
  isEditServiceVisible = false;
  private isFirstEdit: boolean = true; // Biến để theo dõi lần đầu tiên chọn chỉnh sửa



  ShowAddService() : void{
    this.isAddServiceVisible = true;
    this.isEditServiceVisible = false;
  }

  showFormEditService(service: any): void {
    console.log(service.status); // Kiểm tra giá trị của user.status
    this.selectedService = { ...service};  // Cập nhật selectedUser
    console.log(this.selectedService); // Kiểm tra giá trị của selectedUser
    this.isAddServiceVisible = false;
    this.isEditServiceVisible = true;
  }

  formatSalary(salary: number): string {
    return salary.toLocaleString('vi-VN') + ' đ';
  }



  toggleAddService(): void {
    this.isAddServiceVisible = !this.isAddServiceVisible;
    this.isEditServiceVisible = false;
    if (this.isAddServiceVisible) {
      this.generateNewServiceId(); // Tạo mã ID mới khi hiển thị form thêm
    } else {
      this.selectedService = null; // Reset người dùng đã chọn nếu có
    }
  }





  ngOnInit(): void {


    this.loadServices();

  }

  constructor(
    private managarService: ServiceService,
    private router : Router
  ){}
  loadServices(): void {
    this.isLoading = true;

    this.managarService
      .getServicesWithPagination(this.currentPage, this.itemsPerPage)
      .pipe(
        tap((response) => {
          this.services = response.content;
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


  applyFilters(): void {
    const query = this.searchQuery.trim().toLowerCase();

    this.filteredServices = this.services.filter((service) => {
      const matchesSearchQuery =
      service.name_service.toLowerCase().includes(query) ||
      service.description.toLowerCase().includes(query) ||
      service.plant.toLowerCase().includes(query)
      const matchesStatus =
        !this.statusFilter || service.status.toString() === this.statusFilter;

      return matchesSearchQuery && matchesStatus;
    });

    this.totalItems = this.filteredServices.length; // Cập nhật tổng số người dùng sau khi lọc
    this.calculatePages(); // Tính lại số trang
    this.updateCurrentPageServices(); // Cập nhật danh sách hiển thị
  }



  updateCurrentPageServices(): void {
    const start = (this.currentPage - 1) * this.itemsPerPage;
    const end = start + this.itemsPerPage;
    this.currentServices = this.filteredServices.slice(start, end); // Sử dụng filteredUsers thay vì users
  }


  previousPage() {
    if (this.currentPage > 1) {
      this.currentPage--; // Giảm trang
      this.loadServices();
    }
  }

  nextPage() {
    if (this.currentPage < this.totalPages) {
      this.currentPage++; // Tăng trang
      this.loadServices();
    }
  }

  goToPage(page: string | number) {
    // Chuyển đổi page thành số nếu đó là số, hoặc bỏ qua nếu là dấu ba chấm
    if (typeof page === 'number') {
      this.currentPage = page; // Nếu page là số, gán cho currentPage
      this.loadServices();
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



  showFormEditServiceAuto(id: string): void {
    // Nếu form đang mở và ID người dùng giống nhau, chỉ cần đóng lại
    if (this.isEditServiceVisible && this.selectedService && this.selectedService.id_service === id) {
      this.isEditServiceVisible = false;
      this.selectedService = null; // Reset selectedUser
      return;
    }

    // Đóng form cũ trước khi mở mới
    this.isEditServiceVisible = false;

    setTimeout(() => {
      // Cập nhật thông tin người dùng mới
      this.selectedService = this.services.find(service => service.id_service === id); // Lấy người dùng theo ID
      this.isEditServiceVisible = true; // Mở lại form

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



  onServiceAdded(service: Service) {
    console.log('Người dùng mới:', service);
    this.isAddServiceVisible = false; // Ẩn form sau khi thêm
    this.loadServices();

  }


  editService(id: string): void {
    this.managarService.findService(id).subscribe({
      next: (service) => {
        this.selectedService = service; // Gán thông tin người dùng vào selectedUser
        this.isAddServiceVisible = false;
        this.isEditServiceVisible = true;
      },
      error: (error) => {
        console.error('Lỗi khi lấy thông tin người dùng:', error);
      }
    });
  }

  confirmDelete(service: any): void {
    const confirmed = confirm(`Bạn có chắc chắn muốn xóa người dùng ${service.name_service}?`);
    if (confirmed) {
      this.deleteService(service.id_service); // Gọi hàm xóa
    }
  }

  // Hàm thực hiện xóa người dùng
  deleteService(id: string): void {
    this.managarService.deleteService(id).subscribe({
      next: () => {
        this.services = this.services.filter(service => service.id_service !== id); // Cập nhật danh sách người dùng
        console.log(`Đã xóa thông tin người dùng với id ${id}`);
        this.loadServices();
      },
      error: (error) => {
        console.error('Lỗi khi xóa người dùng:', error); // Xử lý lỗi nếu có
      }
    });
  }

  generateNewServiceId(): void {
    this.managarService.getServiceIds().subscribe(existingIds => {
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
      this.newServiceId = `S${missingId.toString().padStart(3, '0')}`;
      console.log(this.newServiceId)
    });


  }



  onServiceUpdated(updatedService: any): void {
    const index = this.services.findIndex(service => service.id_service === updatedService.id_service);
    if (index > -1) {
      this.services[index] = { ...updatedService }; // Cập nhật trong danh sách chính
      this.onSearch(this.searchQuery);       // Truyền giá trị tìm kiếm hiện tại
    }
  }




  onSearch(query: string): void {
    if (query) {
      this.managarService.getServicesBySearch(query).subscribe({
        next: (results) => {
          this.filteredServices = results; // Cập nhật danh sách người dùng đã lọc
          this.isSearchCompleted = true; // Đánh dấu kết quả tìm kiếm đã hoàn tất
          console.log('Kết quả tìm kiếm:', results);
        },
        error: (err) => {
          console.error('Lỗi khi tìm kiếm:', err);
          this.isSearchCompleted = false; // Nếu có lỗi, ẩn kết quả tìm kiếm
        }
      });
    } else {
      this.filteredServices = this.services;  // Nếu không có tìm kiếm, hiển thị tất cả
      this.isSearchCompleted = false; // Chưa tìm kiếm
    }
  }


  searchAcrossPages(query: string, pageNumber: number = 0): void {
    const pageSize = 5; // Kích thước mỗi trang
    this.managarService.getServicesWithPagination(pageNumber, pageSize).subscribe({
      next: (response: any) => {
        // Tìm kiếm trong dữ liệu của trang hiện tại
        const matchedService = response.content.find((service: any) => service.id_service === query);

        if (matchedService) {
          console.log('Kết quả tìm thấy:', matchedService);
          // Gán kết quả tìm thấy vào displaySearchResult
          this.displaySearchResult = [matchedService];
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

    // Use a separate method for filtering
    this.filteredServices = this.filterServices(selectedStatus, this.selectedSalary);

    this.calculatePages(); // Cập nhật số trang
    this.updateCurrentPageServices(); // Cập nhật danh sách người dùng hiển thị
  }

  filterServices(selectedStatus: string, selectedSalary: string): any[] {
    return this.services.filter(service => {
      const matchesStatus = selectedStatus ? service.status.toString() === selectedStatus : true;
      return matchesStatus;
    });
  }

  openEditForm(service: any) {
    this.selectedService = service;
    this.isEditServiceVisible = true;
  }
  updateSelectedService(service: any) {
    this.selectedService = service; // Cập nhật người dùng đang được chỉnh sửa
  }

  // Hàm để đóng form chỉnh sửa sau khi lưu
  handleCloseEditForm() {
    this.isEditServiceVisible = false;
    this.updateSelectedService(null); // Reset lại người dùng đã chọn
  }





}
