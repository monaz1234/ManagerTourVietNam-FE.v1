import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';
import { TourService } from '../../service/tour/tour.service';
import { Tour } from '../../interface/tour.interface';
import { ManagerPromotionService } from '../../service/promotion/manager-promotion.service';
import { Promotion } from '../../interface/promotion.interface';
import { TourDetail } from '../../interface/tourdetail.interface';
import { TourDetailService } from '../../service/tour_detail/tourdetail.service';
@Component({
  selector: 'app-customer',
  templateUrl: './customer.component.html',
  styleUrls: ['./customer.component.scss']
})
export class CustomerComponent implements OnInit {
  currentPageTour: number = 1;
  currentPagePromotion: number = 1;
  itemsPerPageTour: number = 12;  // Số lượng items cho Tour
  itemsPerPagePromotion: number = 3;  // Số lượng items cho Promotion

  totalTourItems: number = 0;
  totalPromotionItems: number = 0;

  pagesTour: number[] = [];
  pagesPromotion: number[] = [];

  pagedTours: Tour[] = [];
  pagedPromotions: Promotion[] = [];

  username: string | null = null; // Biến để lưu tên tài khoản
  
  tourDetails: TourDetail[] = [];

  promotions$: Observable<Promotion[]>; // Thay đổi để sử dụng observable

  searchTourDestination: string = '';  // Lưu giá trị tìm kiếm tên tour
  searchDepartureDate: string = '';  // Lưu giá trị ngày khởi hành
  searchPriceRange: string = '';     // Lưu giá trị khoảng giá

  constructor(
    private tourService: TourService , 
    private tourDetailService: TourDetailService,
    private promotionService: ManagerPromotionService,
    private router: Router
  ) {
    this.promotions$ = this.promotionService.promotions$; // Gán promotions$ từ service
  }

  ngOnInit(): void {
    this.loadTours();
    this.loadTourDetails();
    this.loadPromotions();
    this.username = localStorage.getItem('username'); // Lấy tên tài khoản từ LocalStorage
  }
  // Phương thức điều hướng đến trang chi tiết tour
  // Điều hướng đến trang chi tiết tour
  goToTourDetail(idtour: string): void {
    this.router.navigate(['/customer/tour', idtour]);
  }

  searchTours(): void {
    this.tourService.getTours().subscribe(tours => {
      this.tourDetailService.getTours().subscribe(tourDetails => {
        let filteredTours = tours;
  
        // Lọc theo tên tour
        if (this.searchTourDestination) {
          filteredTours = filteredTours.filter(tour =>
            tour.tourname.toLowerCase().includes(this.searchTourDestination.toLowerCase())
          );
        }
  
        // Lọc theo ngày khởi hành
        if (this.searchDepartureDate) {
          filteredTours = filteredTours.filter(tour => {
            // Tìm tourDetail tương ứng với tour hiện tại
            const tourDetail = tourDetails.find(detail => detail.idtour === tour.idtour);
            return tourDetail && new Date(tourDetail.depart).toLocaleDateString() === new Date(this.searchDepartureDate).toLocaleDateString();
          });
        }
  
        // Lọc theo khoảng giá
        if (this.searchPriceRange) {
          filteredTours = filteredTours.filter(tour => {
            const tourDetail = tourDetails.find(detail => detail.idtour === tour.idtour);
            const price = tourDetail ? tourDetail.total_price : 0;
            switch (this.searchPriceRange) {
              case 'Dưới 3 triệu':
                return price < 3000000;
              case '3-5 triệu':
                return price >= 3000000 && price <= 5000000;
              case 'Trên 5 triệu':
                return price > 5000000;
              default:
                return true;
            }
          });
        }
  
        // Cập nhật danh sách tour đã lọc
        this.totalTourItems = filteredTours.length;
        this.updateTourPagination();
        this.pagedTours = filteredTours.slice(0, this.itemsPerPageTour);  // Phân trang cho các tour đã lọc
      });
    });
  }
  
  loadTours(): void {
    this.tourService.getTours().subscribe(tours => {
      this.totalTourItems = tours.length;
      this.updateTourPagination();
      this.getPagedTours();
    });
  }

  loadTourDetails(): void {
    this.tourDetailService.getTours().subscribe(details => {
      this.tourDetails = details;
    });
  }
  getTourDetailById(tourId: String) {
    return this.tourDetails.find(detail => detail.idtour === tourId);
  }
  loadPromotions(): void {
    this.promotionService.getPromotions().subscribe(promotions => {
      this.totalPromotionItems = promotions.length;
      this.updatePromotionPagination();
      this.getPagedPromotions();
    });
  }
  // Pagination for tours
  updateTourPagination(): void {
    this.pagesTour = Array.from({ length: Math.ceil(this.totalTourItems / this.itemsPerPageTour) }, (_, i) => i + 1);
  }

  getPagedTours(): void {
    this.tourService.tour$.subscribe(tours => {
      const startIndex = (this.currentPageTour - 1) * this.itemsPerPageTour;
      const endIndex = startIndex + this.itemsPerPageTour;
      this.pagedTours = tours.slice(startIndex, endIndex);
    });
  }
  
  // Pagination for promotions
  updatePromotionPagination(): void {
    this.pagesPromotion = Array.from({ length: Math.ceil(this.totalPromotionItems / this.itemsPerPagePromotion) }, (_, i) => i + 1);
  }
  
  getPagedPromotions(): void {
    this.promotionService.promotions$.subscribe(promotions => {
      const startIndex = (this.currentPagePromotion - 1) * this.itemsPerPagePromotion;
      const endIndex = startIndex + this.itemsPerPagePromotion;
      this.pagedPromotions = promotions.slice(startIndex, endIndex);
    });
  }
  
  // Page navigation functions for tours
  goToPageTour(page: number): void {
    this.currentPageTour = page;
    this.getPagedTours();
  }

  nextPageTour(): void {
    if (this.currentPageTour < this.pagesTour.length) {
      this.currentPageTour++;
      this.getPagedTours();
    }
  }

  previousPageTour(): void {
    if (this.currentPageTour > 1) {
      this.currentPageTour--;
      this.getPagedTours();
    }
  }
    // Page navigation functions for promotions
    goToPagePromotion(page: number): void {
      this.currentPagePromotion = page;
      this.getPagedPromotions();
    }
  
    nextPagePromotion(): void {
      if (this.currentPagePromotion < this.pagesPromotion.length) {
        this.currentPagePromotion++;
        this.getPagedPromotions();
      }
    }
  
    previousPagePromotion(): void {
      if (this.currentPagePromotion > 1) {
        this.currentPagePromotion--;
        this.getPagedPromotions();
      }
    }

  logout(): void {
    localStorage.removeItem('username'); // Xóa tên tài khoản khi đăng xuất
    this.username = null;
    this.router.navigate(['/']); // Điều hướng về trang chủ hoặc trang đăng nhập
  }

  navigateToMessenger(): void {
    window.location.href = 'https://www.facebook.com/messages/t/100022817763633'; // Thay 'yourpage' bằng đường dẫn Messenger của bạn
  }
}
