import { ActivatedRoute, Router } from '@angular/router';
import { bookdetail } from '../../interface/bookdetail.interface';
import { Component, OnInit } from '@angular/core';
import { BookdetailService } from '../../service/bookdetail/bookdetail.service';
import { BookService } from '../../service/book.service';
import { ManagerPromotionService } from '../../service/promotion/manager-promotion.service';
import { catchError, finalize, of, tap } from 'rxjs';
import { Book } from '../../interface/book.interface';
import { Location } from '@angular/common';

@Component({
  selector: 'app-bookdetail',
  templateUrl: './bookdetail.component.html',
  styleUrl: './bookdetail.component.scss'
})
export class BookdetailComponent implements OnInit{

  book_details:  bookdetail[] = [];
  // books : Book[] = [];
  book : any;
  error: string | null = null; // Lỗi nếu xảy ra
  idbook: string | null = null;  // Khai báo biến idbook

  currentPage: number = 1; // Trang hiện tại
  currentBookDetais: bookdetail[] = []; // Danh sách người dùng hiện tại
  itemsPerPage: number = 5; // Số lượng người dùng trên mỗi trang
  totalItems: number = 0; // Tổng số người dùng
  totalPages: number = 0;    // Tổng số trang
  isLoading = false; // Trạng thái chờ dữ liệu

  isSearchCompleted: boolean = false; // Cờ để kiểm tra kết quả tìm kiếm

  pages: (string | number)[] = [];
  filteredBookDetail: any[] = []; // Danh sách đã lọc
  statusFilter: string = ''; // Trạng thái hiện tại được lọc
  selectedStatus: string = ''; // Biến để lưu trữ trạng thái đã chọn
  selectedSalary: string = ''; // Biến để lưu trữ giá trị lương đã chọn
  searchQuery: string = ''; // Định nghĩa biến searchQuery



  isAddBookDetailVisible = false; // Biến để theo dõi trạng thái hiển thị
  isEditBookDetailVisible = false;



  selectedBookDetail: any;
  newBookDetail: string ='';
  reversedBookDetails: bookdetail[] = [];
  displaySearchResult: bookdetail[] = [];


  ShowAddBookDetail() : void{
    this.isAddBookDetailVisible = true;
    this.isEditBookDetailVisible = false;
  }

  showFormEditBookDetail(bookDetailId: string) {
  this.bookDetailService.findBookDetail(bookDetailId).subscribe(book_detail => {
    this.selectedBookDetail = book_detail;
    this.isEditBookDetailVisible = true; // Ensure form visibility
  });
}


  toggleAddBookDetail(): void {
    this.isAddBookDetailVisible = !this.isAddBookDetailVisible;
    this.isEditBookDetailVisible = false;
    if (this.isAddBookDetailVisible) {
      this.generateNewBookDetailId(); // Tạo mã ID mới khi hiển thị form thêm
    } else {
      this.selectedBookDetail = null; // Reset người dùng đã chọn nếu có
    }
  }

  constructor(
    private router : Router,
    private bookDetailService : BookdetailService,
    private bookService : BookService,
    private route: ActivatedRoute,
    private location: Location,

  ){}
  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.idbook = params['id'];  // Lấy idBook từ params
      console.log('ID của sách:', this.idbook);

