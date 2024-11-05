import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { Observable } from 'rxjs';
import { Promotion } from '../../interface/promotion.interface';
import { ManagerPromotionService } from '../../service/promotion/manager-promotion.service';
import { Router, ActivatedRoute } from '@angular/router'; // Đảm bảo import đúng Router và ActivatedRoute

@Component({
  selector: 'app-manager-promotion',
  templateUrl: './manager-promotion.component.html',
  styleUrls: ['./manager-promotion.component.scss'] // Sửa `styleUrl` thành `styleUrls`
})

export class ManagerPromotionComponent implements OnInit {
    promotions$: Observable<Promotion[]>; // Thay đổi để sử dụng observable
    selectedPromotion: Promotion | null = null;
    newPromotionId: string = '';
    searchQuery: string = '';
    statusFilter: boolean | null = null;
    currentPromotions = new Array<Promotion>();
    currentPage: number = 1; // Trang hiện tại
    itemsPerPage: number = 10; // Số lượng người dùng trên mỗi trang
    totalItems: number = 0; // Tổng số người dùng
    pages: number[] = []; // Mảng lưu trang
  
    // Cờ trạng thái cho form
    isAddPromotionVisible: boolean = false;
    isEditPromotionVisible: boolean = false;

    constructor(private promotionService: ManagerPromotionService) {
        this.promotions$ = this.promotionService.promotions$; // Gán promotions$ từ service
    }
    @Output() promotionUpdated = new EventEmitter<Promotion>();
    ngOnInit(): void {
        this.loadPromotions(); // Tải danh sách khuyến mãi ban đầu
    }
    isActive(status: string): boolean {
        return status === '1'; // Giả sử '1' là trạng thái "Hoạt động"
    }
    
    // Hàm thay đổi trạng thái bộ lọc
    onStatusChange(event: Event): void {
        const selectElement = event.target as HTMLSelectElement;
        const selectedValue = selectElement.value;
        // Nếu không có trạng thái nào được chọn, tải lại tất cả khuyến mãi
        if (selectedValue === "") {
            this.loadPromotions();
            return;
        }
        // Chuyển đổi giá trị chọn thành boolean
        this.statusFilter = selectedValue === 'true';
        // Lọc danh sách khuyến mãi theo trạng thái
        this.promotionService.getPromotions().subscribe(data => {
            // Lọc dựa trên trạng thái đã chọn
            const filteredPromotions = data.filter(promotion => promotion.status === this.statusFilter);
            // Cập nhật danh sách khuyến mãi trong service
            this.promotionService.promotionsSubject.next(filteredPromotions);
            // Cập nhật số lượng item và phân trang
            this.totalItems = filteredPromotions.length; 
            this.updatePagination(); 
            this.updateCurrentPagePromotions(); 
        });
    }
    
    // Hàm tìm kiếm
    onSearch(): void {
        if (this.searchQuery.trim()) {
            this.promotionService.searchPromotions(this.searchQuery.trim()).subscribe(
                (data: Promotion[]) => {
                    // Cập nhật danh sách khuyến mãi trong service
                    this.promotionService.updatePromotionsList(data); // Cập nhật danh sách khuyến mãi trong service
                    this.totalItems = data.length; // Cập nhật tổng số khuyến mãi
                    this.currentPage = 1; // Reset trang về 1
                    this.updatePagination(); // Cập nhật phân trang
                    this.updateCurrentPagePromotions(); // Cập nhật danh sách khuyến mãi cho trang hiện tại
                },
                (error) => {
                    console.error('Search error:', error);
                    this.loadPromotions(); // Tải lại danh sách khuyến mãi nếu có lỗi
                }
            );
        } else {
            this.loadPromotions(); // Nếu không có từ khóa tìm kiếm, tải lại tất cả khuyến mãi
        }
    }
    

