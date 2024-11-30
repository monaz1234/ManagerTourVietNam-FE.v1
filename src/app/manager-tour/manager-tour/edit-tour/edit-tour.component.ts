import { Component, EventEmitter, Input, Output } from '@angular/core';
import { TourService } from '../../../../service/tour/tour.service';
import { TypeTourService } from '../../../../service/typeTour/type-tour.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-edit-tour',
  templateUrl: './edit-tour.component.html',
  styleUrl: './edit-tour.component.scss'
})
export class EditTourComponent {
  @Input() selectedToured: any;
  @Output() closeForm = new EventEmitter<void>();
  @Output() TouredUpdated = new EventEmitter<any>();

  constructor(
    private tourService : TourService,
    private typeTourService : TypeTourService,
    private router : Router
  ){}

  errorMessages: string[] = [];
  activeTypeTour: any[] = [];

  ngOnInit(): void {
    console.log('Selected Service User mới nhất: ', this.selectedToured.idtour);
    this.loadTypeTourOptions(); // Thêm dòng này
    this.getTypeTourOptions();
    if (!this.selectedToured) {
      console.error('Không tìm thấy loại người dùng để chỉnh sửa');
      alert('Không có dữ liệu người dùng để chỉnh sửa. Vui lòng chọn một người dùng hợp lệ.');
    }

  }


  formFields = [
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
    {
      name: 'status',
      label: 'Trạng thái của người dùng',
      type: 'select',
      required: false,
      options: [
        { value: true, label: 'Hoạt động' },
        { value: false, label: 'Đã ngưng hoạt động' }
      ]
    }
  ];

  resetFormTypeTour(){
    this.selectedToured = {
    idtour: "",
    idtour_type: "",
    tourname: "",
    location: "",
    status: true,
    description:  "",
    image:  "",
    is_deleted: 0,
    };
    this.closeForm.emit();
  }

  refreshTourData() {
    this.tourService.findTour(this.selectedToured.idtour).subscribe({
      next: (TourUser) => {
        console.log('Dữ liệu dịch vụ mới: ', TourUser);
        this.selectedToured = TourUser; // Cập nhật dữ liệu cho selectedServiceUser
      },
      error: (error) => {
        console.error('Lỗi khi lấy dữ liệu dịch vụ', error);
      }
    });
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

onSubmit() {
  // Chuyển đổi giá tiền về dạng số nguyên trước khi gửi
  const payload = {
    ...this.selectedToured,
    // price: parseInt(this.selectedToured.price.replace(/\./g, ''), 10)
  };

  this.tourService.updateTours(this.selectedToured.idtour, payload).subscribe({
    next: (response) => {
      console.log('Chỉnh sửa thành công', response);
      this.refreshTourData();
      this.TouredUpdated.emit(response);
      this.closeForm.emit();
    },
    error: (error) => {
      console.error('Lỗi khi cập nhật dịch vụ', error);
    }
  });
}


}
