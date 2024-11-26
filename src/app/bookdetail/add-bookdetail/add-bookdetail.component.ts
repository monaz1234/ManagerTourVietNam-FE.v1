import { Component, EventEmitter, Input, Output, SimpleChanges, OnInit } from '@angular/core';
import { bookdetail } from '../../../interface/bookdetail.interface';
import { Book } from '../../../interface/book.interface';
import { Promotion } from '../../../interface/promotion.interface';
import { BookdetailService } from '../../../service/bookdetail/bookdetail.service';
import { BookService } from '../../../service/book.service';
import { ManagerPromotionService } from '../../../service/promotion/manager-promotion.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-add-bookdetail',
  templateUrl: './add-bookdetail.component.html',
  styleUrl: './add-bookdetail.component.scss'
})
export class AddBookdetailComponent implements OnInit{

  isEditBookDetailVisible = true;
  closeForm() {
    this.isEditBookDetailVisible = false; // Đặt lại trạng thái để ẩn form
    console.log('Form đã được đóng lại'); // Kiểm tra trong console
  }

  @Input() generatedIdBookDetail: string = ''; // Nhận giá trị iduser từ component cha
  @Output() BookDetailAdded = new EventEmitter<bookdetail>();
  newBookDetail: any = {
    idbookdetail: '',
    idbook: '',
    promotion_code: '',
    time_book: '',
    quantity: 0,
    participant:'',
  }
  errorMessages: string[] = [];
  activePromotions: any[] = [];
  activeBooks: any[] = [];
  bookOptions : Book[] = [];
  promotionOptions : Promotion[] = [];


  formFields: {
    name: string;
    label: string;
    type: string;
    required: boolean;
    options?: { value: string; label: string }[];
  }[] = [
    { name: 'idbookdetail', label: 'Id book detail', type: 'text', required: true },
    {
      name: 'idbook', // Sửa lại name cho khớp
      label: 'Book',
      type: 'select',
      required: false,
      options: [] as { value: any, label: any }[]
    },
    {
      name: 'promotion_code', // Sửa lại name cho khớp
      label: 'Promotion',
      type: 'select',
      required: false,
      options: [] as { value: any, label: any }[]
    },
    { name: 'time_book', label: 'Ngày đặt', type: 'date', required: false },
    { name: 'participant', label: 'Người tham gia', type: 'text', required: false },
    { name: 'quantity', label: 'Số lượng', type: 'number', required: false },

  ];

  constructor(
    private bookDetailService : BookdetailService,
    private bookService : BookService,
    private promotionService : ManagerPromotionService,
    private router : Router

  ){}

