import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';
import { AccountService } from '../../service/account/account.service';

import { Hotel } from '../../interface/hotel.interface';
import { ManagerHotelService } from '../../service/hotel/manager-hotel.service';

@Component({
  selector: 'app-client-hotel',
  templateUrl: './client-hotel.component.html',
  styleUrl: './client-hotel.component.scss'
})
export class ClientHotelComponent implements OnInit{
  
  hotelSearchCriteriaName: { name: string } = { name: '' };
  hotelSearchCriteriaPrice: { priceRange: string } = { priceRange: '' };
  currentPage: number = 1;
  itemsPerPage: number = 12;  // Số lượng items cho Tour
  totalItems: number = 0;

  pagesHotel: number[] = [];
  pagedHotels: Hotel[] = [];
  hotelimages: Hotel[] = [];
  username: string | null = null; // Biến để lưu tên tài khoản

  hotels$: Observable<Hotel[]>; // Thay đổi để sử dụng observable

  searchHotelDestination: string = '';  // Lưu giá trị tìm kiếm tên hotel
  searchPriceRange: string = '';     // Lưu giá trị khoảng giá

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private hotelService: ManagerHotelService
  ) {
    this.username = localStorage.getItem('username'); // Lấy tên tài khoản từ LocalStorage
    this.hotels$ = this.hotelService.hotels$; // Gán hotels$ từ service
  }

  ngOnInit(): void {
    this.route.queryParams.subscribe((params)=> {
      this.hotelSearchCriteriaName.name = params['name'] || '';
      this.hotelSearchCriteriaPrice.priceRange = params['priceRange'] || '';
      this.searchHotelDestination = this.hotelSearchCriteriaName.name; // Đồng bộ giá trị
      this.searchPriceRange = this.hotelSearchCriteriaPrice.priceRange; // Đồng bộ giá trị
      console.log('Hotel Search Criteria:', this.hotelSearchCriteriaName, this.hotelSearchCriteriaPrice);
      // Gọi searchHotels() sau khi dữ liệu đã đồng bộ
      setTimeout(() => {
        this.searchHotels();  // Gọi tìm kiếm lại ngay sau khi nhận dữ liệu từ queryParams
      }, 0);

    });
    this.loadHotels();
    this.searchHotels();
    //this.loadHotelDetails();
    this.username = localStorage.getItem('username'); // Lấy tên tài khoản từ LocalStorage
  }
  // Điều hướng đến trang chi tiết hotel
  goToHotelDetail(id_hotel: string): void {
    this.router.navigate(['/customer/hotel', id_hotel]);
  }
  
  // Tìm kiếm khách sạn
  searchHotels(): void {
    this.hotelService.getHotels().subscribe(hotels => {
      let filteredHotels = hotels;
      // Lọc theo tên khách sạn
      if (this.searchHotelDestination) {
        console.log('Searching hotels with hotelSearchCriteriaName:', this.hotelSearchCriteriaName);
        console.log('dữ liệu searchhotel:', this.searchHotelDestination);
        filteredHotels = filteredHotels.filter(hotel =>
          hotel.name_hotel.toLowerCase().includes(this.searchHotelDestination.toLowerCase())
        );
      }
  
      // Lọc theo khoảng giá
      if (this.searchPriceRange) {
        console.log('Searching hotels with criteria:', this.hotelSearchCriteriaPrice);
        console.log('dữ liệu searchpricehotel:', this.searchPriceRange);
        filteredHotels = filteredHotels.filter(hotel => {
          const price = hotel.price;
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
  
      // Cập nhật danh sách khách sạn đã lọc
      this.totalItems = filteredHotels.length;  // Cập nhật tổng số khách sạn
      this.updateHotelPagination();
      this.pagedHotels = filteredHotels.slice(0, this.itemsPerPage);  // Phân trang cho các khách sạn đã lọc
    });
  }
  

  sanitizeDescription(description: string): string {
    // Thay thế \n bằng <br> để HTML nhận diện xuống dòng
    return description.replace(/\n/g, '<br>');
  }
  
  // Pagination for hotels
  updateHotelPagination(): void {
    // Cập nhật lại số trang dựa trên số lượng khách sạn đã lọc
    this.pagesHotel = Array.from({ length: Math.ceil(this.totalItems / this.itemsPerPage) }, (_, i) => i + 1);
  }
  
  getPagedHotels(): void {
    this.hotelService.hotels$.subscribe(hotels => {
      const startIndex = (this.currentPage - 1) * this.itemsPerPage;
      const endIndex = startIndex + this.itemsPerPage;
      this.pagedHotels = hotels.slice(startIndex, endIndex);
    });
  }
  // Page navigation functions for hotels
  goToPage(page: number): void {
    this.currentPage = page;
    this.getPagedHotels();
  }
  nextPage(): void {
    if (this.currentPage < this.pagesHotel.length) {
      this.currentPage++;
      this.getPagedHotels();
    }
  }
  previousPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.getPagedHotels();
    }
  }

  loadHotels(): void {
    this.hotelService.getHotels().subscribe(hotels => {
      this.totalItems = hotels.length;
      this.updateHotelPagination();
      this.getPagedHotels();

    });
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
