import { Component, OnInit } from '@angular/core';
import { BookService } from '../../service/book.service';
import { ActivatedRoute, Router } from '@angular/router';
import { TourService } from '../../service/tour/tour.service';
import { AccountService } from '../../service/account/account.service';
import { Book } from '../../interface/book.interface';
import { catchError, finalize, of, tap } from 'rxjs';

@Component({
  selector: 'app-book',
  templateUrl: './book.component.html',
  styleUrl: './book.component.scss'
})
export class BookComponent implements OnInit{
  isLoading = false;



  books: Book[] = []; // sử dụng interface
  selectedBook: any;
  newBookId: string = '';
  reversedBooks: Book[] = []; // Danh sách người dùng đảo ngược
  displaySearchResult: Book[] = []; // Khởi tạo biến để lưu kết quả tìm kiếm
  isSearchCompleted: boolean = false; // Cờ để kiểm tra kết quả tìm kiếm






  currentPage: number = 1; // Trang hiện tại
  currentBooks: Book[] = []; // Danh sách người dùng hiện tại
  itemsPerPage: number = 10; // Số lượng người dùng trên mỗi trang
  totalItems: number = 0; // Tổng số người dùng
  pages: (string | number)[] = [];


  totalPages: number = 0;    // Tổng số trang



  filteredBooks: any[] = []; // Danh sách đã lọc
  statusFilter: string = ''; // Trạng thái hiện tại được lọc
  selectedStatus: string = ''; // Biến để lưu trữ trạng thái đã chọn
  selectedSalary: string = ''; // Biến để lưu trữ giá trị lương đã chọn
  searchQuery: string = ''; // Định nghĩa biến searchQuery




  isAddBookVisible = false; // Biến để theo dõi trạng thái hiển thị
  isEditBookVisible = false;
  private isFirstEdit: boolean = true; // Biến để theo dõi lần đầu tiên chọn chỉnh sửa



  ShowAddUser() : void{
    this.isAddBookVisible = true;
    this.isEditBookVisible = false;
  }

  showFormEditUser(user: any): void {
    console.log(user.status); // Kiểm tra giá trị của user.status
    this.selectedBook = { ...user};  // Cập nhật selectedUser
    console.log(this.selectedBook); // Kiểm tra giá trị của selectedUser
    this.isAddBookVisible = false;
    this.isEditBookVisible = true;
  }



  formatSalary(salary: number): string {
    return salary.toLocaleString('vi-VN') + ' đ';
  }






  // Hàm hiển thị form thêm người dùng và tạo id mới
toggleAddBook(): void {
  this.isAddBookVisible = !this.isAddBookVisible;
  this.isEditBookVisible = false;
  if (this.isAddBookVisible) {
    this.generateNewBookId(); // Tạo mã ID mới khi hiển thị form thêm
  } else {
    this.selectedBook = null; // Reset người dùng đã chọn nếu có
  }
}





  constructor(
    private bookService : BookService,
     private router : Router,
      private tourService : TourService,
      private accountService : AccountService,
      private route: ActivatedRoute,

      ){}
  ngOnInit(): void {
    this.route.params.subscribe((params) => {
      console.log('Route params:', params);
    });
      this.loadBooks();
      console.log(this.filteredBooks);
  }

  viewBookDetail(idbook: string): void {
    this.router.navigate(['/admin/book/detail', idbook])
    .then((success) => {
      if (success) {
        console.log('Successfully navigated to: /admin/book/detail/' + idbook);
      } else {
        console.error('Navigation failed!');
      }
    });
  }



