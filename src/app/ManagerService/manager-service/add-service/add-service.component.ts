import { Component, EventEmitter, Input, Output, SimpleChanges } from '@angular/core';
import { Service } from '../../../../interface/service.interface';
import { ServiceService } from '../../../../service/ServiceService/service.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-add-service',
  templateUrl: './add-service.component.html',
  styleUrl: './add-service.component.scss'
})
export class AddServiceComponent {

  formattedPrice: string = '';

  isEditServiceVisible = true;
  closeForm() {
    this.isEditServiceVisible = false; // Đặt lại trạng thái để ẩn form
    console.log('Form đã được đóng lại'); // Kiểm tra trong console
  }

  @Input() generatedIdService: string = '';
  @Output() serviceAdd = new EventEmitter<Service>();

  newService : any = {
    id_service: '',
    name_service: '',
    description: '',
    time_start:'',
    time_end:'',
    plant: '',
    price: 0,
    status: true,
  }
  errorMessages: string[] = [];
  formFields : {
    name: string;
    label: string;
    type: string;
    required: boolean;
    options?: { value: string; label: string }[];
  }[] = [
    { name: 'id_service', label: 'Id thông tin dịch', type: 'text', required: true },
    { name: 'name_service', label: 'Tên dịch vụ', type: 'text', required: false },
    { name: 'description', label: 'Mô tả dịch vụ', type: 'textarea', required: false },
    { name: 'time_start', label: 'Thời gian bắt đầu', type: 'date', required: false },
    { name: 'time_end', label: 'Thời gian kết thúc', type: 'date', required: false },
    { name: 'plant', label: 'Kế hoạch', type: 'textarea', required: false },
    { name: 'price', label: 'Giá cả', type: 'text', required: false },
  ];

  constructor(
    private serviceService : ServiceService,
    private router : Router
  ){}

ngOnInit(): void {
  console.log('ID nhận từ cha', this.generatedIdService);
  this.newService.id_service = this.generatedIdService;

}

ngOnChanges(changes: SimpleChanges): void {
  if (changes['generatedIdService']) {
    console.log('ID nhận được:', changes['generatedIdService'].currentValue);
    this.newService.id_service = changes['generatedIdService'].currentValue;
  }
}

onPriceInput(value: string) {
  // Loại bỏ dấu chấm hoặc ký tự không phải số
  const rawValue = value.replace(/\./g, '').replace(/[^0-9]/g, '');
  // Lưu giá trị thô vào `price`
  this.newService.price = rawValue ? parseInt(rawValue, 10) : 0;
  // Chỉ định dạng giá trị để hiển thị
  this.formattedPrice = new Intl.NumberFormat('vi-VN').format(this.newService.price);
}
onPriceBlur(): void {
  this.formattedPrice = new Intl.NumberFormat('vi-VN').format(this.newService.price);
}





resetForm() {
  this.newService = {
    id_service: this.generatedIdService,
    name_service: '',
    description: '',
    time_start:'',
    time_end:'',
    plant: '',
    price: 0,
    status: true,
  };
  this.errorMessages = []; // Reset thông báo lỗi
}

onSubmit(){
  console.log('Dữ liệu gửi lên', this.newService);
  this.errorMessages = [];
  this.newService.status = 1;

  this.newService = {
    id_service : this.newService.id_service,
    name_service : this.newService.name_service,
    description : this.newService.description,
    time_start : this.newService.time_start,
    time_end : this.newService.time_end,
    plant : this.newService.plant,
    price : this.newService.price,
    status : this.newService.status,
  };

  this.serviceService.addService(this.newService).subscribe({
    next : (response) =>{
      this.serviceAdd.emit(this.newService);
      this.closeForm();
      this.resetForm();
      this.router.navigate(['admin/service/add']);
    },
    error : (error) =>{
      console.error('Lỗi khi thêm thông loại người dùng', error);
    }
  });

}







}
