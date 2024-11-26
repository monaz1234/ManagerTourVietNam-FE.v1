import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { BookdetailService } from '../../../service/bookdetail/bookdetail.service';
import { BookService } from '../../../service/book.service';
import { ManagerPromotionService } from '../../../service/promotion/manager-promotion.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-edit-book-detail',
  templateUrl: './edit-book-detail.component.html',
  styleUrl: './edit-book-detail.component.scss'
})
export class EditBookDetailComponent implements OnInit{


  @Input() selectedBookDetail : any;
  @Output() closeForm = new EventEmitter<void>();
  @Output() bookDetailUpdated = new EventEmitter<void>();

  bookOptions : any[] = [];
  promotionOptions: any[] = [];

  formFields =  [
    { name: 'idbookdetail', label: 'Id book detail', type: 'text', required: true },
    {
      name: 'idbook',
      label: 'Book',
      type: 'select',
      required: false,
      options: [] as { value: any, label: any }[]  // Khai báo rõ kiểu dữ liệu của options
    },
    {
      name: 'promotion_code',
      label: 'Promotion',
      type: 'select',
      required: false,
      options: [] as { value: any, label: any }[]  // Khai báo rõ kiểu dữ liệu của options
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

  ngOnInit() : void {
    if(this.selectedBookDetail){
      this.selectedBookDetail.idbook = this.selectedBookDetail.idbook?.idbook || '';
      this.selectedBookDetail.promotion_code = this.selectedBookDetail.promotion_code?.promotion_code || '';

      this.loadBookOptions();
      this.loadPromotionOptions();

      this.getBookOptions();
      this.getPromotionOptions();
    }
  }

  loadBookOptions(): void {
    this.bookService.getList_BookCopppy().subscribe((books: any[]) => {
      const activeBooks = books.filter(book => book.status !== 2);
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
      const activePromotions = promotions.filter(promotion => promotion.status !== false);
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
  getPromotionOptions(){
    this.promotionService.getList_PromotionCopppy().subscribe((data : any)=>{
      this.promotionOptions = data;
    })
  }
  getBookOptions(){
    this.bookService.getList_BookCopppy().subscribe((data : any)=>{
      this.bookOptions = data;
    })
  }

  onSubmit(): void{
    this.selectedBookDetail.idbook = {
      idbook: this.selectedBookDetail.idbook,
      // name_type: this.accountOptions.find(option => option.value === this.selectedBook.idaccount)?.label || '',
      // salary: 0,  // Set this value according to your requirements, maybe from the options
      // status: 1
    };

    this.selectedBookDetail.promotion_code = {
      promotion_code: this.selectedBookDetail.promotion_code,
      // name: this.tourOptions.find(option => option.value === this.selectedBook.idtour)?.label || '',
      // status: 1
    };     // Kiểm tra giá trị của idtour
    // Call service to update the account
    this.bookDetailService.updateBookDetail(this.selectedBookDetail.idbookdetail, this.selectedBookDetail).subscribe({
      next: (response) => {
        console.log('Chỉnh sửa thành công', response);
        this.bookDetailUpdated.emit(this.selectedBookDetail);
        this.closeForm.emit();
      },
      error: (error) => {
        console.error('Lỗi khi cập nhật người dùng', error);
      }
    });
  }

}
