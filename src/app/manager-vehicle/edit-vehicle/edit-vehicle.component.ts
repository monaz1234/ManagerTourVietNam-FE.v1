import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ManagerVehicleService } from '../../../service/vehicle/vehicle.service';
import { User } from '../../../interface/user.interface';
import { ManagerUserService } from '../../../service/manager-user.service';
interface Option {
  id: string; // hoặc số nếu ID là kiểu số
  name: string;
}
@Component({
  selector: 'app-edit-vehicle',
  templateUrl: './edit-vehicle.component.html',
  styleUrl: './edit-vehicle.component.scss'
})

export class EditVehicleComponent  {

  @Input() selectedVehicle: any; // Nhận dữ liệu người dùng đang được chỉnh sửa
  @Output() closeForm = new EventEmitter<void>(); // Emit sự kiện đóng form
  @Output() vehicleUpdated = new EventEmitter<any>(); // Phát sự kiện sau khi cập nhật

  file: File | null = null;
  errorMessages: string[] = [];
  users: User[] = [];
  previewImage: string | null = null;

  constructor(
    private userService: ManagerUserService,
    private vehicleService: ManagerVehicleService,
    private router: Router
  )
  {}

  ngOnInit(): void {
    if (!this.selectedVehicle) {
      console.error('Không tìm thấy phương tiện để chỉnh sửa');
    }
    this.getListDriver();
    console.log("File anh",this.file);

  }
  getListDriver() {
    this.userService.users$.subscribe((data: User[]) => {
      this.users = data; // Cập nhật danh sách người dùng
      this.formFields[3].options = this.users.map(user => ({
        id: user.iduser, // Hoặc thuộc tính ID tương ứng với User
        name: user.name // Hoặc thuộc tính tên tương ứng với User
      })) as Option[]; // Đảm bảo kiểu trả về là Option[]
    });
  }
  formFields = [
    { name: 'id_vehicles', label: 'Id của phương tiện', type: 'text', require: true },
    { name: 'name_vehicles', label: 'Tên của phương tiện', type: 'text', require: true },
    { name: 'place_vehicles', label: 'Số chỗ của xe', type: 'text', require: true },
    {
      name: 'driver',
      label: 'Tài xế',
      type: 'select',
      require: true,
      options: [] as Option[] // Khai báo kiểu cho options
    },
    {
      name: 'image',
      label: 'Hình ảnh',
      type: 'file',
      require: true,
      accept: '.png, .jpg' // Chỉ cho phép tải lên hình ảnh PNG hoặc JPG
    },
    { name: 'description', label: 'Mô tả', type: 'text', require: true },
    { name: 'price', label: 'Giá tiền', type: 'number', require: true },
  ];
  resetForm() {
    this.selectedVehicle = {
      id_vehicles: '',
      name_vehicles: '',
      place_vehicles: '',
      driver: '',
      image: '',
      description: '',
      price:0,
      status: true // Gán trạng thái mặc định
    };
  }
  onSubmit() {
    this.errorMessages = [];

    // Kiểm tra các trường bắt buộc
    for (const field of this.formFields) {
      if (field.require && !this.selectedVehicle[field.name]) {
        this.errorMessages.push(`Trường ${field.label} không được để trống`);
      }
    }

    if (this.errorMessages.length > 0) {
      return;
    }

    console.log('Dữ liệu cần cập nhật:', this.selectedVehicle);


    // Gửi yêu cầu cập nhật phương tiện
    this.vehicleService.updateVehicle(this.selectedVehicle.id_vehicles, this.selectedVehicle).subscribe({
      next: () => {
        console.log('Chỉnh sửa thành công:', this.selectedVehicle);
        if(this.previewImage != null) {
          const formData = new FormData();
        if (this.file) {
            formData.append('file', this.file);
            formData.append('vehicleName', this.selectedVehicle.id_vehicles); // file được chọn
        }
          //this.vehicleService.deleteImage(this.selectedVehicle.image);
          this.vehicleService.addImageVehicleToBackend(formData).subscribe({
            next: () => {
              console.log('Tải ảnh lên thành công');
            },
            error: (error) => {
              console.error('Lỗi khi tải ảnh lên:', error);
              this.errorMessages.push('Có lỗi xảy ra khi tải ảnh lên');
            }
          });
        }
        this.refreshVehicleData();
        this.vehicleUpdated.emit(this.selectedVehicle);
        this.closeForm.emit();
        this.getListDriver();
      },
      error: (error) => {
        this.errorMessages.push('Có lỗi xảy ra, vui lòng thử lại sau');
      }
    });
  }


  refreshVehicleData() {
    this.vehicleService.findVehicle(this.selectedVehicle.id_vehicles).subscribe(vehicle => {
      this.selectedVehicle = vehicle;
    });
  }
  onFileSelected(event: Event): void {
    const fileInput = event.target as HTMLInputElement;
    if (fileInput.files && fileInput.files.length > 0) {
      this.file = fileInput.files[0];
      this.selectedVehicle.image = `img_${this.selectedVehicle.id_vehicles}.png`; // Cập nhật thuộc tính 'image' của selectedVehicle

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
    const imageString =imageName+".png";
    return `http://localhost:9000/api/vehicle/images/${imageString}`;
  }
}
