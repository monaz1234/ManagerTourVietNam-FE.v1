
import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';
import { ManagerHotelService } from '../../../service/hotel/manager-hotel.service';
import {Hotel} from '../../../interface/hotel.interface';

@Component({
  selector: 'app-add-hotel',
  templateUrl: './add-hotel.component.html',
  styleUrl: './add-hotel.component.scss'
})
export class AddHotelComponent {
  @Input() generatedIdHotel: string='';

  newHotel: any = {
    id_hotel:'',
    name_hotel: '',
    description: '',
    // room: '',
    // type_room: '',
    image: '',
    status: true,
};
file: File | null = null;
errorMessages: string[] = [];
hotels :Hotel[] = [];

formFields = [
  {name: 'id_hotel', label: 'Id của khách sạn', type: 'text', require: true},
  {name: 'name_hotel', label: 'Tên của khách sạn', type: 'text', require: true},
  {name: 'description', label: 'Mô tả', type: 'text', require: true},

  {name: 'image', label: 'Hình ảnh', type: 'file', require: true, accept: '.png, .jpg'},
  {name:'price', label: 'Giá', type: 'text', require: true},
];

constructor(
  private hotelService: ManagerHotelService,
  private router: Router
) {}


ngOnInit(): void {
  this.newHotel.id_hotel = this.generatedIdHotel;
  console.log('Generated Hotel Id:',this.newHotel.id_hotel);

}
onSubmit() {
  console.log(this.newHotel);

  this.errorMessages = [];

  // Validate name_hotel
  if (!this.newHotel.name_hotel) {
    this.errorMessages.push('Vui lòng nhập tên của khách sạn');
  }

  // Validate description
  if (!this.newHotel.description) {
    this.errorMessages.push('Vui lòng nhập mô tả cho khách sạn');
  }

  // Validate room
  // if (!this.newHotel.room) {
  //   this.errorMessages.push('Vui lòng nhập thông tin về phòng');
  // } else if (this.newHotel.room.length > 4) {
  //   this.errorMessages.push('Thông tin phòng chỉ được giới hạn 4 ký tự');
  // }

  // Validate type_room
  // if (!this.newHotel.type_room) {
  //   this.errorMessages.push('Vui lòng nhập loại phòng');
  // } else if (this.newHotel.type_room.length > 4) {
  //   this.errorMessages.push('Loại phòng chỉ được giới hạn 4 ký tự');
  // }

  // Kiểm tra file đã được chọn
  if (!this.file) {
    this.errorMessages.push('Ảnh là bắt buộc. Vui lòng chọn một ảnh.');
}

  if (this.errorMessages.length > 0) {
    return; // Nếu có lỗi thì không tiếp tục
}


  this.hotelService.addHotel(this.newHotel).subscribe(
    (data) => {
      console.log(data);
      this.router.navigate(['/khachsan/add']);
    },
    (error) => {
      console.log(error);
    }
  );


  const formData = new FormData();
  if (this.file) {
    formData.append('file', this.file);
    formData.append('hotelName', this.newHotel.id_hotel);
  }
  this.hotelService.addImageHotelToBackend(formData).subscribe({
    next: (response) => {
      console.log('Thêm ảnh khách sạn thành công:', response.message);
      this.router.navigate(['/khachsan/add']);
    },
    error: (error) => {
      console.error('Lỗi khi thêm ảnh khách sạn', error);
      this.errorMessages.push('Đã xảy ra lỗi khi thêm ảnh khách sạn. Vui lòng thử lại.');
    }
  });
}


addHotel (){
  this.newHotel ={
    id_hotel: this.newHotel.id_hotel,
    name_hotel: this.newHotel.name_hotel,
    description: this.newHotel.description,
    image: '',
    price:this.newHotel.price,
    status: true
  };
}
onFileChange(event: Event) {
  const input = event.target as HTMLInputElement;
  if (input.files && input.files.length > 0) {
    this.file = input.files[0];
    this.newHotel.image = `img_${this.newHotel.id_hotel}`; // Gán file đã chọn vào newVehicle.image
  }
}

}
