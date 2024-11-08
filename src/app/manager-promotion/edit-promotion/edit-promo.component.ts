import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ManagerPromotionService } from '../../../service/promotion/manager-promotion.service';

@Component({
    selector: 'app-editpromo',
    templateUrl: './edit-promo.component.html',
    styleUrls: ['./edit-promo.component.scss' ] // Sửa từ 'styleUrl' thành 'styleUrls'
})
export class EditPromoComponent{
  @Input() selectedPromotion: any; // Nhận dữ liệu khuyến mãi đang được chỉnh sửa
  @Output() closeForm = new EventEmitter<void>(); // Emit sự kiện đóng form
  @Output() promoUpdated = new EventEmitter<any>(); // Phát sự kiện sau khi cập nhật



    constructor(private router: Router, private promotionService: ManagerPromotionService) {}


    ngOnInit(): void {
        console.log(this.selectedPromotion);
        if (!this.selectedPromotion) {
        console.error('Không tìm thấy khuyến mãi để chỉnh sửa');
        }
    }

    formFields = [
        { name: 'promotion_code', label: 'Id khuyến mãi', type: 'text', required: true,  },
        { name: 'code', label: 'Mã của khuyến mãi', type: 'text', required: false },
        { name: 'name', label: 'Tên của khuyến mãi', type: 'text', required: false },
        { name: 'description', label: 'Mô tả của khuyến mãi', type: 'text', required: false },
        {
            name: 'status',
            label: 'Trạng thái của khuyến mãi',
            type: 'select',
            required: false,
            options: [
                { value: 'true', label: 'Hoạt động' },
                { value: 'false', label: 'Không hoạt động' }
            ]
        }

    ];

    resetForm() {
        this.selectedPromotion = {
        promotion_code: '',
        code: '',
        name: '',
        description: '',
        status: true
        };
    }



    onSubmit() {
        // Gửi yêu cầu cập nhật người dùng
        console.log('Dữ liệu gửi:', this.selectedPromotion);
        this.promotionService.updatePromotions(this.selectedPromotion.promotion_code, this.selectedPromotion).subscribe({
        next: (response) => {
            console.log('Chỉnh sửa thành công:', response);
            this.refreshPromotionData(); // Gọi hàm làm mới dữ liệu
            this.promoUpdated.emit(this.selectedPromotion); // Phát sự kiện cập nhật
            this.closeForm.emit(); // Phát sự kiện để đóng form
        },
        error: (error) => {
            console.error('Lỗi khi cập nhật khuyến mãi:', error);
            // Bạn có thể hiển thị thông báo lỗi ở đây nếu cần
        },
        });
    }

  // Hàm để cập nhật thông tin đã chỉnh sửa trong danh sách hiển thị




    // Hàm để làm mới dữ liệu khuyến mãi từ server
    refreshPromotionData() {
        this.promotionService.findPromotion(this.selectedPromotion.iduser).subscribe(Promotion => {
        console.log('Dữ liệu khuyến mãi mới:', Promotion); // Kiểm tra dữ liệu nhận được
        this.selectedPromotion = Promotion; // Cập nhật selectedPromotion bằng dữ liệu mới
        });
    }


}
