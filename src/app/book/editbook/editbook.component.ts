import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Router } from '@angular/router';
import { BookService } from '../../../service/book.service';
import { AccountService } from '../../../service/account/account.service';
import { TourService } from '../../../service/tour/tour.service';

@Component({
  selector: 'app-editbook',
  templateUrl: './editbook.component.html',
  styleUrl: './editbook.component.scss'
})
export class EditbookComponent {
  @Input() selectedBook : any;
  @Output() closeForm = new EventEmitter<void>();
  @Output() bookUpdated = new EventEmitter<void>();

  accountOptions : any[] = [];
  tourOptions : any[] = [];

formFields = [
  {name : 'idbook', label : 'Thông tin idbook', type : 'text', required : true},
  {
    name: 'account', // Sửa lại name cho khớp
    label: 'Tài khoản người dùng',
    type: 'select',
    required: false,
    options: [],
    displayName: ''
  },
  {
    name: 'tour', // Sửa lại name cho khớp
    label: 'Thông tin tour',
    type: 'select',
    required: false,
    options: [],
    displayName: ''
  },
  {
    name: 'status',
    label: 'Trạng thái của người dùng',
    type: 'select',
    required: false,
    options: [
      { value: '1', label: 'Hoạt động' },
      { value: '2', label: 'Đã ngưng hoạt động' }
    ]
  }
];

constructor(
  private router : Router,
  private bookService : BookService,
  private accountService : AccountService,
  private tourService : TourService,
){}

ngOnInit() : void {
  if(this.selectedBook){
    this.selectedBook.account = this.selectedBook.account?.idaccount || '';
    this.selectedBook.tour = this.selectedBook.tour?.idtour || '';

    this.loadAccountOptions();
    this.loadTourOptions();
  }
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

onSubmit(): void{
  this.selectedBook.account = {
    idaccount: this.selectedBook.idaccount,
    name_type: this.accountOptions.find(option => option.value === this.selectedBook.idaccount)?.label || '',
    salary: 0,  // Set this value according to your requirements, maybe from the options
    status: 1
  };

  this.selectedBook.tour = {
    iduser: this.selectedBook.idtour,
    name: this.tourOptions.find(option => option.value === this.selectedBook.idtour)?.label || '',
    status: 1
  };     // Kiểm tra giá trị của idtour
  // Call service to update the account
  this.bookService.updateBook(this.selectedBook.idbook, this.selectedBook).subscribe({
    next: (response) => {
      console.log('Chỉnh sửa thành công', response);
      this.bookUpdated.emit(this.selectedBook);
      this.closeForm.emit();
    },
    error: (error) => {
      console.error('Lỗi khi cập nhật người dùng', error);
    }
  });
}

}