  loadBooks(): void {
    this.isLoading = true;

    this.bookService
      .getBooksWithPagination(this.currentPage, this.itemsPerPage)
      .pipe(
        tap((response) => {
          this.books = response.content;
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


  updateCurrentPageBooks(): void {
    const start = (this.currentPage - 1) * this.itemsPerPage;
    const end = start + this.itemsPerPage;
    this.currentBooks = this.filteredBooks.slice(start, end); // Sử dụng filteredUsers thay vì users
  }




  previousPage() {
    if (this.currentPage > 1) {
      this.currentPage--; // Giảm trang
      this.loadBooks();
    }
  }

  nextPage() {
    if (this.currentPage < this.totalPages) {
      this.currentPage++; // Tăng trang
      this.loadBooks();
    }
  }

  goToPage(page: string | number) {
    // Chuyển đổi page thành số nếu đó là số, hoặc bỏ qua nếu là dấu ba chấm
    if (typeof page === 'number') {
      this.currentPage = page; // Nếu page là số, gán cho currentPage
      this.loadBooks();
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


  showFormEditBookAuto(id: string): void {
    // Nếu form đang mở và ID người dùng giống nhau, chỉ cần đóng lại
    if (this.isEditBookVisible && this.selectedBook && this.selectedBook.idbook === id) {
      this.isEditBookVisible = false;
      this.selectedBook = null; // Reset selectedUser
      return;
    }

    // Đóng form cũ trước khi mở mới
    this.isEditBookVisible = false;

    setTimeout(() => {
      // Cập nhật thông tin người dùng mới
      this.selectedBook = this.books.find(book => book.idbook === id); // Lấy người dùng theo ID
      this.isEditBookVisible = true; // Mở lại form

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



    onBookAdded(book: Book) {
      console.log('Người dùng mới:', book);
      this.isAddBookVisible = false; // Ẩn form sau khi thêm
      this.loadBooks();

    }


    editBook(id: string): void {
      this.bookService.findBook(id).subscribe({
        next: (book) => {
          this.selectedBook = book; // Gán thông tin người dùng vào selectedUser
          this.isAddBookVisible = false;
          this.isEditBookVisible = true;
        },
        error: (error) => {
          console.error('Lỗi khi lấy thông tin người dùng:', error);
        }
      });
    }


    // Hàm xác nhận và xóa người dùng
confirmDelete(books: any): void {
  const confirmed = confirm(`Bạn có chắc chắn muốn xóa book này không ? ${books.idbook}?`);
  if (confirmed) {
    this.deleteBook(books.idbook); // Gọi hàm xóa
  }
}

// Hàm thực hiện xóa người dùng
deleteBook(id: string): void {
  this.bookService.deleteBook(id).subscribe({
    next: () => {
      this.books = this.books.filter(book => book.idbook !== id); // Cập nhật danh sách người dùng
      console.log(`Đã xóa thông tin Book với id ${id}`);
      this.loadBooks();
    },
    error: (error) => {
      console.error('Lỗi khi xóa Book:', error); // Xử lý lỗi nếu có
    }
  });
}


onBookUpdated(updatedBook: any): void {
  const index = this.books.findIndex(book => book.idbook === updatedBook.idbook);
  if (index > -1) {
    this.books[index] = { ...updatedBook }; // Cập nhật trong danh sách chính
    this.onSearch(this.searchQuery);       // Truyền giá trị tìm kiếm hiện tại
  }
}

onSearch(query: string): void {
  if (query) {
    this.bookService.getBooksBySearch(query).subscribe({
      next: (results) => {
        this.filteredBooks = results; // Cập nhật danh sách người dùng đã lọc
        this.isSearchCompleted = true; // Đánh dấu kết quả tìm kiếm đã hoàn tất
        console.log('Kết quả tìm kiếm:', results);
      },
      error: (err) => {
        console.error('Lỗi khi tìm kiếm:', err);
        this.isSearchCompleted = false; // Nếu có lỗi, ẩn kết quả tìm kiếm
      }
    });
  } else {
    this.filteredBooks = this.books;  // Nếu không có tìm kiếm, hiển thị tất cả
    this.isSearchCompleted = false; // Chưa tìm kiếm
  }
}

searchAcrossPages(query: string, pageNumber: number = 0): void {
  const pageSize = 5; // Kích thước mỗi trang
  this.bookService.getBooksWithPagination(pageNumber, pageSize).subscribe({
    next: (response: any) => {
      // Tìm kiếm trong dữ liệu của trang hiện tại
      const matchedBook = response.content.find((book: any) => book.idbook === query);

      if (matchedBook) {
        console.log('Kết quả tìm thấy:', matchedBook);
        // Gán kết quả tìm thấy vào displaySearchResult
        this.displaySearchResult = [matchedBook];
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
  this.filteredBooks = this.filterBooks(selectedStatus, this.selectedSalary);

  this.calculatePages(); // Cập nhật số trang
  this.updateCurrentPageBooks(); // Cập nhật danh sách người dùng hiển thị
}


filterBooks(selectedStatus: string, selectedSalary: string) {
  return this.books.filter(book => {
    const matchesStatus = selectedStatus ? book.status.toString() === selectedStatus : true;
    return matchesStatus;
  });
}


openEditForm(user: any) {
  this.selectedBook = user;
  this.isEditBookVisible = true;
}
updateSelectedUser(user: any) {
  this.selectedBook = user; // Cập nhật người dùng đang được chỉnh sửa
}

// Hàm để đóng form chỉnh sửa sau khi lưu
handleCloseEditForm() {
  this.isEditBookVisible = false;
  this.updateSelectedUser(null); // Reset lại người dùng đã chọn
}
  applyFilters(): void {
    const query = this.searchQuery.trim().toLowerCase();

    this.filteredBooks = this.books.filter((book) => {
      console.log(book.account?.username);
      console.log(book.tour?.tourname);
      const matchesSearchQuery =
        book.idbook.toLowerCase().includes(query) ||
        book.account?.username.toLowerCase().includes(query) ||
        book.tour?.tourname.toLowerCase().includes(query);
      const matchesStatus =
        !this.statusFilter || book.status.toString() === this.statusFilter;

      return matchesSearchQuery && matchesStatus;
    });

    this.totalItems = this.filteredBooks.length; // Cập nhật tổng số người dùng sau khi lọc
    this.calculatePages(); // Tính lại số trang
    this.updateCurrentPageBooks(); // Cập nhật danh sách hiển thị
  }



  generateNewBookId(): void {
    this.bookService.getBookIds().subscribe(existingIds => {
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
      this.newBookId = `B${missingId.toString().padStart(3, '0')}`;
      console.log(this.newBookId)
    });



  }

}