      if (this.idbook) {
        // this.fetchBookDetail(this.idbook);
        this.loadBookDetail(this.idbook);
      }
    });


  }


  fetchBookDetail(id: string): void {
    this.bookService.getBookById(id).subscribe({
      next: (data) => {
        this.book = data;
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Lỗi khi lấy chi tiết sách:', err);
        this.error = 'Không thể tải thông tin sách.';
        this.isLoading = false;
      }
    });
  }
  goBack(): void {
    this.location.back(); // Quay lại trang trước đó
  }


  // loadBookDetail(idbook: string): void {
  //   this.bookService.getBookById(idbook).subscribe({
  //     next: (data) => {
  //       this.book = data;
  //       this.isLoading = false;
  //     },
  //     error: (err) => {
  //       console.error('Lỗi khi lấy chi tiết sách:', err);
  //       this.error = 'Không thể tải thông tin sách.';
  //       this.isLoading = false;
  //     }
  //   });
  // }
  loadBookDetail(idbook: string): void {
    this.isLoading = true;

    this.bookDetailService
      .getBookDetailsByBook(idbook)  // Giả sử phương thức này nhận idbook và trả về chi tiết sách

      .pipe(
        tap((response) => {
          console.log('Dữ liệu trả về từ API:', response); // Kiểm tra dữ liệu trả về
          this.book_details = response; // Giả sử response trả về là mảng chi tiết sách
          this.applyFilterBookDetail(); // Áp dụng bộ lọc sau khi tải dữ liệu (nếu cần)
        }),
        catchError((error) => {
          console.error('Lỗi khi tải chi tiết sách:', error);
          return of([]); // Trả về danh sách rỗng khi có lỗi
        }),
        finalize(() => (this.isLoading = false)) // Dừng trạng thái chờ dữ liệu
      )
      .subscribe();
  }




  applyFilterBookDetail() : void {
    const query = this.searchQuery.trim().toLowerCase();
    this.filteredBookDetail = this.book_details.filter(bookdetail =>{


      const matchesSearchQuery =
      bookdetail.idbook?.tour?.tourname.toLowerCase().includes(query) ||
      bookdetail.promotion_code?.name.toLowerCase().includes(query) ||
      bookdetail.idbookdetail.toLowerCase().includes(query);

      return matchesSearchQuery;
    });

    this.totalItems = this.filteredBookDetail.length;
    // this.filteredAccount = this.filteredAccount.reverse();
    // this.calculatePages(); // Tính lại số trang
    // this.updateCurrentPageAccounts(); // Cập nhật danh sách hiển thị

  }

  // updateCurrentPageAccounts(): void {
  //   const start = (this.currentPage - 1) * this.itemsPerPage;
  //   const end = start + this.itemsPerPage;
  //   this.currentBookDetais = this.filteredBookDetail.slice(start, end); // Sử dụng filteredUsers thay vì users
  // }

  // goToPage(page: string | number) {
  //   // Chuyển đổi page thành số nếu đó là số, hoặc bỏ qua nếu là dấu ba chấm
  //   if (typeof page === 'number') {
  //     this.currentPage = page; // Nếu page là số, gán cho currentPage
  //     this.loadBookDetail();
  //   }
  // }
  // nextPage() {
  //   if (this.currentPage < this.totalPages) {
  //     this.currentPage++; // Tăng trang
  //     this.loadBookDetail();
  //   }
  // }

  // previousPage() {
  //   if (this.currentPage > 1) {
  //     this.currentPage--; // Giảm trang
  //     this.loadBookDetail();
  //   }
  // }


//   calculatePages(): void {
//     this.pages = [];
//     const startPage = Math.max(1, this.currentPage - 1);
//     const endPage = Math.min(this.totalPages, this.currentPage + 1);

//     if (startPage > 2) this.pages.push(1, '...');
//     for (let i = startPage; i <= endPage; i++) this.pages.push(i);
//     if (endPage < this.totalPages - 1) this.pages.push('...', this.totalPages);
// }

// showFormEditBookDetailAuto(id: string): void {
//   // Nếu form đang mở và ID người dùng giống nhau, chỉ cần đóng lại
//   if (this.isEditBookDetailVisible && this.selectedBookDetail && this.selectedBookDetail.idbookdetail === id) {
//     this.isEditBookDetailVisible = false;
//     this.selectedBookDetail = null; // Reset selectedUser
//     return;
//   }

//   // Đóng form cũ trước khi mở mới
//   this.isEditBookDetailVisible = false;

//   setTimeout(() => {
//     // Cập nhật thông tin người dùng mới
//     this.selectedBookDetail = this.book_details.find(book_detail => book_detail.idbookdetail === id); // Lấy người dùng theo ID
//     this.isEditBookDetailVisible = true; // Mở lại form

//     // Cuộn đến form và focus vào ô nhập đầu tiên
//     this.scrollToAndFocusForm();
//   }, 0); // Timeout nhỏ để đảm bảo Angular cập nhật trạng thái
// }

// // Hàm cuộn đến form và focus vào ô nhập đầu tiên
// private scrollToAndFocusForm(): void {
//   setTimeout(() => {
//     const editFormElement = document.getElementById('editForm');
//     if (editFormElement) {
//       const elementPosition = editFormElement.getBoundingClientRect().top + window.scrollY;
//       window.scrollTo({ top: elementPosition, behavior: 'smooth' });

//       const firstInputElement = editFormElement.querySelector('input');
//       if (firstInputElement) {
//         (firstInputElement as HTMLElement).focus();
//       }
//     }
//   }, 100); // Timeout nhỏ để đảm bảo DOM được render đầy đủ
// }

// onBookDetailAdd(book_detail : bookdetail){
//   console.log('Người dùng mới:', book_detail );
//   this.isAddBookDetailVisible = false; // Ẩn form sau khi thêm
//   this.loadBookDetail();
// }


