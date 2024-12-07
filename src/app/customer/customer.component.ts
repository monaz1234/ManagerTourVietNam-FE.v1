import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';
import { TourService } from '../../service/tour/tour.service';
import { Tour } from '../../interface/tour.interface';
import { ManagerPromotionService } from '../../service/promotion/manager-promotion.service';
import { Promotion } from '../../interface/promotion.interface';
import { TourDetail } from '../../interface/tourdetail.interface';
import { TourDetailService } from '../../service/tour_detail/tourdetail.service';
import { AccountService } from '../../service/account/account.service';
@Component({
  selector: 'app-customer',
  templateUrl: './customer.component.html',
  styleUrls: ['./customer.component.scss']
})
export class CustomerComponent implements OnInit {
  userId: string | null = null;
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

  hotelSearchCriteriaName = { name: '' };
  hotelSearchCriteriaPrice = { priceRange: '' };
  constructor(
    private tourService: TourService ,
    private tourDetailService: TourDetailService,
    private promotionService: ManagerPromotionService,
    private router: Router,
    private accountService: AccountService,

  ) {
    this.promotions$ = this.promotionService.promotions$; // Gán promotions$ từ service
  }
  getImageTourUrl(imageName: string): string {
    const imageString = imageName + ".png";
    return `http://localhost:9000/api/tour/images/${imageString}`;
  }

  // ngOnInit(): void {
  //   this.loadTours();
  //   this.loadTourDetails();
  //   this.loadPromotions();
  //   // Lấy thông tin tài khoản từ LocalStorage
  //   const usernameFromLocalStorage = localStorage.getItem('username');
  //   const nameFromGoogle = localStorage.getItem('name');
  //   // Ưu tiên hiển thị `name` nếu đăng nhập bằng Google, nếu không thì hiển thị `username`
  //   this.username = nameFromGoogle || usernameFromLocalStorage;
  //   const infomationUser = this.username;
  // // Thay thế bằng username thực tế
  //   this.accountService.getIdUserByUsername(infomationUser).subscribe({
  //   next: (response) => {
  //     if (response?.iduser) {
  //       this.userId = response.iduser;
  //     }
  //   },
  //   error: (err) => {
  //     console.error('Lỗi lấy iduser:', err);
  //   },
  // });
  // }

  ngOnInit(): void {
    this.loadTours();
    this.loadTourDetails();
    this.loadPromotions();

    // Lấy thông tin tài khoản từ LocalStorage
    const usernameFromLocalStorage = localStorage.getItem('username');
    const nameFromGoogle = localStorage.getItem('name');

    // Ưu tiên hiển thị `name` nếu đăng nhập bằng Google, nếu không thì hiển thị `username`
    this.username = nameFromGoogle || usernameFromLocalStorage || ''; // Đảm bảo luôn là string

    const infomationUser = this.username;

    // Kiểm tra trước khi gọi service
    if (infomationUser) {
      this.accountService.getIdUserByUsername(infomationUser).subscribe({
        next: (response) => {
          if (response?.iduser) {
            this.userId = response.iduser;
          }
        },
        error: (err) => {
          console.error('Lỗi lấy iduser:', err);
        },
      });
    } else {
      console.error('Không tìm thấy thông tin username!');
    }
  }

  // Phương thức điều hướng đến trang chi tiết tour
  // Điều hướng đến trang chi tiết tour
  goToTourDetail(idtour: string): void {
    this.router.navigate(['/customer/tour', idtour]);
  }
  goToUserProfile() {
    this.router.navigate(['/customer/profile']); // Điều hướng đến trang thông tin cá nhân
  }
  onHotelSearch(): void {
    // Điều hướng kèm theo dữ liệu tìm kiếm
    this.router.navigate(['/customer/hotel'], {
      queryParams: {
        name: this.hotelSearchCriteriaName.name,
        priceRange: this.hotelSearchCriteriaPrice.priceRange
      }
    });
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

  copyCode(code: string): void {
    navigator.clipboard.writeText(code).then(() => {
      alert('Mã khuyến mãi đã được sao chép!');
    }).catch(err => {
      console.error('Không thể sao chép mã khuyến mãi: ', err);
    });
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
    // Xóa thông tin trong LocalStorage và đặt lại trạng thái đăng nhập
    localStorage.removeItem('username');
    localStorage.removeItem('name');
    this.username = null;
    this.router.navigate(['/login']);
  }

  navigateToMessenger(): void {
    window.location.href = 'https://www.facebook.com/messages/t/100022817763633'; // Thay 'yourpage' bằng đường dẫn Messenger của bạn
  }
}
