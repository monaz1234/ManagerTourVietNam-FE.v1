import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ManagerHotelService } from '../../../service/hotel/manager-hotel.service';
import { Hotel } from '../../../interface/hotel.interface';
@Component({
  selector: 'app-edit-hotel',
  templateUrl: './edit-hotel.component.html',
  styleUrl: './edit-hotel.component.scss'
})
export class EditHotelComponent {

  @Input() selectedHotel: any; // Nhận dữ liệu người dùng đang được chỉnh sửa
  @Output() closeForm = new EventEmitter<void>(); // Emit sự kiện đóng form
  @Output() hotelUpdated = new EventEmitter<any>(); // Phát sự kiện sau khi cập nhật

  file: File | null = null;
  errorMessages: string[] = [];
  previewImage: string | null = null;
  hotels : Hotel[] = [];

  constructor(
    private hotelService: ManagerHotelService,
    private router: Router
  )
  {}


  ngOnInit(): void {
    if (!this.selectedHotel) {
      console.error('Không tìm thấy phòng để chỉnh sửa');
    }
    this.getListHotel();
    console.log("File anh",this.file);

  }

  getListHotel() {
    this.hotelService.hotels$.subscribe((data: Hotel[]) => {
      this.hotels = data; // Cập nhật danh sách người dùng
    });
  }

  formFields = [
    {name: 'id_hotel', label: 'Id của khách sạn', type: 'text', require: true},
    {name: 'name_hotel', label: 'Tên của khách sạn', type: 'text', require: true},
    {name: 'description', label: 'Mô tả', type: 'text', require: true},
    {name: 'room', label: 'Số phòng', type: 'text', require: true},
    {name: 'type_room', label: 'Loại phòng', type: 'text', require: true},
    {name: 'image', label: 'Hình ảnh', type: 'file', require: true, accept: '.png, .jpg'}
  ];


  resetForm() {
    this.selectedHotel ={
      id_hotel: '',
      name_hotel: '',
      description: '',
      room: '',
      type_room: '',
      image: '',
      status:true
    };
  }

  onSubmit() {
    this.errorMessages = [];

    // Kiểm tra các trường bắt buộc
    for (const field of this.formFields) {
      if (field.require && !this.selectedHotel[field.name]) {
        this.errorMessages.push(`Trường ${field.label} không được để trống`);
      }
    }

    if (this.errorMessages.length > 0) {
      return;
    }

    this.hotelService.updateHotel(this.selectedHotel, this.file).subscribe({
      next: () => {
        console.log('Cập nhật khách sạn thành công');
        if(this.previewImage != null) {
            const formData = new FormData();
          if (this.file) {
              formData.append('file', this.file);
              formData.append('vehicleName', this.selectedHotel.id_hotel); // file được chọn
          }
          this.hotelService.addImageHotelToBackend(formData).subscribe({
            next: () => {
              console.log('Tải ảnh lên thành công');
            },
            error: (error) => {
              console.error('Lỗi khi tải ảnh lên:', error);
              this.errorMessages.push('Có lỗi xảy ra khi tải ảnh lên');
            }
          });
        }
        this.refreshHotelData();
        this.hotelUpdated.emit(this.selectedHotel);
        this.closeForm.emit();
        this.getListHotel();
      },
      error: (err) => {
        this.errorMessages.push(err.message);
      }});


  }


  refreshHotelData() {
    this.hotelService.findHotel(this.selectedHotel.id_hotel).subscribe(hotel => {
      this.selectedHotel = hotel;
    })
  }

  onFileSelected(event: Event): void {
    const fileInput = event.target as HTMLInputElement;
    if (fileInput.files && fileInput.files.length > 0) {
      this.file = fileInput.files[0];
      this.selectedHotel.image = `img_${this.selectedHotel.id_vehicles}.png`; // Cập nhật thuộc tính 'image' của selectedVehicle

      // Tạo URL xem trước ảnh mới
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.previewImage = e.target.result; // Gán URL xem trước vào previewImage
      };
      reader.readAsDataURL(this.file);


    } else {
      // Nếu không có file nào được chọn, trả lại previewImage về null
      this.previewImage = null;
      ;

    }
  }
  getImageUrl(imageName: string): string {
    return `http://localhost:9000/api/hotel/images/${imageName}`;
  }




}




