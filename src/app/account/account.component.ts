import { Component, OnInit } from '@angular/core';
import { AccountService } from '../../service/account/account.service';
import { Router, ActivatedRoute } from '@angular/router';
import { Account } from '../../interface/account.interface';
import { catchError, finalize, of, tap } from 'rxjs';

@Component({
  selector: 'app-account',
  templateUrl: './account.component.html',
  styleUrl: './account.component.scss'
})
export class AccountComponent implements OnInit {

  accounts : Account[] = [];
  selectedAccount: any;
  newAccountId: string ='';
  reversedAccounts: Account[] = [];

  currentPage: number = 1; // Trang hiện tại
  currentAccounts: Account[] = []; // Danh sách người dùng hiện tại
  itemsPerPage: number = 5; // Số lượng người dùng trên mỗi trang
  totalItems: number = 0; // Tổng số người dùng
  totalPages: number = 0;    // Tổng số trang
  isLoading = false; // Trạng thái chờ dữ liệu

  isSearchCompleted: boolean = false; // Cờ để kiểm tra kết quả tìm kiếm


  displaySearchResult: Account[] = []; // Khởi tạo biến để lưu kết quả tìm kiếm

  pages: (string | number)[] = [];
  filteredAccount: any[] = []; // Danh sách đã lọc
  statusFilter: string = ''; // Trạng thái hiện tại được lọc
  selectedStatus: string = ''; // Biến để lưu trữ trạng thái đã chọn
  selectedSalary: string = ''; // Biến để lưu trữ giá trị lương đã chọn
  searchQuery: string = ''; // Định nghĩa biến searchQuery


  isAddAccountVisible = false; // Biến để theo dõi trạng thái hiển thị
  isEditAccountVisible = false;
  private isFirstEdit: boolean = true; // Biến để theo dõi lần đầu tiên chọn chỉnh sửa


  ShowAddAccount() : void{
    this.isAddAccountVisible = true;
    this.isEditAccountVisible = false;
  }

  showFormEditAccount(accountId: string) {
  this.accountService.findAccount(accountId).subscribe(account => {
    this.selectedAccount = account;
    this.isEditAccountVisible = true; // Ensure form visibility
  });
}


  toggleAddAccount(): void {
    this.isAddAccountVisible = !this.isAddAccountVisible;
    this.isEditAccountVisible = false;
    if (this.isAddAccountVisible) {
      this.generateNewAccountId(); // Tạo mã ID mới khi hiển thị form thêm
    } else {
      this.selectedAccount = null; // Reset người dùng đã chọn nếu có
    }
  }



   constructor(private accountService : AccountService, private router : Router){}
  ngOnInit(): void {
    this.loadAccounts();
  }



  // getListAccount(){
  //   this.accountService.getAccountsWithPagination(this.currentPage, this.itemsPerPage).subscribe({
  //     next: (response) => {
  //       this.totalPages = response.totalPages;
  //       this.accounts = response.content;

  //       this.applyFilterAccount();
  //     },
  //     error: (err) => {
  //       console.error("Error fetching users:", err);
  //     }
  //   });

  // }

  loadAccounts(): void {
    this.isLoading = true;

    this.accountService
      .getAccountsWithPagination(this.currentPage, this.itemsPerPage)
      .pipe(
        tap((response) => {
          this.accounts = response.content;
          this.totalItems = response.totalItems;
          this.totalPages = response.totalPages;
          this.applyFilterAccount(); // Áp dụng bộ lọc sau khi tải dữ liệu
        }),
        catchError((error) => {
          console.error('Lỗi khi tải danh sách người dùng:', error);
          return of([]); // Trả về danh sách rỗng khi có lỗi
        }),
        finalize(() => (this.isLoading = false)) // Dừng trạng thái chờ dữ liệu
      )
      .subscribe();
  }

  onAccountAdded(account : Account){
    console.log('Tài khoản mới:', account);
    this.isAddAccountVisible = false; // Ẩn form sau khi thêm
    this.loadAccounts();
  }


