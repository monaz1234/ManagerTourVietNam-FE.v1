import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';
import { CommentService } from '../../service/comment.service';
import { AccountService } from '../../service/account/account.service';
import { Comment } from '../../interface/comment.interface';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Hotel } from '../../interface/hotel.interface';
import { Observable } from 'rxjs';

import { ManagerHotelService } from '../../service/hotel/manager-hotel.service';
@Component({
  selector: 'app-clienthoteldetail',
  templateUrl: './clienthoteldetail.component.html',
  styleUrl: './clienthoteldetail.component.scss'
})
export class ClienthoteldetailComponent implements OnInit{
  hotelId: string | null = null; // Lưu ID của tour
  hotel!: Hotel; // Một đối tượng duy nhất
  username: string | null = null; // Biến để lưu tên tài khoản
  Iduser: string | null = null; //
  hotelImages: string[] = []; // Mảng chứa danh sách ảnh của khách sạn
  hotels$: Observable<Hotel[]>; // Thay đổi để sử dụng observable
  // Các biến đã có
  suggestedHotel: Hotel[] = []; // Khách sạn gợi ý
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private accountService: AccountService,
    private hotelService: ManagerHotelService
  ) {
    this.username = localStorage.getItem('username'); // Lấy tên tài khoản từ LocalStorage
    this.hotelId = this.route.snapshot.paramMap.get('id_hotel');// Get tour ID from the route
    this.hotels$ = this.hotelService.hotels$; // Gán hotels$ từ service
  }
  ngOnInit(): void {
    // Lấy Iduser từ server dựa trên username
    if (this.username) {
      // Lấy Iduser từ server dựa trên username
      this.accountService.getIdUserByUsername(this.username!).subscribe(
        (response) => {
          console.log('Response iduser:', response); // Object như { iduser: "U007" }
          this.Iduser = response.iduser;
          this.loadHotels();
        },
        (error) => {
          console.error('Error fetching IDUser:', error);
        }
      );
    } else {
      console.error('Username is null. Redirecting to login...');
      this.router.navigate(['/login']); // Điều hướng người dùng đến trang đăng nhập
    }
    
    if (this.hotelId) {
      // Fetch the tour details for the given tour ID
      this.loadHotels();
      this.loadSuggestedHotel();
    }
    
  }
  loadSuggestedHotel(): void {
    if (this.hotelId) {
      // Lấy danh sách khách sạn từ API, ví dụ:
      this.hotelService.getHotels().subscribe(hotels => {
        const currentIndex = hotels.findIndex(hotel => hotel.id_hotel === this.hotelId);
        
      // Lấy 3 khách sạn tiếp theo, tuần hoàn nếu đến cuối danh sách
      const nextHotels = [];
      for (let i = 1; i <= 3; i++) {
        const nextIndex = (currentIndex + i) % hotels.length;  // Logic tuần hoàn
        nextHotels.push(hotels[nextIndex]);
      }        
        if (nextHotels.length > 0) {
          this.suggestedHotel = nextHotels;
        }
      });
    }
  }
  goToHotelDetail(hotelId: string): void {
  // Điều hướng đến trang chi tiết của khách sạn và buộc reload component
  this.router.navigate([`customer/hotel/${hotelId}`]).then(() => {
    window.location.reload();
  });
  }
  
  loadHotels(): void {
    if (this.hotelId) {
      this.hotelService.findHotel(this.hotelId).subscribe(
        (data) => {
          this.hotel! = data; // Lưu chi tiết khách sạn
        // Tách danh sách ảnh của hotel (nếu tồn tại)
        if (this.hotel!.image) {
          this.hotelImages = this.hotel!.image.split(',').map(image => image.trim());
        }
        },
        (error) => {
          console.error('Error fetching hotel details:', error);
        }
      );
    } else {
      console.error('Hotel ID is null');
    }
  }
  
  contactHotel(): void {
    window.location.href = 'https://www.youtube.com/';
  }

sanitizeDescription(description: string): string {
  // Thay thế \n bằng <br> để HTML nhận diện xuống dòng
  return description.replace(/\n/g, '<br>');
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
