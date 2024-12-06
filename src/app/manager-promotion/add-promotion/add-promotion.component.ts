
import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';
import { ManagerPromotionService } from '../../../service/promotion/manager-promotion.service';
import {Promotion} from '../../../interface/promotion.interface';

@Component({
  selector: 'app-add-promotion',
  templateUrl: './add-promotion.component.html',
  styleUrls: ['./add-promotion.component.scss' ] // Sửa từ 'styleUrl' thành 'styleUrls'
})
export class AddPromotionComponent {

  isAddPromotionVisible = true;
  closeForm() {
    this.isAddPromotionVisible = false; // Đặt lại trạng thái để ẩn form
    console.log('Form đã được đóng lại'); // Kiểm tra trong console
  }

  @Input() generatedIdPromotion: string = '';
// Nhận giá trị promotion_code từ component cha
  @Output() promotionAdded = new EventEmitter<Promotion>(); // Thêm EventEmitter

  newPromotion: any = {
    promotion_code:'',
    code:'',
    name: '',
    description: '',
    discount: '',
    status: 1, // Gán trạng thái mặc định
  };

errorMessages: string[] = [];
promotions :Promotion[] = [];

formFields = [
  {name: 'promotion_code', label: 'Id của khuyến mãi', type: 'text', required: false},
  {name: 'code', label: 'Mã của khuyến mãi', type: 'text', required: false},
  {name: 'description', label: 'Mô tả', type: 'text', required: false},
  {name: 'name', label: 'Tên của mã', type: 'text', required: false},
  {name: 'discount', label: 'Phần trăm giảm của mã', type: 'text', placeholder:'00.00', required: false},
];


constructor(
  private promotionService: ManagerPromotionService,
  private router: Router
) {}


ngOnInit(): void {
  this.newPromotion.promotion_code = this.generatedIdPromotion;
  console.log('Generated Promotion Id:',this.newPromotion.promotion_code);

}

resetForm() {
  this.newPromotion = {
    promotion_code: this.generatedIdPromotion, // Gán ID mới từ component cha
    name: '',
    code: '',
    description: '',
    discount: '',
  };
  this.errorMessages = []; // Reset thông báo lỗi
}

onSubmit() {
  console.log(this.newPromotion);

  this.errorMessages = [];

  // Validate name
  if (!this.newPromotion.name) {
    this.errorMessages.push('Vui lòng nhập tên của khuyến mãi');
  }

  // Validate code
  if (!this.newPromotion.code) {
      this.errorMessages.push('Vui lòng nhập code của khuyến mãi');
  }

  if (this.newPromotion.code.length <= 3 || this.newPromotion.code.length >= 7) {
      this.errorMessages.push('Code của khuyến mãi phải có từ 4 đến 6 ký tự');
  }

  // Validate description
  if (!this.newPromotion.description) {
    this.errorMessages.push('Vui lòng nhập mô tả cho khuyến mãi');
  }

  if (this.errorMessages.length > 0) {
    return; // Nếu có lỗi thì không tiếp tục
}
  this.newPromotion.status = 1;

  // Đảm bảo rằng newPromotion có đầy đủ thông tin cần thiết
  this.newPromotion = {
    promotion_code: this.newPromotion.promotion_code,
    code: this.newPromotion.code,
    name: this.newPromotion.name,
    description: this.newPromotion.description,
    discount: this.newPromotion.discount,
    status: this.newPromotion.status,
  };

  this.promotionService.addPromotion(this.newPromotion).subscribe(
    (data: Promotion) => {
      console.log('Khuyến mãi đã được thêm:', data);
      this.promotionAdded.emit(data); // Phát sự kiện với khuyến mãi vừa thêm
      this.closeForm();
      this.resetForm();
    },
    (error) => {
      console.log('Lỗi khi thêm người dùng:',error);
    }
  );


}

}
