import { TypeTour } from './../../../interface/typeTour.interface';
import { Component, OnInit, Type } from '@angular/core';
import { TourService } from '../../../service/tour/tour.service';
import { Router } from '@angular/router';
import { Tour } from '../../../interface/tour.interface';
import { catchError, finalize, of, tap } from 'rxjs';

@Component({
  selector: 'app-manager-tour',
  templateUrl: './manager-tour.component.html',
  styleUrl: './manager-tour.component.scss'
})
export class ManagerTourComponent implements OnInit{

  tours: Tour[] = []; // sử dụng interface
  typeTour: TypeTour[] = [];



  selectedTour: any;
  newTourId: string = '';
  reversedTour: Tour[] = []; // Danh sách người dùng đảo ngược
  displaySearchResult: Tour[] = []; // Khởi tạo biến để lưu kết quả tìm kiếm
  isSearchCompleted: boolean = false; // Cờ để kiểm tra kết quả tìm kiếm


  currentPage: number = 1; // Trang hiện tại
  currentTour: Tour[] = []; // Danh sách người dùng hiện tại
  itemsPerPage: number = 10; // Số lượng người dùng trên mỗi trang
  totalItems: number = 0; // Tổng số người dùng
  pages: (string | number)[] = [];


  totalPages: number = 0;    // Tổng số trang



  filteredTour: any[] = []; // Danh sách đã lọc
  statusFilter: string = ''; // Trạng thái hiện tại được lọc
  selectedStatus: string = ''; // Biến để lưu trữ trạng thái đã chọn
  selectedSalary: string = ''; // Biến để lưu trữ giá trị lương đã chọn
  searchQuery: string = ''; // Định nghĩa biến searchQuery





  isAddTourVisible = false; // Biến để theo dõi trạng thái hiển thị
  isEditTourVisible = false;
  private isFirstEdit: boolean = true; // Biến để theo dõi lần đầu tiên chọn chỉnh sửa
  isLoading = false; // Trạng thái chờ dữ liệu


  ShowAddUser() : void{
    this.isAddTourVisible = false;
  }

  showFormEditTour(tour: any): void {
    console.log(tour.status); // Kiểm tra giá trị của user.status
    this.selectedTour = { ...tour};  // Cập nhật selectedUser
    console.log(this.selectedTour); // Kiểm tra giá trị của selectedUser
    this.isAddTourVisible = false;
    this.isEditTourVisible = true;
  }



  formatSalary(salary: number): string {
    return salary.toLocaleString('vi-VN') + ' đ';
  }




  // Hàm hiển thị form thêm người dùng và tạo id mới
toggleAddTour(): void {
  this.isAddTourVisible = !this.isAddTourVisible;
  this.isEditTourVisible = false;
  if (this.isAddTourVisible) {
    this.generateNewTourId(); // Tạo mã ID mới khi hiển thị form thêm
  } else {
    this.selectedTour = null; // Reset người dùng đã chọn nếu có
  }
}


  constructor(private managerTourService: TourService, private router: Router){}


  ngOnInit(): void {

    // this.getListUser();
    this.loadTours();

  }

  viewTourDetail(idtour: string): void {
    this.router.navigate(['/admin/tour/add/detail/',idtour]);
    console.log("Đã click vào: " + idtour);
  }

