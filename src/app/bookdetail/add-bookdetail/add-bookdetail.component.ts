import { Component, EventEmitter, Input, Output, SimpleChanges} from '@angular/core';
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
export class AddBookdetailComponent {

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

  onBoookChange(selectBookId : string){
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
      // this.newBookDetail.idbook = selectBookUser.tour?.tourname;
      // console.log('Sách đã chọn:', selectBookUser.tour?.tourname);
    }
  }

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
      // this.newBookDetail.promotion_code = selectPromotionUser.description;
    }
  }

  onSelectChange(selectedValue: any) {
    // onSelectChange(selectedValue: any, fieldName: string) {

      this.onBoookChange(selectedValue);

      this.onPromotionChange(selectedValue);

      // this.newBookDetail[fieldName] = selectedValue;

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
