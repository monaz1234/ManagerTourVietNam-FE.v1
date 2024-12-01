import { Component, EventEmitter, Input, Output, SimpleChanges } from '@angular/core';
import { Tour } from '../../../../interface/tour.interface';
import { TourService } from '../../../../service/tour/tour.service';
import { Router } from '@angular/router';
import { TypeTourService } from '../../../../service/typeTour/type-tour.service';

@Component({
  selector: 'app-add-tour',
  templateUrl: './add-tour.component.html',
  styleUrl: './add-tour.component.scss'
})
export class AddTourComponent {


  isEditServiceVisible = true;
  closeForm() {
    this.isEditServiceVisible = false; // Đặt lại trạng thái để ẩn form
    console.log('Form đã được đóng lại'); // Kiểm tra trong console
  }

  @Input() generatedIdTour: string = '';
  @Output() tourAdd = new EventEmitter<Tour>();

  newTour : any = {
    idtour: "",
    idtour_type: "",
    tourname: "",
    location: "",
    status: true,
    description:  "",
    image:  "",
    is_deleted: 0,
  }
  errorMessages: string[] = [];
  activeTypeTour: any[] = [];
  formFields : {
    name: string;
    label: string;
    type: string;
    required: boolean;
    options?: { value: string; label: string }[];
  }[] = [
    { name: 'idtour', label: 'Id thông tin tour', type: 'text', required: true },
    { name: 'tourname', label: 'Tên tour', type: 'text', required: false },
    { name: 'location', label: 'Vị trí', type: 'text', required: false },
    { name: 'description', label: 'Mô tả', type: 'textarea', required: false },
    // { name: 'idtour_type', label: 'Loại tour', type: 'text', required: true },
    {
      name: 'idtour_type',
      label: 'Loại tour',
      type: 'select',
      required: false,
      options: []
    },
  ];

  constructor(
    private tourService : TourService,
    private typeTourService : TypeTourService,
    private router : Router
  ){}

ngOnInit(): void {
  console.log('ID nhận từ cha', this.generatedIdTour);
  this.newTour.idtour = this.generatedIdTour;
  this.loadTypeTourOptions(); // Thêm dòng này
  this.getTypeTourOptions();

}

ngOnChanges(changes: SimpleChanges): void {
  if (changes['generatedIdTour']) {
    console.log('ID nhận được:', changes['generatedIdTour'].currentValue);
    this.newTour.idtour = changes['generatedIdTour'].currentValue;
  }
}
typeTourOptions: {idtour_type: string; name_type: string}[] = [];
getTypeTourOptions() {
  this.typeTourService.getList_TourTypeCopppyNew().subscribe((data: any) => {
    this.typeTourOptions = data;
  });
}
loadTypeTourOptions(): void {
  this.typeTourService.getList_TourTypeCopppyNew().subscribe((typeUsers: any[]) => {
    // Filter out typeUsers with status === 2
    console.log('Dữ liệu loại tour:', typeUsers);
    this.activeTypeTour = typeUsers;

    // Map active users to the id_type_user options format
    const idTypeTourOptions = this.activeTypeTour.map(user => ({
      value: user.idtour_type,
      label: user.name_type
    }));

    const idTypeTourField = this.formFields.find(field => field.name === 'idtour_type');
    if (idTypeTourField) {
      idTypeTourField.options = idTypeTourOptions;
    }

    // Optionally, hide id_type_user field if no active users
    if (this.activeTypeTour.length === 0) {this.formFields = this.formFields.filter(field => field.name !== 'idtour_type');
    }
  });
}



resetForm() {
  this.newTour = {
    idtour: this.generatedIdTour,
    idtour_type: "",
    tourname: "",
    location: "",
    status: true,
    description:  "",
    image:  "",
    is_deleted: 0,
  };
  this.errorMessages = []; // Reset thông báo lỗi
}

onSubmit() {
  console.log('Dữ liệu gửi lên', this.newTour);
  this.errorMessages = [];
  this.newTour.status = 1;

  // Xử lý idtour_type
  this.newTour.idtour_type = this.typeTourOptions.find(
    option => option.idtour_type === this.newTour.idtour_type
  )?.idtour_type || '';

  this.tourService.addTour(this.newTour).subscribe({
    next: (response) => {
      console.log('Thêm tour thành công', response);
      this.tourAdd.emit(response);
      this.closeForm();
      this.resetForm();
      this.router.navigate(['admin/tour/add']);
    },
    error: (error) => {
      console.error('Lỗi khi thêm tour', error);
      this.errorMessages.push('Có lỗi xảy ra khi thêm tour.');
    },
  });
}






}
