import { InvoiceService } from './../../service/Invoice/invoice.service';
import { Component } from '@angular/core';
import { InvoiceDetail } from '../../interface/invoiceDetail.interface';
import { ActivatedRoute, Router } from '@angular/router';
import { BookdetailService } from '../../service/bookdetail/bookdetail.service';
import { BookService } from '../../service/book.service';
import { Location } from '@angular/common';
import { catchError, finalize, of, tap } from 'rxjs';
import { InvoiceDetailService } from '../../service/InvoiceDetail/invoice-detail.service';

@Component({
  selector: 'app-invoice-detail',
  templateUrl: './invoice-detail.component.html',
  styleUrl: './invoice-detail.component.scss'
})
export class InvoiceDetailComponent {





  invoice_details:  InvoiceDetail[] = [];
  // books : Book[] = [];
  invoice : any;
  error: string | null = null; // Lỗi nếu xảy ra
  idinvoice: string | null = null;  // Khai báo biến idbook

  currentPage: number = 1; // Trang hiện tại
  currentInvoiceDetais: InvoiceDetail[] = []; // Danh sách người dùng hiện tại
  itemsPerPage: number = 5; // Số lượng người dùng trên mỗi trang
  totalItems: number = 0; // Tổng số người dùng
  totalPages: number = 0;    // Tổng số trang
  isLoading = false; // Trạng thái chờ dữ liệu

  isSearchCompleted: boolean = false; // Cờ để kiểm tra kết quả tìm kiếm

  pages: (string | number)[] = [];
  filteredInvoiceDetail: any[] = []; // Danh sách đã lọc
  statusFilter: string = ''; // Trạng thái hiện tại được lọc
  selectedStatus: string = ''; // Biến để lưu trữ trạng thái đã chọn
  selectedSalary: string = ''; // Biến để lưu trữ giá trị lương đã chọn
  searchQuery: string = ''; // Định nghĩa biến searchQuery



  isAddInvoiceDetailVisible = false; // Biến để theo dõi trạng thái hiển thị
  isEditInvoiceDetailVisible = false;



  selectedBookDetail: any;
  newBookDetail: string ='';
  reversedInoviceDetails: InvoiceDetail[] = [];
  displaySearchResult: InvoiceDetail[] = [];


  ShowAddBookDetail() : void{
    this.isAddInvoiceDetailVisible = true;
    this.isEditInvoiceDetailVisible = false;
  }


  constructor(
    private router : Router,
    private invoiceDetailService : InvoiceDetailService,
    private InvoiceService : InvoiceService,
    private route: ActivatedRoute,
    private location: Location,

  ){}
  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.idinvoice = params['id'];  // Lấy idBook từ params
      console.log('ID của sách:', this.idinvoice);

      if (this.idinvoice) {
        // this.fetchBookDetail(this.idbook);
        this.loadBookDetail(this.idinvoice);
      }
    });


  }


  // fetchBookDetail(id: string): void {
  //   this.bookService.getBookById(id).subscribe({
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
  loadBookDetail(id_invoice_detail: string): void {
    this.isLoading = true;

    this.invoiceDetailService.getInvoiceDetailByIdInvoice(id_invoice_detail).subscribe(
      (data: any) => {
        // Kiểm tra nếu data không phải là mảng và chuyển đổi thành mảng
        if (!Array.isArray(data)) {
          this.invoice_details = [data]; // Chuyển đối tượng thành mảng nếu cần
        } else {
          this.invoice_details = data;
        }
      },
      (error) => {
        console.error('Lỗi khi lấy dữ liệu người dùng:', error);
      },
      () => {
        this.isLoading = false; // Đảm bảo cập nhật isLoading khi kết thúc
      }
    );
  }




  applyFilterTourDetail(): void {
    const query = this.searchQuery.trim().toLowerCase();

    this.filteredInvoiceDetail = this.invoice_details.filter(invoice_detail => {
      const matchesSearchQuery =
        (invoice_detail.quantity?.toString().toLowerCase().includes(query)) ||
        (invoice_detail.total_amount?.toString().toLowerCase().includes(query)) ||
        (invoice_detail.unit_price?.toString().toLowerCase().includes(query));

      return matchesSearchQuery;
    });

    this.totalItems = this.filteredInvoiceDetail.length; // Sửa biến này cho đúng
    // this.filteredAccount = this.filteredAccount.reverse(); // (Nếu cần thiết)
    // this.calculatePages(); // Tính lại số trang
    // this.updateCurrentPageAccounts(); // Cập nhật danh sách hiển thị
  }


}