  applyFilterAccount() : void {
    const query = this.searchQuery.trim().toLowerCase();
    this.filteredAccount = this.accounts.filter(account =>{
      const matchesStatus = this.statusFilter === '' || account.status.toString() === this.statusFilter;

      const matchesSearchQuery =
        account.username.toLowerCase().includes(query) ||
        account.typeUser?.name_type.toLowerCase().includes(query) ||
        account.user?.name.toLowerCase().includes(query) ||
        account.idaccount.toLowerCase().includes(query);

      return matchesStatus && matchesSearchQuery;
    });

    this.totalItems = this.filteredAccount.length;
    // this.filteredAccount = this.filteredAccount.reverse();
    this.calculatePages(); // Tính lại số trang
    this.updateCurrentPageAccounts(); // Cập nhật danh sách hiển thị

  }

  updateCurrentPageAccounts(): void {
    const start = (this.currentPage - 1) * this.itemsPerPage;
    const end = start + this.itemsPerPage;
    this.currentAccounts = this.filteredAccount.slice(start, end); // Sử dụng filteredUsers thay vì users
  }

  goToPage(page: string | number) {
    // Chuyển đổi page thành số nếu đó là số, hoặc bỏ qua nếu là dấu ba chấm
    if (typeof page === 'number') {
      this.currentPage = page; // Nếu page là số, gán cho currentPage
      this.loadAccounts();
    }
  }
  nextPage() {
    if (this.currentPage < this.totalPages) {
      this.currentPage++; // Tăng trang
      this.loadAccounts();
    }
  }