    loadPromotions(): void {
        this.promotionService.getPromotions().subscribe(data => {
            // Cập nhật danh sách khuyến mãi trong service cho từng khuyến mãi
            data.forEach(promotion => {
                this.promotionService.updatePromotions(promotion.promotion_code, promotion).subscribe(); // Gọi phương thức với cả hai tham số
            });
            this.totalItems = data.length; 
            this.updatePagination(); 
        });
    }
    generateNewPromotionId() {
        this.promotions$.subscribe((promotions) => {
            // Lấy tất cả các ID hiện có và chỉ lấy phần số từ promotion_code
            const existingIds = promotions.map(promotion => parseInt(promotion.promotion_code));
    
            // Tìm số promotion_code nhỏ nhất bị thiếu
            for (let i = 1; i <= 9999; i++) { // Thay vì giới hạn theo số lượng hiện tại
                if (!existingIds.includes(i)) {
                    this.newPromotionId = i.toString().padStart(3, '0'); // Định dạng '000' cho promotion_code
                    return;
                }
            }
    
            console.error("Tất cả các promotion_code từ 1 đến 9999 đều đã được sử dụng.");
        });
    }
    
    
    // Hàm mở form thêm Promotion
    toggleAddPromotion(): void {
        this.isAddPromotionVisible = !this.isAddPromotionVisible;
        this.isEditPromotionVisible = false;
        if (this.isAddPromotionVisible) {
            this.generateNewPromotionId(); // Tạo mã ID mới khi hiển thị form thêm
            } else {
            this.selectedPromotion = null; // Reset khuyến mãi đã chọn nếu có
            }
    }

    // Hàm đóng form chỉnh sửa
    handleCloseEditForm(): void {
        this.isEditPromotionVisible = false;
        this.selectedPromotion = null;
    }

    onPromotionUpdated(updatedPromo: any): void {
        this.promotions$.subscribe(promotions => {
            const index = promotions.findIndex(promo => promo.promotion_code === updatedPromo.promotion_code);
            if (index > -1) {
                // Cập nhật danh sách khuyến mãi trong BehaviorSubject
                this.promotionService.promotionsSubject.next([...promotions.slice(0, index), updatedPromo, ...promotions.slice(index + 1)]);
                this.onSearch(); 
            }
        });
    }
    
    showFormEditPromotionAuto(promotion_code: string): void {
        if (this.selectedPromotion && this.selectedPromotion.promotion_code === promotion_code) {
            this.isEditPromotionVisible = false;
            this.selectedPromotion = null; // Đặt lại selectedUser
        } else {
            this.editPromo(promotion_code);
            this.isEditPromotionVisible = true; // Đảm bảo form được hiện thị

            setTimeout(() => {
            const editFormElement = document.getElementById('editForm');
            if (editFormElement) {
                const elementPosition = editFormElement.getBoundingClientRect().top + window.scrollY;
                window.scrollTo({ top: elementPosition, behavior: 'smooth' });

                const firstInputElement = editFormElement.querySelector('input');
                if (firstInputElement) {
                firstInputElement.focus();
                }
            }
            }, 100);
        }
        }

    editPromo(promotion_code: string): void {
        this.promotionService.findPromotion(promotion_code).subscribe({
            next: (promotion) => {
            this.selectedPromotion = promotion; // Gán thông tin khuyến mãi vào selectedUser
            this.isAddPromotionVisible = false;
            this.isEditPromotionVisible = true;
            },
            error: (error) => {
            console.error('Lỗi khi lấy thông tin khuyến mãi:', error);
            }
        });
    }
    
    // Hàm xác nhận xoá
    confirmDelete(promotion: Promotion): void {
        if (confirm('Bạn có chắc chắn muốn xoá khuyến mãi này không?')) {
            this.promotionService.deletePromotion(promotion.promotion_code).subscribe(
                () => {
                    // Xóa thành công, gọi loadPromotions để cập nhật danh sách
                    this.loadPromotions();
                },
                (error) => {
                    console.error('Lỗi khi xóa khuyến mãi:', error);
                }
            );
        }
    }
    

    // Hàm phân trang
    updatePagination(): void {
        this.pages = Array.from({ length: Math.ceil(this.totalItems / this.itemsPerPage) }, (_, i) => i + 1);
    }

    updateCurrentPagePromotions(): void {
        this.promotions$.subscribe(promotions => {
            const start = (this.currentPage - 1) * this.itemsPerPage;
            const end = start + this.itemsPerPage;
            this.currentPromotions = promotions.slice(start, end);
        });
    }
    

    goToPage(page: number): void {
    this.currentPage = page;
    this.updateCurrentPagePromotions();
    }

    nextPage(): void {
    if (this.currentPage < this.pages.length) {
        this.currentPage++;
        this.updateCurrentPagePromotions();
    }
    }

    previousPage(): void {
    if (this.currentPage > 1) {
        this.currentPage--;
        this.updateCurrentPagePromotions();
    }
    }

    // Thêm phương thức lắng nghe sự kiện
    onPromotionAdded(): void {
        this.loadPromotions(); // Tải lại danh sách khuyến mãi
    }




}
