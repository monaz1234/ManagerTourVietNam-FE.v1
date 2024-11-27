import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Router } from '@angular/router';
import { ServiceService } from '../../../../service/ServiceService/service.service';

@Component({
  selector: 'app-edit-service',
  templateUrl: './edit-service.component.html',
  styleUrl: './edit-service.component.scss'
})
export class EditServiceComponent {

  @Input() selectedServiceUser: any;
  @Output() closeForm = new EventEmitter<void>();
  @Output() ServiceUpdated = new EventEmitter<any>();

  constructor(
    private router : Router,
    private managerService : ServiceService,
  ){ }

  ngOnInit(): void {
    console.log('Selected Service User mới nhất: ', this.selectedServiceUser.id_service);
    if (!this.selectedServiceUser) {
      console.error('Không tìm thấy loại người dùng để chỉnh sửa');
      alert('Không có dữ liệu người dùng để chỉnh sửa. Vui lòng chọn một người dùng hợp lệ.');
    }
  }


  formFields = [
    { name: 'id_service', label: 'Id thông tin dịch', type: 'text', required: true },
    { name: 'name_service', label: 'Tên dịch vụ', type: 'text', required: false },
    { name: 'description', label: 'Mô tả dịch vụ', type: 'textarea', required: false },
    { name: 'time_start', label: 'Thời gian bắt đầu', type: 'date', required: false },
    { name: 'time_end', label: 'Thời gian kết thúc', type: 'date', required: false },
    { name: 'plant', label: 'Kế hoạch', type: 'textarea', required: false },
    { name: 'price', label: 'Giá cả', type: 'text', required: false },
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

  resetFormTypeUser() {
    this.selectedServiceUser = {
      id_service: '',
      name_service: '',
      description: '',
      time_start: '',
      time_end: '',
      plant: '',
      price: 0,
      status: true,
    };
    // Gọi closeForm để đóng form sau khi reset
    this.closeForm.emit();
  }

  refreshServiceData() {
    this.managerService.findService(this.selectedServiceUser.id_service).subscribe({
      next: (ServiceUser) => {
        console.log('Dữ liệu dịch vụ mới: ', ServiceUser);
        this.selectedServiceUser = ServiceUser; // Cập nhật dữ liệu cho selectedServiceUser
      },
      error: (error) => {
        console.error('Lỗi khi lấy dữ liệu dịch vụ', error);
      }
    });
  }

  onPriceInput(value: string) {
    // Loại bỏ dấu chấm hoặc ký tự không phải số
    const rawValue = value.replace(/\./g, '').replace(/[^0-9]/g, '');
    // Định dạng lại giá trị
    this.selectedServiceUser.price = rawValue ? parseInt(rawValue, 10) : 0;
    // Hiển thị giá tiền được định dạng
    this.selectedServiceUser.price = new Intl.NumberFormat('vi-VN').format(this.selectedServiceUser.price);
  }



  onSubmit() {
    // Chuyển đổi giá tiền về dạng số nguyên trước khi gửi
    const payload = {
      ...this.selectedServiceUser,
      price: parseInt(this.selectedServiceUser.price.replace(/\./g, ''), 10)
    };

    this.managerService.updateService(this.selectedServiceUser.id_service, payload).subscribe({
      next: (response) => {
        console.log('Chỉnh sửa thành công', response);
        this.refreshServiceData();
        this.ServiceUpdated.emit(this.selectedServiceUser);
        this.closeForm.emit();
      },
      error: (error) => {
        console.error('Lỗi khi cập nhật dịch vụ', error);
      }
    });
  }

}
