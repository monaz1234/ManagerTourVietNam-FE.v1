import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { TourService } from '../../service/tour/tour.service'; // Import dịch vụ tour
import { TourDetailService } from '../../service/tour_detail/tourdetail.service'; // Import dịch vụ chi tiết tour
import { Tour } from '../../interface/tour.interface'; // Import interface tour
import { TourDetail } from '../../interface/tourdetail.interface'; // Import tour detail
import { Router } from '@angular/router';
@Component({
  selector: 'app-customerdetail',
  templateUrl: './customerdetail.component.html',
  styleUrl: './customerdetail.component.scss'
})
export class CustomerdetailComponent implements OnInit{
  tourId: string | null = null; // Lưu ID của tour
  tourDetails: TourDetail[] = [];
  username: string | null = null; // Biến để lưu tên tài khoản
  vehicleImages: string[] = [];
  hotelImages: string[] = []; // Mảng chứa danh sách ảnh của khách sạn

  constructor(
    private route: ActivatedRoute,
    private tourService: TourService,
    private tourDetailService: TourDetailService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.username = localStorage.getItem('username'); // Lấy tên tài khoản từ LocalStorage
    // Get tour ID from the route
    this.tourId = this.route.snapshot.paramMap.get('idtour');
    if (this.tourId) {
      // Fetch the tour details for the given tour ID
      this.loadTourDetails(this.tourId);
    }
  }
  sanitizeDescription(description: string): string {
    // Thay thế \n bằng <br> để HTML nhận diện xuống dòng
    return description.replace(/\n/g, '<br>');
  }
  
  loadTourDetails(idtour: string): void {
    this.tourDetailService.getTours().subscribe(details => {
      // Lọc chi tiết tour dựa trên idtour
      this.tourDetails = details.filter(detail => detail.idtour === idtour);

      // Tách danh sách ảnh của vehicles (nếu tồn tại)
      if (this.tourDetails.length > 0 && this.tourDetails[0].vehicles.image) {
        this.vehicleImages = this.tourDetails[0].vehicles.image.split(',').map(image => image.trim());
      }
      // Tách danh sách ảnh của hotel (nếu tồn tại)
      if (this.tourDetails.length > 0 && this.tourDetails[0].hotel.image) {
        this.hotelImages = this.tourDetails[0].hotel.image.split(',').map(image => image.trim());
      }
    });
  }
  
  getTourDetailById(tourId: String) {
    return this.tourDetails.find(detail => detail.idtour === tourId);
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
