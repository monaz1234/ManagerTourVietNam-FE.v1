import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';
import { InvoiceService } from '../../service/Invoice/invoice.service';
import { Invoice } from '../../interface/invoice.interface';
import { HttpClient } from '@angular/common/http';
@Component({
  selector: 'app-client-invoice',
  templateUrl: './client-invoice.component.html',
  styleUrl: './client-invoice.component.scss'
})
export class ClientInvoiceComponent {
  invoiceData: any;
  username: string | null = null; // Biến để lưu tên tài khoản
  selectedPaymentMethod: string = 'cash'; // Mặc định là "Thanh toán tiền mặt"
  
  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private http: HttpClient,
    private invoiceService: InvoiceService
  ) {
    this.invoiceData = this.router.getCurrentNavigation()?.extras.state || {};
  }

  ngOnInit(): void {
    // Lấy thông tin tài khoản từ LocalStorage
    const usernameFromLocalStorage = localStorage.getItem('username');
    const nameFromGoogle = localStorage.getItem('name');
    // Ưu tiên hiển thị `name` nếu đăng nhập bằng Google, nếu không thì hiển thị `username`
    this.username = nameFromGoogle || usernameFromLocalStorage;
    
      console.log('Invoice data:', this.invoiceData);
  }
  

  ThanhToan(): void {
    if (!this.selectedPaymentMethod) {
      alert('Vui lòng chọn phương thức thanh toán.');
      return;
    }
    const newInvoice: Invoice = {
      id_invoice: '', // Sẽ được tạo tự động từ backend
      idaccount: this.invoiceData.bookDetail.idbook.account.idaccount,
      payment_time: new Date().toISOString().split('T')[0], // Ngày hiện tại
      total_amount: this.invoiceData.totalPrice,
      status: this.selectedPaymentMethod === 'cash' ? 1 : 0, // 1: Đã thanh toán tiền mặt, 0: Đang chờ xác nhận từ Momo
      idbook: this.invoiceData.bookDetail.idbook.idbook,
      payment_name: this.selectedPaymentMethod,
    };

    console.log('Đang tạo hóa đơn:', newInvoice);
    console.log('Thanh toán với phương thức: ', this.selectedPaymentMethod); // Kiểm tra giá trị selectedPaymentMethod

    if (this.selectedPaymentMethod === 'cash') {
      this.invoiceService.createInvoice(newInvoice).subscribe({
        next: (response) => {
          alert('Thanh toán tiền mặt thành công!');
          this.router.navigate(['/customer']);
        },
        error: (err) => {
          console.error('Lỗi khi thanh toán:', err);
          alert('Thanh toán thất bại.');
        },
      });
    } else if (this.selectedPaymentMethod === 'paypal') {
      // Giả sử có một API xử lý thanh toán qua paypal
      this.invoiceService.payWithPayPal(newInvoice).subscribe({
        next: (approvalUrl) => {
          window.location.href = approvalUrl; // Redirect đến trang PayPal
          // this.router.navigate(['/customer']);
        },
        error: (err) => {
          console.error('Lỗi khi thanh toán qua paypal:', err);
          alert('Thanh toán qua paypal thất bại.');
        },
      });
    }
  }

  goToUserProfile() {
    this.router.navigate(['/customer/profile']); // Điều hướng đến trang thông tin cá nhân
  }
  logout(): void {
    // Xóa thông tin trong LocalStorage và đặt lại trạng thái đăng nhập
    localStorage.removeItem('username');
    localStorage.removeItem('name');
    this.username = null;
    this.router.navigate(['/login']);
  }

  navigateToMessenger(): void {
    window.location.href = 'https://www.facebook.com/messages/t/100022817763633'; // Thay 'yourpage' bằng đường dẫn Messenger của bạn
  }
}
