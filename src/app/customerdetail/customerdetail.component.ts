import { Component, OnInit, Input } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { TourService } from '../../service/tour/tour.service'; // Import dịch vụ tour
import { TourDetailService } from '../../service/tour_detail/tourdetail.service'; // Import dịch vụ chi tiết tour
import { Tour } from '../../interface/tour.interface'; // Import interface tour
import { Account } from '../../interface/account.interface'; // Import interface
import { Promotion } from '../../interface/promotion.interface'; // Import interface
import { TourDetail } from '../../interface/tourdetail.interface'; // Import tour detail
import { Router } from '@angular/router';
import { CommentService } from '../../service/comment.service';
import { AccountService } from '../../service/account/account.service';
import { Comment } from '../../interface/comment.interface';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BookService } from '../../service/book.service';
import { BookdetailService } from '../../service/bookdetail/bookdetail.service';
import { Book } from '../../interface/book.interface'; // Import Book interface
import { bookdetail } from '../../interface/bookdetail.interface'; // Import bookdetail interface

@Component({
  selector: 'app-customerdetail',
  templateUrl: './customerdetail.component.html',
  styleUrl: './customerdetail.component.scss'
})
export class CustomerdetailComponent implements OnInit{
  promotion_code: string | null = null; // Khai báo thuộc tính với kiểu phù hợp
  tourId: string | null = null; // Lưu ID của tour
  tourDetails: TourDetail[] = [];
  username: string | null = null; // Biến để lưu tên tài khoản
  idacc: string | null = null; // Biến để lưu tên idaccount
  Iduser: string | null = null; //
  vehicleImages: string[] = [];
  hotelImages: string[] = []; // Mảng chứa danh sách ảnh của khách sạn
  comments: Comment[] = [];
  commentForm: FormGroup;
  isPriceReduced: boolean = false; // Biến để theo dõi xem giá đã giảm hay chưa.
  // Cập nhật giá khi thay đổi số lượng
  quantity = 1; // Số lượng mặc định là 1
  discount = 0; // Khuyến mãi mặc định
  totalPrice = 0; // Giá tổng sau khi áp dụng số lượng và khuyến mãi
  code: string = ''; // Mã khuyến mãi
  status = 1;
  idaccount = localStorage.getItem('idaccount');
  isAvailable: boolean = true; // Biến kiểm tra trạng thái có thể đặt

  constructor(
    private route: ActivatedRoute,
    private http: HttpClient,
    private tourService: TourService,
    private tourDetailService: TourDetailService,
    private router: Router,
    private commentService: CommentService,
    private accountService: AccountService,
    private bookDetailService: BookdetailService,
    private bookService: BookService,
    private fb: FormBuilder
  ) {
    this.username = localStorage.getItem('username'); 
    this.tourId = this.route.snapshot.paramMap.get('idtour');// Get tour ID from the route
    this.commentForm = this.fb.group({
      content: ['', [Validators.required, Validators.minLength(5)]],
    });
  }

  ngOnInit(): void {
    // Lấy Iduser từ server dựa trên username
    if (this.username) {
      // Lấy Iduser từ server dựa trên username
      this.accountService.getIdUserByUsername(this.username!).subscribe(
        (response) => {
          console.log('Response iduser:', response); // Object như { iduser: "U007" }
          this.Iduser = response.iduser;
          this.loadTourDetails(this.tourId!);
          this.loadComments();
          this.username = localStorage.getItem('username'); // Lấy tên tài khoản từ LocalStorage
          this.idacc = localStorage.getItem('idaccount');
          
          console.log("idacc",this.idacc);  // In ra giá trị idaccount, nếu có, hoặc null nếu không tìm thấy
      
        },
        (error) => {
          console.error('Error fetching IDUser:', error);
        }
      );
    } else {
      console.error('Username is null. Redirecting to login...');
      this.router.navigate(['/login']); // Điều hướng người dùng đến trang đăng nhập
    }

    if (this.tourId) {
      // Fetch the tour details for the given tour ID
      this.loadTourDetails(this.tourId);
      this.loadComments();
    }
    console.log(this.totalPrice);
  
  }
  //Phần comment
  loadComments(): void {
    if (this.tourId) {
      this.commentService.getComments(this.tourId).subscribe(
        (data) => {
          console.log('Fetched comments:', data);
          this.comments = data;
        },
        (error) => {
          console.error('Error fetching comments:', error);
        }
      );
    } else {
      console.error('Tour ID is null or undefined');
    }
  }
  onSubmit(event: Event): void {
    event.preventDefault();  // Ngăn chặn hành động mặc định của form (nếu cần)
    console.log('Form values:', this.commentForm.value);
    console.log('Username:', this.username, 'Tour ID:', this.tourId, 'User ID:', this.Iduser);
    if (this.commentForm.valid && this.username && this.tourId && this.Iduser) {
      const newComment: Partial<Comment> = {
        content: this.commentForm.value.content,
        iduser: this.Iduser,
        idtour: this.tourId, // Thêm idtour vào bình luận
        created_at: new Date().toISOString() // Lấy thời gian hiện tại theo định dạng ISO 8601
      };
      console.log('Sending comment:', newComment);
      this.commentService.addComment(newComment).subscribe({
        next: (data) => {
          this.comments.push(data); // Thêm bình luận vào danh sách hiện tại
          this.loadComments(); // Tải lại danh sách bình luận
          this.commentForm.reset(); // Reset form
        },
        error: (error) => {
          console.error('Lỗi khi thêm bình luận:', error);
          alert('Có lỗi xảy ra khi gửi bình luận');
        }
      });
    }
}