  ngOnInit():void{
    console.log("ID nhận từ cha :", this.generatedIdBookDetail);
    console.log("ID nhận từ cha 123:", this.generatedIdBookDetail);
    this.newBookDetail.idbookdetail = this.generatedIdBookDetail;



    this.loadBookOptions();
    this.loadPromotionOptions();

    this.getBookOptions();
    this.getPromotionOptions();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['generatedIdBookDetail']) {
      this.newBookDetail.idbookdetail = changes['generatedIdBookDetail'].currentValue;
    }
  }


  resetForm() {
    this.newBookDetail = {
      idbookdetail: this.generatedIdBookDetail,
      idbook: '',
      promotion_code: '',
      time_book: '',
      quantity: 0,
      participant:'',

    };
    this.errorMessages = [];
  }

  loadBookOptions(): void {
    this.bookService.getList_BookCopppy().subscribe((books: any[]) => {
      const activeBooks = books.filter(book => book.status != 2);
      const bookOptions = activeBooks.map(book => ({
        value: book.idbook,
        label: book.tour?.tourname
      }));

      // Gán options cho trường 'account' (chính xác theo định nghĩa trong formFields)
      const field = this.formFields.find(field => field.name === 'idbook');
      if (field) {
        field.options = bookOptions;
      }
    });
  }

  loadPromotionOptions(): void {
    this.promotionService.getList_PromotionCopppy().subscribe((promotions: any[]) => {
      const activePromotions = promotions.filter(promotion => promotion.status != false);
      const promotionOptions = activePromotions.map(promotion => ({
        value: promotion.promotion_code,
        label: promotion.name
      }));

      // Gán options cho trường 'account' (chính xác theo định nghĩa trong formFields)
      const field = this.formFields.find(field => field.name === 'promotion_code');
      if (field) {
        field.options = promotionOptions;
      }
    });
  }

  getBookOptions(){
    this.bookService.getList_BookCopppy().subscribe((data : any)=>{
      this.bookOptions = data;
    })
  }

  onBookChange(selectBookId : string){
    const selectBookUser = this.bookOptions.find(
      (book) => book.idbook === selectBookId
    );
    this.newBookDetail.idbook = selectBookUser?.idbook;
    if(selectBookUser){
      this.newBookDetail.idbook = {
        idbook : selectBookUser.idbook,
        account : selectBookUser.account,
        tour : selectBookUser.tour,
        status : selectBookUser.status,

      };
      this.newBookDetail.idbook = selectBookUser;
      console.log('Sách đã chọn:',  this.newBookDetail.idbook);
    }
  }

  // onBookChange(selectBookId: string) {
  //   // Tìm đối tượng book đã chọn trong danh sách bookOptions
  //   const selectedBook = this.bookOptions.find((book) => book.idbook === selectBookId);

  //   if (selectedBook) {
  //     // Cập nhật `newBookDetail` với thông tin đầy đủ
  //     this.newBookDetail.idbook = selectedBook.idbook;
  //     this.newBookDetail.bookName = selectedBook.tour?.tourname || ''; // Nếu cần thêm thông tin bookName
  //     this.newBookDetail.account = selectedBook.account || ''; // Ví dụ thêm thông tin account

  //     console.log('Thông tin book đã chọn:', selectedBook); // Kiểm tra dữ liệu trong console
  //   } else {
  //     console.warn('Không tìm thấy book với ID:', selectBookId);
  //   }
  // }


  getPromotionOptions(){
    this.promotionService.getList_PromotionCopppy().subscribe((data : any)=>{
      this.promotionOptions = data;
    })
  }

  onPromotionChange(selectPromotionCode : string){
    const selectPromotionUser = this.promotionOptions.find(
      (promotion) => promotion.promotion_code === selectPromotionCode
    );
    if(selectPromotionUser){
      this.newBookDetail.promotion_code = {
        promotion_code : selectPromotionUser.promotion_code,
        code : selectPromotionUser.code,
        name : selectPromotionUser.name,
        description : selectPromotionUser.description,
        status : selectPromotionUser.status,

      };
      this.newBookDetail.promotion_code = selectPromotionUser;
      console.log(this.newBookDetail.promotion_code);
    }
  }

  // onPromotionChange(selectPromotionCode: string) {
  //   // Tìm đối tượng promotion đã chọn trong danh sách promotionOptions
  //   const selectPromotionUser = this.promotionOptions.find(
  //     (promotion) => promotion.promotion_code === selectPromotionCode
  //   );

  //   if (selectPromotionUser) {
  //     // Lưu toàn bộ thông tin của promotion đã chọn
  //     this.newBookDetail.promotion_code = selectPromotionUser.promotion_code; // Lưu mã promotion
  //     this.newBookDetail.promotionName = selectPromotionUser.name; // Lưu tên promotion (nếu cần)

  //     console.log('Thông tin promotion đã chọn:', selectPromotionUser); // Kiểm tra thông tin trong console
  //   } else {
  //     console.warn('Không tìm thấy promotion với mã:', selectPromotionCode);
  //   }
  // }


  onSelectChange(selectedValue: any, fieldName: string): void {
    if (!selectedValue) {
      console.warn(`Không có giá trị chọn cho trường: ${fieldName}`);
      return; // Nếu không có giá trị, dừng thực hiện
    }

    // Dựa vào fieldName để quyết định gọi hàm xử lý thích hợp
    switch (fieldName) {
      case 'idbook':
        this.handleBookChange(selectedValue);
        break;
      case 'promotion_code':
        this.handlePromotionChange(selectedValue);
        break;
      default:
        console.warn(`Không xử lý được trường hợp: ${fieldName}`);
        break;
    }
  }

  handleBookChange(selectedBookId: string): void {
    // Logic xử lý khi chọn một cuốn sách
    this.onBookChange(selectedBookId);
  }

  handlePromotionChange(selectedPromotionCode: string): void {
    // Logic xử lý khi chọn một mã khuyến mãi
    this.onPromotionChange(selectedPromotionCode);
  }





  validateBookData(): boolean {
    this.errorMessages = [];
    if (!this.newBookDetail.idbook) this.errorMessages.push('ID tài khoản không được để trống.');
    if (!this.newBookDetail.promotion_code) this.errorMessages.push('Thông tin tour không được để trống.');
    return this.errorMessages.length === 0;
  }


  onSubmit(){
    console.log('Dữ liệu gửi lên', this.newBookDetail);
    console.log('Selected Account ID:', this.newBookDetail.idbook);  // Kiểm tra giá trị của idaccount
    console.log('Selected Tour ID:', this.newBookDetail.promotion_code);        // Kiểm tra giá trị của idtour

    if(!this.validateBookData()) return;

    this.newBookDetail = {
      ...this.newBookDetail,
      status: 1,
      idbook : this.newBookDetail.idbook,
      promotion_code : this.newBookDetail.promotion_code,

    }

    console.log('Dữ liệu gửi lên lần 2', this.newBookDetail);
    this.bookDetailService.addBookDetail(this.newBookDetail).subscribe({
      next: (response) =>{
        this.BookDetailAdded.emit(this.newBookDetail);
        this.router.navigate(['admin/detail_book/add']);
        this.closeForm();
        this.resetForm();
      },
      error : (error) =>{
        console.error('Lỗi khi thêm book:', error);
        if (error.error) {
          console.error('Chi tiết lỗi từ backend:', error.error);
        } else {
          console.error('Lỗi không xác định:', error);
        }
      }
    });
  }



}
