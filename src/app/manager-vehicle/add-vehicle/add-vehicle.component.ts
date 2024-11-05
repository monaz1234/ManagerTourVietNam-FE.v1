import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';
import { ManagerVehicleService } from '../../../service/vehicle/vehicle.service';
import { ManagerUserService } from '../../../service/manager-user.service';
import { User } from '../../../interface/user.interface';
import { response } from 'express';

// Định nghĩa kiểu cho các tùy chọn
interface Option {
  id: string; // hoặc số nếu ID là kiểu số
  name: string;
}

@Component({
  selector: 'app-add-vehicle',
  templateUrl: './add-vehicle.component.html',
  styleUrls: ['./add-vehicle.component.scss'] // Đổi thành styleUrls
})
export class AddVehicleComponent {
  @Input() generatedIdVehicle: string=''; // Nhận giá trị idvehicle từ component cha

  newVehicle: any = {
    id_vehicles: '',
    name_vehicles: '',
    place_vehicles: '',
    driver: '',
    image: '',
    description: '',
    status: true // Gán trạng thái mặc định
  };
  file: File | null = null;
  errorMessages: string[] = [];
  users: User[] = [];

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
      accept: '.png, .jpg, .jpeg' // Chỉ cho phép tải lên hình ảnh PNG hoặc JPG
    },
    { name: 'description', label: 'Mô tả', type: 'text', require: true },
  ];

  constructor(
    private userService: ManagerUserService,
    private vehicleService: ManagerVehicleService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.newVehicle.id_vehicles = this.generatedIdVehicle; // Gán idvehicle từ cha vào form
    console.log('Generated Vehicle ID:', this.generatedIdVehicle);
    this.getListDriver();
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
  onSubmit() {
    this.errorMessages = [];

    // Kiểm tra các trường bắt buộc
    if (!this.newVehicle.name_vehicles || this.newVehicle.name_vehicles.trim() === '') {
        this.errorMessages.push('Tên của phương tiện là bắt buộc.');
    }
    if (!this.newVehicle.place_vehicles || this.newVehicle.place_vehicles.trim() === '') {
        this.errorMessages.push('Số chỗ của xe là bắt buộc.');
    }
    if (!this.newVehicle.driver || this.newVehicle.driver.trim() === '') {
        this.errorMessages.push('Tài xế là bắt buộc.');
    }
    if (!this.newVehicle.description || this.newVehicle.description.trim() === '') {
        this.errorMessages.push('Mô tả là bắt buộc.');
    }

    // Kiểm tra số chỗ
    const numberIntPlaces = /^\d+$/;
    if (!numberIntPlaces.test(this.newVehicle.place_vehicles)) {
        this.errorMessages.push('Số chỗ phải là số nguyên dương');
    }
    if (this.newVehicle.place_vehicles <= 0 || this.newVehicle.place_vehicles > 200) {
        this.errorMessages.push('Số chỗ phải lớn hơn 0 và nhỏ hơn hoặc bằng 200');
    }

    // Kiểm tra file đã được chọn
    if (!this.file) {
        this.errorMessages.push('Ảnh là bắt buộc. Vui lòng chọn một ảnh.');
    }

    if (this.errorMessages.length > 0) {
        return; // Nếu có lỗi thì không tiếp tục
    }



    // Gọi API để thêm phương tiện
    this.vehicleService.addVehicle(this.newVehicle).subscribe({
        next: (response) => {
            console.log('Thêm phương tiện thành công:', response.message);
            this.router.navigate(['/phuongtien/add']); // Thêm ảnh phương tiện
        },
        error: (error) => {
            console.log(this.newVehicle);

            console.error('Lỗi khi thêm phương tiện', error);
            this.errorMessages.push('Đã xảy ra lỗi khi thêm phương tiện. Vui lòng thử lại.');
        }
    });

     // Tạo FormData để gửi file và tên phương tiện
     const formData = new FormData();
     if (this.file) {
         formData.append('file', this.file);
         formData.append('vehicleName', this.newVehicle.id_vehicles); // file được chọn
     }
     this.vehicleService.addImageVehicleToBackend(formData).subscribe({
      next: (response) => {
        console.log('Tải lên thành công:', response.message);
        // Chuyển hướng hoặc thực hiện hành động khác sau khi tải lên thành công
      },
      error: (error) => {
        console.error('Lỗi khi tải lên hình ảnh', error);
        this.errorMessages.push('Đã xảy ra lỗi khi tải lên hình ảnh. Vui lòng thử lại.');
      }
    });

}

addVehicle() {
    this.newVehicle = {
        id_vehicles: this.newVehicle.id_vehicles,
        name_vehicles: this.newVehicle.name_vehicles,
        place_vehicles: this.newVehicle.place_vehicles,
        driver: this.newVehicle.driver,
        image:'',
        description: this.newVehicle.description,
        status: true
    };
}

  onFileChange(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.file = input.files[0];
      this.newVehicle.image = `img_${this.newVehicle.id_vehicles}.png`; // Gán file đã chọn vào newVehicle.image
    }
  }


}
