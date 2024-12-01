import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { Invoice } from '../../interface/invoice.interface';
import { InvoiceService } from '../../service/Invoice/invoice.service';
import { InvoiceDetail } from '../../interface/invoiceDetail.interface';
import { InvoiceDetailService } from '../../service/InvoiceDetail/invoice-detail.service';
import { Router } from '@angular/router';
@Component({
  selector: 'app-invoice',
  templateUrl: './invoice.component.html',
  styleUrl: './invoice.component.scss'
})
export class InvoiceComponent implements OnInit{
  invoices : Invoice[] = [];
  invoiceDetails : InvoiceDetail[] = [];

  currentPage: number = 1; // Trang hiện tại
  currentInvoice: Invoice[] = []; // Danh sách người dùng hiện tại
  itemsPerPage: number = 10; // Số lượng người dùng trên mỗi trang
  totalItems: number = 0; // Tổng số người dùng
  pages: number[] = []; // Mảng lưu trang

  filteredInvoices: any[] = []; // Danh sách đã lọc
  statusFilter: string = ''; // Trạng thái hiện tại được lọc
  selectedStatus: string = ''; // Biến để lưu trữ trạng thái đã chọn
  selectedSalary: string = ''; // Biến để lưu trữ giá trị lương đã chọn
  searchQuery: string = ''; // Định nghĩa biến searchQuery

  constructor(
    private invoiceService: InvoiceService,
    private invoiceDetailService: InvoiceDetailService,
    private router : Router,

  ){}

  ngOnInit(): void {
    this.getListsInvoices();
  }

  getListsInvoices(){
    this.invoiceService.invoices$.subscribe((data) => {
      this.invoices = data;
      console.log(data);
      this.filteredInvoices = [...this.invoices]; // Khởi tạo danh sách lọc
      this.totalItems = this.invoices.length;
      this.pages = Array(Math.ceil(this.totalItems / this.itemsPerPage)).fill(0).map((x, i) => i + 1);
      this.applyFilter(); // Áp dụng bộ lọc ngay sau khi nhận dữ liệu
      this.calculatePages(); // Tính số trang
      this.updateCurrentPageUsers(); // Cập nhật người dùng hiển thị trên trang hiện tại
    });


  }

  updateCurrentPageUsers(): void {
    const start = (this.currentPage - 1) * this.itemsPerPage;
    const end = start + this.itemsPerPage;
    this.currentInvoice = this.invoices.slice(start, end);
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
  onSearch(): void {
    const query = this.searchQuery.trim().toLowerCase();

    this.filteredInvoices = this.invoices.filter(invoice =>
      invoice.id_invoice.toLowerCase().includes(query)

    );

    this.calculatePages();  // Recalculate pages if needed
    this.updateCurrentPageUsers();  // Update the display with filtered results
  }
  onStatusChange(event: Event): void {
    const selectedStatus = (event.target as HTMLSelectElement).value;
    this.filteredInvoices = this.filterInvoices(selectedStatus, this.selectedSalary);

    this.calculatePages(); // Cập nhật số trang
    this.updateCurrentPageUsers(); // Cập nhật danh sách người dùng hiển thị
  }
  filterInvoices(selectedStatus: string, selectedSalary: string) {
    return this.invoices.filter(vehicle => {
      const matchesStatus = selectedStatus ? vehicle.status.toString() === selectedStatus : true;
      return matchesStatus;
    });
  }
  applyFilter(): void {
    const query = this.searchQuery.trim().toLowerCase(); // Normalize search input

    this.filteredInvoices = this.invoices.filter(invoice=> {
      const matchesStatus = this.statusFilter === '' || invoice.status.toString() === this.statusFilter;

      const matchesSearchQuery =
        invoice.id_invoice.toLowerCase().includes(query) ;

      return matchesStatus && matchesSearchQuery; // Must match both conditions
    });

    this.filteredInvoices = this.filteredInvoices.reverse(); // Reverse the filtered list
  }
  isActive(status: string): boolean {
    return status === '1';
  }
  onEditInvoice(invoice: Invoice): void {
    console.log("Sua thanh da thanh cong");

  }
  confirmPayment(invoice: Invoice): void {
    //xu ly o day
  }

  formatSalary(salary: number): string {
    return salary.toLocaleString('vi-VN') + ' đ';
  }

  viewInvoiceDetail(idinvoice: string): void {
    this.router.navigate(['/admin/invoice/detail/', idinvoice]);
    console.log("Đã click vào: " + idinvoice);
  }

}
