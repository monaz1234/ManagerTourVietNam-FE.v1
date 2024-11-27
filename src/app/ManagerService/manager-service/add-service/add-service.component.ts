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
    { name: 'description', label: 'Tên dịch vụ', type: 'textarea', required: false },
    { name: 'time_start', label: 'Thời gian bắt đầu', type: 'date', required: false },
    { name: 'time_start', label: 'Thời gian bắt đầu', type: 'date', required: false },
    { name: 'plant', label: 'Kế hoạch', type: 'textarea', required: false },
    { name: 'price', label: 'Giá cả', type: 'number', required: false },
  ];

  constructor(
    private serviceService : ServiceService,
    private router : Router
  ){}

ngOnInit(): void {
  console.log('ID nhận từ cha', this.generatedIdService);
  this.newService.id_service = this.generatedIdService;
  // this.loadSalaryOptions();
}

ngOnChanges(changes: SimpleChanges): void {
  if (changes['generatedIdService']) {
    console.log('ID nhận được:', changes['generatedIdService'].currentValue);
    this.newService.id_service = changes['generatedIdService'].currentValue;
  }
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







}