// editBookDetail(id : string) : void {
//   this.bookDetailService.findBookDetail(id).subscribe({
//     next: (book_detail) =>{
//       this.selectedBookDetail = book_detail;
//       this.isAddBookDetailVisible = false;
//       this.isEditBookDetailVisible = true;
//     },
//     error: (error) =>{
//       console.error('Lỗi khi lấy thông tin tài khoản', error);
//     }
//   });
// }


  // // Hàm xác nhận và xóa người dùng
  // confirmDelete(book_detail: any): void {
  //   const confirmed = confirm(`Bạn có chắc chắn muốn xóa người dùng ${book_detail.idbookdetail}?`);
  //   if (confirmed) {
  //     this.deleteBookDetail(book_detail.idbookdetail); // Gọi hàm xóa
  //   }
  // }
  // // Hàm thực hiện xóa người dùng
  // deleteBookDetail(id: string): void {
  //   this.bookDetailService.deleteBookDetail(id).subscribe({
  //     next: () => {
  //       this.book_details = this.book_details.filter(book_detail => book_detail.idbookdetail !== id); // Cập nhật danh sách người dùng
  //       console.log(`Đã xóa thông tin tài khoản với id ${id}`);
  //       this.loadBookDetail();
  //     },
  //     error: (error) => {
  //       console.error('Lỗi khi xóa tài khoản:', error); // Xử lý lỗi nếu có
  //     }
  //   });
  // }


  generateNewBookDetailId(): void {
    this.bookDetailService.getBookDetailIds().subscribe(existingIds => {
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
      this.newBookDetail = `D${missingId.toString().padStart(3, '0')}`;
      console.log(this.newBookDetail)
    });
  }


  // onBookDetailUpdated(updatedBookDetail: any): void {
  //   const index = this.book_details.findIndex(book_detail => book_detail.idbookdetail === updatedBookDetail.idbookdetail);
  //   if (index > -1) {
  //     this.book_details[index] = { ...updatedBookDetail };  // Cập nhật trong danh sách chính
  //     this.onSearch(this.searchQuery);  // Làm mới kết quả tìm kiếm để hiển thị ngay
  //   }
  // }


  // onSearch(query: string): void {
  //   if (query) {
  //     this.bookDetailService.getBookDetailBySearch(query).subscribe({
  //       next: (results) => {
  //         this.filteredBookDetail = results; // Cập nhật danh sách người dùng đã lọc
  //         this.isSearchCompleted = true; // Đánh dấu kết quả tìm kiếm đã hoàn tất
  //         console.log('Kết quả tìm kiếm:', results);
  //       },
  //       error: (err) => {
  //         console.error('Lỗi khi tìm kiếm:', err);
  //         this.isSearchCompleted = false; // Nếu có lỗi, ẩn kết quả tìm kiếm
  //       }
  //     });
  //   } else {
  //     this.filteredBookDetail = this.book_details;  // Nếu không có tìm kiếm, hiển thị tất cả
  //     this.isSearchCompleted = false; // Chưa tìm kiếm
  //   }
  // }

  // searchAcrossPages(query: string, pageNumber: number = 0): void {
  //   const pageSize = 1; // Kích thước mỗi trang
  //   this.bookDetailService.getBookDetailWithPagination(pageNumber, pageSize).subscribe({
  //     next: (response: any) => {
  //       // Tìm kiếm trong dữ liệu của trang hiện tại
  //       const matchedBookDetail = response.content.find((book_detail: any) => book_detail.idbookdetail === query);

  //       if (matchedBookDetail) {
  //         console.log('Kết quả tìm thấy:', matchedBookDetail);
  //         // Gán kết quả tìm thấy vào displaySearchResult
  //         this.displaySearchResult = [matchedBookDetail];
  //       } else if (!response.last) {
  //         // Nếu không phải trang cuối, tìm tiếp trên trang sau
  //         this.searchAcrossPages(query, pageNumber + 1);
  //       } else {
  //         console.log('Không tìm thấy kết quả!');
  //         // Hiển thị thông báo không tìm thấy nếu đã hết dữ liệu
  //         this.displaySearchResult = []; // Đặt kết quả rỗng
  //       }
  //     },
  //     error: (error) => {
  //       console.error('Lỗi khi tải dữ liệu:', error);
  //     }
  //   });
  // }



  // openEditForm(book_detail: any) {
  //   this.selectedBookDetail = book_detail;
  //   this.isEditBookDetailVisible = true;
  // }
  // updateSelectedBookDetail(book_detail: any) {
  //   this.selectedBookDetail = book_detail; // Cập nhật người dùng đang được chỉnh sửa
  // }

  // // Hàm để đóng form chỉnh sửa sau khi lưu
  // handleCloseEditForm() {
  //   this.isEditBookDetailVisible = false;
  //   this.updateSelectedBookDetail(null); // Reset lại người dùng đã chọn
  // }










}
