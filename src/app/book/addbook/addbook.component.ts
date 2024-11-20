import { Tour } from './../../../interface/tour.interface';
import { Component, EventEmitter, Input, Output, SimpleChanges } from '@angular/core';
import { Book } from '../../../interface/book.interface';
import { BookService } from '../../../service/book.service';
import { Router } from '@angular/router';
import { AccountService } from '../../../service/account/account.service';
import { TourService } from '../../../service/tour/tour.service';
import { Account } from '../../../interface/account.interface';

@Component({
  selector: 'app-addbook',
  templateUrl: './addbook.component.html',
  styleUrl: './addbook.component.scss'
})
export class AddbookComponent {
  isEditBookVisible = true;
  closeForm() {
    this.isEditBookVisible = false; // Đặt lại trạng thái để ẩn form
    console.log('Form đã được đóng lại'); // Kiểm tra trong console
  }


  @Input() generatedIdBook: string = ''; // Nhận giá trị iduser từ component cha
  @Output() bookAdded = new EventEmitter<Book>(); // Phát sự kiện với kiểu User
  newBook: any = {
    idbook: '',
    account: '',
    tour: '',
    status: 1, // Gán trạng thái mặc định
  };
  errorMessages: string[] = [];
  activeAccounts: any[] = [];
  activeTours: any[] = [];
  accountOptions : Account[] = [];
  tourOptions : Tour[] = [];

  formFields: {
    name: string;
    label: string;
    type: string;
    required: boolean;
    options?: { value: string; label: string }[];
  }[] = [
    { name: 'idbook', label: 'Id book', type: 'text', required: true },
    {
      name: 'account', // Sửa lại name cho khớp
      label: 'Tài khoản người dùng',
      type: 'select',
      required: false,
      options: []
    },
    {
      name: 'tour', // Sửa lại name cho khớp
      label: 'Thông tin tour',
      type: 'select',
      required: false,
      options: []
    },
  ];



  constructor(private bookService : BookService,
     private router : Router,
     private accountService : AccountService,
     private tourService : TourService){}

  ngOnInit():void{
    console.log('ID nhận từ cha : ', this.generatedIdBook);
    this.newBook.idbook = this.generatedIdBook;

    this.loadAccountOptions();
    this.loadTourOptions();

    this.getTourOptions();
    this.getAccountOptions();


  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['generatedIdBook']) {
      this.newBook.idbook = changes['generatedIdBook'].currentValue;
    }
  }

  resetForm() {
    this.newBook = {
      idbook: this.generatedIdBook,
      account: '',
      tour: '',
      status: 1, // Gán trạng thái mặc định
      typeUser: '',
    };
    this.errorMessages = [];
  }

  loadAccountOptions(): void {
  this.accountService.getList_AccountCopppy().subscribe((accounts: any[]) => {
    const activeAccounts = accounts.filter(account => account.status !== 2);
    const accountOptions = activeAccounts.map(account => ({
      value: account.idaccount,
      label: account.username
    }));

    // Gán options cho trường 'account' (chính xác theo định nghĩa trong formFields)
    const field = this.formFields.find(field => field.name === 'account');
    if (field) {
      field.options = accountOptions;
    }
  });
}

loadTourOptions(): void {
  this.tourService.getList_TourCopppy().subscribe((tours: any[]) => {
    const activeTours = tours.filter(tour => tour.status !== 2);
    const tourOptions = activeTours.map(tour => ({
      value: tour.idtour,
      label: tour.tourname
    }));

    // Gán options cho trường 'tour' (chính xác theo định nghĩa trong formFields)
    const field = this.formFields.find(field => field.name === 'tour');
    if (field) {
      field.options = tourOptions;
    }
  });
}



  getAccountOptions(){
    this.accountService.getList_AccountCopppy().subscribe((data : any)=>{
      this.accountOptions = data;
    })
  }

  onAccountChange(selectAccountId : string){
    const selectAccountUser = this.accountOptions.find(
      (account) => account.idaccount === selectAccountId
    );
    if(selectAccountUser){
      this.newBook.idaccount = {
        idaccount : selectAccountUser.idaccount,
        username : selectAccountUser.username,
        password : selectAccountUser.password,
        image : selectAccountUser.image,
        status : selectAccountUser.status,
        id_type_user : selectAccountUser.typeUser,
        iduser : selectAccountUser.user
      };
    }
  }



  getTourOptions(){
    this.tourService.getList_TourCopppy().subscribe((data : any) =>{
      this.tourOptions = data;
    });
  }

  onTourChange(selectedTourId : string){
    const selectedTour = this.tourOptions.find(
      (tour) => tour.idtour === selectedTourId
    );

    if(selectedTour){
      this.newBook.idtour = {
        idtour : selectedTour.idtour,
        idtuor_type : selectedTour.idtour_type,
        tourname : selectedTour.tourname,
        location : selectedTour.location,
        status : selectedTour.status,
        description : selectedTour.description,
        image : selectedTour.image,
        is_deleted : selectedTour.is_deleted
      };
    }
  }

  onSelectChange(selectedValue: any){
    this.onAccountChange(selectedValue);
    this.onTourChange(selectedValue);
  }



  validateBookData(): boolean {
    this.errorMessages = [];
    if (!this.newBook.idaccount) this.errorMessages.push('ID tài khoản không được để trống.');
    if (!this.newBook.idtour) this.errorMessages.push('Thông tin tour không được để trống.');
    return this.errorMessages.length === 0;
  }

onSubmit(){
  console.log('Dữ liệu gửi lên', this.newBook);
  console.log('Selected Account ID:', this.newBook.idaccount);  // Kiểm tra giá trị của idaccount
  console.log('Selected Tour ID:', this.newBook.idtour);        // Kiểm tra giá trị của idtour

  if(!this.validateBookData()) return;

  this.newBook = {
    ...this.newBook,
    status: 1,
    account : this.newBook.idaccount,
    tour : this.newBook.idtour,

  }
  console.log('Dữ liệu gửi lên lần 2', this.newBook);
  this.bookService.addBook(this.newBook).subscribe({
    next: (response) =>{
      this.bookAdded.emit(this.newBook);
      this.router.navigate(['admin/book/add']);
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
