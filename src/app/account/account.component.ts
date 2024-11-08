import { Component, OnInit } from '@angular/core';
import { AccountService } from '../../service/account/account.service';
import { Router, ActivatedRoute } from '@angular/router';
import { Account } from '../../interface/account.interface';

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
  currentUsers: Account[] = []; // Danh sách người dùng hiện tại
  itemsPerPage: number = 10; // Số lượng người dùng trên mỗi trang
  totalItems: number = 0; // Tổng số người dùng
  pages: number[] = []; // Mảng lưu trang



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

  showFormEditAccount(account: any): void {
    console.log(account.status); // Kiểm tra giá trị của user.status
    this.selectedAccount = { ...account };
    this.isAddAccountVisible = false;
    this.isEditAccountVisible = true;
  }


  toggleAddUser(): void {
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
    this.getListAccount();
  }



  getListAccount(){
    this.accountService.account$.subscribe((data : Account[])=>{
      this.accounts = data;
      console.log(this.accounts);

      this.totalItems = data.length;
      this.applyFilterAccount();
      this.calculatePages(); // Tính số trang
    });

    this.updateCurrentPageAccount();

  }



  applyFilterAccount() : void {
    const query = this.searchQuery.trim().toLowerCase();
    this.filteredAccount = this.accounts.filter(account =>{
      const matchesStatus = this.statusFilter === '' || account.status.toString() === this.statusFilter;

      const matchesSearchQuery =
        account.username.toLowerCase().includes(query) ||
        account.typeUser.toLowerCase().includes(query) ||
        account.user.toLowerCase().includes(query) ||
        account.idaccount.toLowerCase().includes(query);

      return matchesStatus && matchesSearchQuery;
    });

    this.filteredAccount = this.filteredAccount.reverse();

  }

  updateCurrentPageAccount(): void {
    const start = (this.currentPage - 1) * this.itemsPerPage;
    const end = start + this.itemsPerPage;
    this.currentUsers = this.accounts.slice(start, end);
  }

  goToPage(page: number): void {
    this.currentPage = page;
    this.updateCurrentPageAccount();
  }

  nextPage(): void {
    if (this.currentPage < this.pages.length) {
      this.currentPage++;
      this.updateCurrentPageAccount();
    }
  }

  previousPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.updateCurrentPageAccount();
    }
  }


  calculatePages(): void {
    const pageCount = Math.ceil(this.totalItems / this.itemsPerPage);
    this.pages = Array.from({ length: pageCount }, (_, i) => i + 1);
  }

  isActive(status: string): boolean {
    return status === '1'; // Giả sử '1' là trạng thái "Hoạt động"
  }

  showFormEditAccountAuto(id: string): void {
    if (this.selectedAccount && this.selectedAccount.idaccount === id) {
      this.isEditAccountVisible = false;
      this.selectedAccount = null; // Đặt lại selectedUser
    } else {
      this.editAccount(id);
      this.isEditAccountVisible = true; // Đảm bảo form được hiện thị

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
  const confirmed = confirm(`Bạn có chắc chắn muốn xóa người dùng ${account.name}?`);
  if (confirmed) {
    this.deleteAccount(account.iduser); // Gọi hàm xóa
  }
}
// Hàm thực hiện xóa người dùng
deleteAccount(id: string): void {
  this.accountService.deleteAccount(id).subscribe({
    next: () => {
      this.accounts = this.accounts.filter(account => account.idaccount !== id); // Cập nhật danh sách người dùng
      console.log(`Đã xóa thông tin tài khoản với id ${id}`);
    },
    error: (error) => {
      console.error('Lỗi khi xóa tài khoản:', error); // Xử lý lỗi nếu có
    }
  });
}


  generateNewAccountId(){
    const existingIds = this.accounts.map(account =>
      parseInt(account.idaccount.slice(1)));
      const accountCount = this.accounts.length + 1;

      for(let i = 1; i <= accountCount; i++){
        if(!existingIds.includes(i)){
          this.newAccountId = `A${i.toString().padStart(3,'0')}`;
          return;
        }
      }
      if(accountCount < 10){
        this.newAccountId = `A00${accountCount}`;
      }else if(accountCount < 100){
        this.newAccountId = `A0${accountCount}`;
      }else if(accountCount < 1000){
        this.newAccountId = `A${accountCount}`;
      }else{
        console.error("Số lượng tài khoản vượt quá giới hạn 999");
      }
  }


  onAccountUpdated(updatedAccount: any): void {
    const index = this.accounts.findIndex(account => account.idaccount === updatedAccount.idaccount);
    if (index > -1) {
      this.accounts[index] = { ...updatedAccount };  // Cập nhật trong danh sách chính
      this.onSearch();  // Làm mới kết quả tìm kiếm để hiển thị ngay
    }
  }

  onSearch(): void {
    const query = this.searchQuery.trim().toLowerCase();

    this.filteredAccount = this.accounts.filter(account =>
      account.username.toLowerCase().includes(query) ||
      account.typeUser.toLowerCase().includes(query)||
      account.user.toLowerCase().includes(query)
    );

    this.calculatePages();  // Recalculate pages if needed
    this.updateCurrentPageAccount();  // Update the display with filtered results
  }

  onStatusChange(event: Event): void {
    const selectedStatus = (event.target as HTMLSelectElement).value;
    this.filteredAccount = this.filterAccount(selectedStatus, this.selectedSalary);

    this.calculatePages(); // Cập nhật số trang
    this.updateCurrentPageAccount(); // Cập nhật danh sách người dùng hiển thị
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