  loadTours(): void {
    this.isLoading = true;

    this.managerTourService
      .getToursWithPagination(this.currentPage, this.itemsPerPage)
      .pipe(
        tap((response) => {
          this.tours = response.content;
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

    this.filteredTour = this.tours.filter((tour) => {
      const matchesSearchQuery =
        tour.tourname.toLowerCase().includes(query) ||
        tour.idtour.toLowerCase().includes(query) ||
        tour.idtour_type.toLowerCase().includes(query);
        // tour.idtour_type?.name_type.toLowerCase().includes(query);
        // user.typeUser?.name_type.toLowerCase().includes(query);

      const matchesStatus =
        !this.statusFilter || tour.status.toString() === this.statusFilter;

      return matchesSearchQuery && matchesStatus;
    });

    this.totalItems = this.filteredTour.length; // Cập nhật tổng số người dùng sau khi lọc
    this.calculatePages(); // Tính lại số trang
    this.updateCurrentPageTours(); // Cập nhật danh sách hiển thị
  }


  updateCurrentPageTours(): void {
    const start = (this.currentPage - 1) * this.itemsPerPage;
    const end = start + this.itemsPerPage;
    this.currentTour = this.filteredTour.slice(start, end); // Sử dụng filteredUsers thay vì users
  }




  previousPage() {
    if (this.currentPage > 1) {
      this.currentPage--; // Giảm trang
      this.loadTours();
    }
  }

  nextPage() {
    if (this.currentPage < this.totalPages) {
      this.currentPage++; // Tăng trang
      this.loadTours();
    }
  }

  goToPage(page: string | number) {
    // Chuyển đổi page thành số nếu đó là số, hoặc bỏ qua nếu là dấu ba chấm
    if (typeof page === 'number') {
      this.currentPage = page; // Nếu page là số, gán cho currentPage
      this.loadTours();
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


  showFormEditTourAuto(id: string): void {
    // Nếu form đang mở và ID người dùng giống nhau, chỉ cần đóng lại
    if (this.isEditTourVisible && this.selectedTour && this.selectedTour.iduser === id) {
      this.isEditTourVisible = false;
      this.selectedTour = null; // Reset selectedUser
      return;
    }
     // Đóng form cũ trước khi mở mới
     this.isEditTourVisible = false;

     setTimeout(() => {
       // Cập nhật thông tin người dùng mới
       this.selectedTour = this.tours.find(tour => tour.idtour === id); // Lấy người dùng theo ID
       this.isEditTourVisible = true; // Mở lại form

       // Cuộn đến form và focus vào ô nhập đầu tiên
       this.scrollToAndFocusForm();
     }, 0); // Timeout nhỏ để đảm bảo Angular cập nhật trạng thái



  }
   // Hàm cuộn đến form và focus vào ô nhập đầu tiên
   private scrollToAndFocusForm(): void {
    setTimeout(() => {
      const editFormElement = document.getElementById('editFormTour');
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


  onTourAdded(tour : Tour) {
    console.log('Người dùng mới:', tour);
    this.isAddTourVisible = false; // Ẩn form sau khi thêm
    this.loadTours();

  }


  editTour(id: string): void {
    this.managerTourService.findTour(id).subscribe({
      next: (tour) => {
        this.selectedTour = tour; // Gán thông tin người dùng vào selectedUser
        this.isAddTourVisible = false;
        this.isEditTourVisible = true;
      },
      error: (error) => {
        console.error('Lỗi khi lấy thông tin người dùng:', error);
      }
    });
  }

  // Hàm xác nhận và xóa người dùng
confirmDelete(tour: any): void {
  const confirmed = confirm(`Bạn có chắc chắn muốn xóa người dùng ${tour.tourname}?`);
  if (confirmed) {
    this.deleteTour(tour.idtour); // Gọi hàm xóa
  }
}

// Hàm thực hiện xóa người dùng
deleteTour(id: string): void {
  this.managerTourService.deleteTour(id).subscribe({
    next: () => {
      this.tours = this.tours.filter(tour => tour.idtour !== id); // Cập nhật danh sách người dùng
      console.log(`Đã xóa thông tin người dùng với id ${id}`);
      this.loadTours();
    },
    error: (error) => {
      console.error('Lỗi khi xóa người dùng:', error); // Xử lý lỗi nếu có
    }
  });
}

generateNewTourId(): void {
  this.managerTourService.getTourIds().subscribe(existingIds => {
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
    this.newTourId = `T${missingId.toString().padStart(3, '0')}`;
    console.log(this.newTourId)
  });

}

onTourUpdated(updatedTour: any): void {
  const index = this.tours.findIndex(tour => tour.idtour === updatedTour.idtour);
  if (index > -1) {
    this.tours[index] = { ...updatedTour }; // Cập nhật trong danh sách chính
    // this.onSearch(this.searchQuery);       // Truyền giá trị tìm kiếm hiện tại
  }
}

// onSearch(query: string): void {
//   if (query) {
//     this.managerTourService.getTourById(query).subscribe({
//       next: (results) => {
//         this.filteredTour = results; // Cập nhật danh sách người dùng đã lọc
//         this.isSearchCompleted = true; // Đánh dấu kết quả tìm kiếm đã hoàn tất
//         console.log('Kết quả tìm kiếm:', results);
//       },
//       error: (err) => {
//         console.error('Lỗi khi tìm kiếm:', err);
//         this.isSearchCompleted = false; // Nếu có lỗi, ẩn kết quả tìm kiếm
//       }
//     });
//   } else {
//     this.filteredUsers = this.users;  // Nếu không có tìm kiếm, hiển thị tất cả
//     this.isSearchCompleted = false; // Chưa tìm kiếm
//   }
// }


searchAcrossPages(query: string, pageNumber: number = 0): void {
  const pageSize = 5; // Kích thước mỗi trang
  this.managerTourService.getToursWithPagination(pageNumber, pageSize).subscribe({
    next: (response: any) => {
      // Tìm kiếm trong dữ liệu của trang hiện tại
      const matchedTour = response.content.find((tour: any) => tour.idtour === query);

      if (matchedTour) {
        console.log('Kết quả tìm thấy:', matchedTour);
        // Gán kết quả tìm thấy vào displaySearchResult
        this.displaySearchResult = [matchedTour];
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
  this.filteredTour = this.filteredTourBy(selectedStatus);

  this.calculatePages(); // Cập nhật số trang
  this.updateCurrentPageTours(); // Cập nhật danh sách người dùng hiển thị
}


filteredTourBy(selectedStatus: string) {
  return this.tours.filter(tour => {
    const matchesStatus = selectedStatus ? tour.status.toString() === selectedStatus : true;
    return matchesStatus;
  });
}

openEditForm(tour: any) {
  this.selectedTour = tour;
  this.isEditTourVisible = true;
}
updateSelectedUser(tour: any) {
  this.selectedTour = tour; // Cập nhật người dùng đang được chỉnh sửa
}

// Hàm để đóng form chỉnh sửa sau khi lưu
handleCloseEditForm() {
  this.isEditTourVisible = false;
  this.updateSelectedUser(null); // Reset lại người dùng đã chọn
}










}