  previousPage() {
    if (this.currentPage > 1) {
      this.currentPage--; // Giảm trang
      this.loadAccounts();
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
    if (this.isEditAccountVisible && this.selectedAccount && this.selectedAccount.idaccount === id) {
      this.isEditAccountVisible = false;
      this.selectedAccount = null; // Reset selectedUser
      return;
    }

    // Đóng form cũ trước khi mở mới
    this.isEditAccountVisible = false;

    setTimeout(() => {
      // Cập nhật thông tin người dùng mới
      this.selectedAccount = this.accounts.find(account => account.idaccount === id); // Lấy người dùng theo ID
      this.isEditAccountVisible = true; // Mở lại form

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

  editAccount(id : string) : void {
    this.accountService.findAccount(id).subscribe({
      next: (account) =>{
        this.selectedAccount = account;
        this.isAddAccountVisible = false;
        this.isEditAccountVisible = true;
      },
      error: (error) =>{
        console.error('Lỗi khi lấy thông tin tài khoản', error);
      }
    });
  }

  // Hàm xác nhận và xóa người dùng
confirmDelete(account: any): void {
  const confirmed = confirm(`Bạn có chắc chắn muốn xóa người dùng ${account.idaccount}?`);
  if (confirmed) {
    this.deleteAccount(account.idaccount); // Gọi hàm xóa
  }
}
// Hàm thực hiện xóa người dùng
deleteAccount(id: string): void {
  this.accountService.deleteAccount(id).subscribe({
    next: () => {
      this.accounts = this.accounts.filter(account => account.idaccount !== id); // Cập nhật danh sách người dùng
      console.log(`Đã xóa thông tin tài khoản với id ${id}`);
      this.loadAccounts();
    },
    error: (error) => {
      console.error('Lỗi khi xóa tài khoản:', error); // Xử lý lỗi nếu có
    }
  });
}


  // generateNewAccountId(){
  //   const existingIds = this.accounts.map(account =>
  //     parseInt(account.idaccount.slice(1)));
  //     const accountCount = this.accounts.length + 1;

  //     for(let i = 1; i <= accountCount; i++){
  //       if(!existingIds.includes(i)){
  //         this.newAccountId = `A${i.toString().padStart(3,'0')}`;
  //         return;
  //       }
  //     }
  //     if(accountCount < 10){
  //       this.newAccountId = `A00${accountCount}`;
  //     }else if(accountCount < 100){
  //       this.newAccountId = `A0${accountCount}`;
  //     }else if(accountCount < 1000){
  //       this.newAccountId = `A${accountCount}`;
  //     }else{
  //       console.error("Số lượng tài khoản vượt quá giới hạn 999");
  //     }
  // }

  generateNewAccountId(): void {
    this.accountService.getAccountIds().subscribe(existingIds => {
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
      this.newAccountId = `A${missingId.toString().padStart(3, '0')}`;
      console.log(this.newAccountId)
    });
  }


  onAccountUpdated(updatedAccount: any): void {
    const index = this.accounts.findIndex(account => account.idaccount === updatedAccount.idaccount);
    if (index > -1) {
      this.accounts[index] = { ...updatedAccount };  // Cập nhật trong danh sách chính
      this.onSearch(this.searchQuery);  // Làm mới kết quả tìm kiếm để hiển thị ngay
    }
  }

  // onSearch(): void {
  //   const query = this.searchQuery.trim().toLowerCase();

  //   this.filteredAccount = this.accounts.filter(account =>
  //     account.username.toLowerCase().includes(query) ||
  //     account.typeUser.name_type.toLowerCase().includes(query)||
  //     account.user.name.toLowerCase().includes(query)
  //   );

  //   this.calculatePages();  // Recalculate pages if needed
  //   this.updateCurrentPageAccount();  // Update the display with filtered results
  // }
  onSearch(query: string): void {
    if (query) {
      this.accountService.getAccountsBySearch(query).subscribe({
        next: (results) => {
          this.filteredAccount = results; // Cập nhật danh sách người dùng đã lọc
          this.isSearchCompleted = true; // Đánh dấu kết quả tìm kiếm đã hoàn tất
          console.log('Kết quả tìm kiếm:', results);
        },
        error: (err) => {
          console.error('Lỗi khi tìm kiếm:', err);
          this.isSearchCompleted = false; // Nếu có lỗi, ẩn kết quả tìm kiếm
        }
      });
    } else {
      this.filteredAccount = this.accounts;  // Nếu không có tìm kiếm, hiển thị tất cả
      this.isSearchCompleted = false; // Chưa tìm kiếm
    }
  }
  searchAcrossPages(query: string, pageNumber: number = 0): void {
    const pageSize = 1; // Kích thước mỗi trang
    this.accountService.getAccountsWithPagination(pageNumber, pageSize).subscribe({
      next: (response: any) => {
        // Tìm kiếm trong dữ liệu của trang hiện tại
        const matchedAccount = response.content.find((account: any) => account.idaccount === query);

        if (matchedAccount) {
          console.log('Kết quả tìm thấy:', matchedAccount);
          // Gán kết quả tìm thấy vào displaySearchResult
          this.displaySearchResult = [matchedAccount];
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
    this.filteredAccount = this.filterAccount(selectedStatus, this.selectedSalary);

    this.calculatePages(); // Cập nhật số trang
    this.updateCurrentPageAccounts(); // Cập nhật danh sách người dùng hiển thị
  }

  filterAccount(selectedAccountStatus: string, selectedSalary: string) {
    return this.accounts.filter(account => {
      const matchesStatus = selectedAccountStatus ? account.status.toString() === selectedAccountStatus : true;
      return matchesStatus;
    });
  }

  openEditForm(account: any) {
    this.selectedAccount = account;
    this.isEditAccountVisible = true;
  }
  updateSelectedAccount(account: any) {
    this.selectedAccount = account; // Cập nhật người dùng đang được chỉnh sửa
  }

  // Hàm để đóng form chỉnh sửa sau khi lưu
  handleCloseEditForm() {
    this.isEditAccountVisible = false;
    this.updateSelectedAccount(null); // Reset lại người dùng đã chọn
  }







}