  sanitizeDescription(description: string): string {
    // Thay thế \n bằng <br> để HTML nhận diện xuống dòng
    return description.replace(/\n/g, '<br>');
  }

  loadTourDetails(idtour: string): void {
    this.tourDetailService.getTours().subscribe(details => {
      // Lọc chi tiết tour dựa trên idtour
      this.tourDetails = details.filter(detail => detail.idtour === idtour);
      if (this.tourDetails.length > 0) {
        const basePrice = this.tourDetails[0].total_price;
        this.totalPrice = basePrice; // Gán giá gốc vào totalPrice
        // Kiểm tra nếu chỗ trống bằng 0
        this.isAvailable = this.tourDetails[0].place > 0;
      }
      // Tách danh sách ảnh của vehicles (nếu tồn tại)
      if (this.tourDetails.length > 0 && this.tourDetails[0].vehicles.image) {
        this.vehicleImages = this.tourDetails[0].vehicles.image.split(',').map(image => image.trim());
      }
      // Tách danh sách ảnh của hotel (nếu tồn tại)
      if (this.tourDetails.length > 0 && this.tourDetails[0].hotel.image) {
        this.hotelImages = this.tourDetails[0].hotel.image.split(',').map(image => image.trim());
      }
    });
  }

  // Hàm cập nhật số lượng
  increaseQuantity() {
    if (this.quantity < this.tourDetails[0].place) {
        this.quantity++;
        this.updateTotalPrice();
    }
  }

  decreaseQuantity() {
    if (this.quantity > 1) {
        this.quantity--;
        this.updateTotalPrice();
    }
  }

  // Hàm áp dụng mã khuyến mãi
  applyPromotion(): void {
    console.log('promoCode trước khi gửi yêu cầu:', this.code);  // Kiểm tra giá trị
    const body = {
      idtour: this.tourId,          // tourId bạn đã có từ component
      code: this.code,         // MaCode bạn đã nhập từ input
      quantity: this.quantity,      // quantity bạn đã có từ input
    };

    console.log("Áp dụng khuyến mãi với mã: ", body);
    this.http.post('http://localhost:9000/api/apply-promotion', body).subscribe({
      next: (response: any) => {
        console.log("Phản hồi từ backend:", response);
        this.discount = response.discount || 0; // Lấy khuyến mãi từ backend
        this.updateTotalPrice(); // Cập nhật giá tổng
        this.isPriceReduced = this.discount > 0; // Đánh dấu giá đã giảm nếu discount lớn hơn 0.
              // Lưu promotion_code từ backend
        this.promotion_code = response.promotion_code;
      },
      error: (err) => {
        if (err.status === 400 && err.error?.error) {
          alert(err.error.error); // Hiển thị thông báo từ backend
        }
        console.error('Áp dụng khuyến mãi thất bại:', err);
        this.discount = 0; // Đặt lại discount nếu thất bại
        this.updateTotalPrice();
        this.isPriceReduced = false; // Không giảm giá.
      },
    });
  }

  onInputChange(event: Event): void {
    const target = event.target as HTMLInputElement;
    this.code = target.value; // Cập nhật giá trị code từ input
    console.log('Code từ input:', this.code); // Xác minh
  }

  // Hàm cập nhật giá tổng
  updateTotalPrice() {
    const basePrice = this.tourDetails[0]?.total_price || 0; // Lấy giá gốc
    this.totalPrice = (basePrice * this.quantity) - this.discount; // Cập nhật giá tổng
  }
  
bookTour(): void {
  
  const bookData: Omit<Book, "idbook"> = {
    status: this.status, // Chuyển đổi number thành boolean
    account: this.idacc ? { idaccount: this.idacc } as Account : null,
    tour: this.tourId ? { idtour: this.tourId } as Tour : null,
  };

  console.log('Book data:', bookData);

  this.bookService.addBook(bookData).subscribe({
    next: (bookResponse) => {
      console.log('Book created successfully:', bookResponse);

      const book: Book = {
        idbook: bookResponse.idbook,
        status: bookResponse.status,
        account: bookResponse.account,
        tour: bookResponse.tour
      };

      const bookDetailData: bookdetail = {
        idbookdetail: null as unknown as String,
        idbook: book,
        promotion_code: this.promotion_code ? { promotion_code: this.promotion_code } as Promotion : null, // Sử dụng promotion_code từ applyPromotion
        time_book: new Date().toISOString(),
        quantity: this.quantity,
        participant: this.username || '',
      };

      this.bookDetailService.addBookDetailCreate(bookDetailData).subscribe({
        next: (bookDetailResponse) => {
          alert('Đặt tour thành công!');
          console.log('Book detail created successfully:', bookDetailResponse);
          this.router.navigate(['/customer']);
        },
        error: (err) => {
          console.error('Đặt tour thất bại:', err);
          alert('Đặt chi tiết tour thất bại, vui lòng thử lại.');
        },
      });
    },
    error: (err) => {
      console.error('Error adding book:', err);
      alert('Đặt tour thất bại, vui lòng thử lại.');
    },
  });
}
  getTourDetailById(tourId: String) {
    return this.tourDetails.find(detail => detail.idtour === tourId);
  }
  logout(): void {
    localStorage.removeItem('username'); // Xóa tên tài khoản khi đăng xuất
    this.username = null;
    this.router.navigate(['/']); // Điều hướng về trang chủ hoặc trang đăng nhập
  }
  navigateToMessenger(): void {
    window.location.href = 'https://www.facebook.com/messages/t/100022817763633'; // Thay 'yourpage' bằng đường dẫn Messenger của bạn
  }


}
