import { Component, OnInit } from '@angular/core';
import { TourDetail } from '../../interface/tourdetail.interface';
import { TourDetailService } from '../../service/tour_detail/tourdetail.service';
import { TourService } from '../../service/tour/tour.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ManagerHotelService } from '../../service/hotel/manager-hotel.service';
import { ServiceService } from '../../service/ServiceService/service.service';
import { ManagerVehicleService } from '../../service/vehicle/vehicle.service';
import { catchError, finalize, of, tap } from 'rxjs';
import { Location } from '@angular/common';
import { NewTourDetail } from '../../interface/NewTourDetail.interface';

@Component({
  selector: 'app-tour-detail',
  templateUrl: './tour-detail.component.html',
  styleUrl: './tour-detail.component.scss'
})
export class TourDetailComponent{

  tour_details: NewTourDetail[] = [];
  tour : any;
  tourdetail2 : TourDetail[] = [];
  error: string | null = null; // Lỗi nếu xảy ra
  idtour: string | null = null;  // Khai báo biến idbook

  currentPage: number = 1; // Trang hiện tại
  currentTourDetail: NewTourDetail[] = []; // Danh sách người dùng hiện tại
  itemsPerPage: number = 5; // Số lượng người dùng trên mỗi trang
  totalItems: number = 0; // Tổng số người dùng
  totalPages: number = 0;    // Tổng số trang
  isLoading = false; // Trạng thái chờ dữ liệu

  isSearchCompleted: boolean = false; // Cờ để kiểm tra kết quả tìm kiếm

  pages: (string | number)[] = [];
  filteredTourDetail: any[] = []; // Danh sách đã lọc
  statusFilter: string = ''; // Trạng thái hiện tại được lọc
  selectedStatus: string = ''; // Biến để lưu trữ trạng thái đã chọn
  selectedSalary: string = ''; // Biến để lưu trữ giá trị lương đã chọn
  searchQuery: string = ''; // Định nghĩa biến searchQuery


  isAddTourDetailVisible = false; // Biến để theo dõi trạng thái hiển thị
  isEditTourDetailVisible = false;



  selectedTourDetail: any;
  newTourDetail: string ='';
  reversedTourDetail: NewTourDetail[] = [];
  displaySearchResult: NewTourDetail[] = [];


  ShowAddTourDetail() : void{
    this.isAddTourDetailVisible = true;
    this.isEditTourDetailVisible = false;
  }

  // showFormEditTourDetail(tourDetailId: string) {
  //   this.tourDetailService.findBookDetail(bookDetailId).subscribe(book_detail => {
  //     this.selectedBookDetail = book_detail;
  //     this.isEditBookDetailVisible = true; // Ensure form visibility
  //   });
  // }

  constructor(
    //private router : Router,
    private tourDetailService : TourDetailService,
    private tourService : TourService,
    private hotelService : ManagerHotelService,
    private serviceService : ServiceService,
    private vehiclesService : ManagerVehicleService,
    private route: ActivatedRoute,
    private location: Location,

  ){}


  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.idtour = params['id'];  // Lấy idBook từ params
      console.log('ID của tour:', this.idtour);

      if (this.idtour) {
        // this.fetchBookDetail(this.idbook);
        this.loadTourDetail(this.idtour);
      }
    });
  }
  goBack(): void {
    this.location.back(); // Quay lại trang trước đó
  }


  loadTourDetail(idtour: string): void {
    this.isLoading = true;

    // this.tourDetailService
      // .getTourDetailsByTour(idtour)
      // .pipe(
      //   tap((response) => {
      //     console.log('Dữ liệu trả về từ API:', response);

      //     // Chuyển đổi hotel.status từ boolean sang string nếu cần
      //     this.tour_details = response.map((detail: TourDetail) => ({
      //       ...detail,
      //       service: {
      //         ...detail.service,
      //         time_start: new Date(detail.service.time_start), // Chuyển đổi thành Date
      //         time_end: new Date(detail.service.time_end), // Chuyển đổi thành Date nếu cần
      //       },
      //       hotel: {
      //         ...detail.hotel,
      //         status: detail.hotel.status.toString(), // Chuyển đổi thành string
      //       },
      //       vehicles: {
      //         ...detail.vehicles,
      //         status: detail.vehicles.status.toString(), // Chuyển đổi thành string nếu cần
      //       },
      //     }));

      //     console.log("Đã cộng mảng " + this.tour_details);
      //     this.applyFilterTourDetail();
      //     console.log(this.filteredTourDetail);
      //   }),
      //   catchError((error) => {
      //     console.error('Lỗi khi tải chi tiết tour:', error);
      //     this.tour_details = []; // Gán mảng rỗng nếu có lỗi
      //     return of([]);
      //   }),
      //   finalize(() => (this.isLoading = false))
      // )
      // .subscribe();
      this.tourDetailService.getTourDetailsByTour(idtour).subscribe(
        (data: any) => {
          if (!Array.isArray(data)) {
            this.tourdetail2 = [data]; // Chuyển đối tượng thành mảng nếu cần
          } else {
            this.tourdetail2 = data;
          }
          console.log("hellllo",this.tourdetail2[0]);
          console.log("hellllo2",this.tourdetail2[0].vehicles.id_vehicles);

        },
        (error) => {
          console.error('Lỗi khi lấy dữ liệu người dùng:', error);
        }
      );

  }



  applyFilterTourDetail() : void {
    const query = this.searchQuery.trim().toLowerCase();
    this.filteredTourDetail = this.tour_details.filter(tour_detail =>{


      const matchesSearchQuery =
        // tour_detail.depart.toLowerCase().includes(query);
        tour_detail.hotel?.name_hotel.toLowerCase().includes(query) ||
        tour_detail.vehicles?.name_vehicles.toLowerCase().includes(query) ||
        tour_detail.service?.name_service.toLowerCase().includes(query) ||
        tour_detail.tour?.tourname.toLowerCase().includes(query);
      return matchesSearchQuery;
  //   });
    });

    this.totalItems = this.filteredTourDetail.length;
    // this.filteredAccount = this.filteredAccount.reverse();
    // this.calculatePages(); // Tính lại số trang
    // this.updateCurrentPageAccounts(); // Cập nhật danh sách hiển thị

  }

  // applyFilterTourDetail(): void {
  //   if (!Array.isArray(this.tour_details)) {
  //     console.error('tour_details không phải là một mảng:', this.tour_details);
  //     return;
  //   }

  //   const query = this.searchQuery.trim().toLowerCase();
  //   console.log('Giá trị searchQuery:', query);

  //   // Kiểm tra giá trị từng phần tử trong tour_details
  //   console.log('Dữ liệu trước khi lọc:', this.tour_details);

  //   this.filteredTourDetail = this.tour_details.filter(tour_detail => {
  //     const depart = tour_detail.depart || ''; // Đảm bảo depart luôn có giá trị
  //     if (typeof depart !== 'string') {
  //       console.warn(`Giá trị depart không phải chuỗi:`, depart);
  //       return false;
  //     }
  //   });

  //   console.log('Kết quả lọc:', this.filteredTourDetail);

  //   this.totalItems = this.filteredTourDetail.length;
  // }




  // applyFilterTourDetail(): void {
  //   const query = this.searchQuery.trim().toLowerCase();
  //   this.filteredTourDetail = this.tour_details.filter(tour_detail => {

  //     // Kiểm tra tất cả các trường có thể lọc
  //     const matchesSearchQuery =
  //       Object.values(tour_detail).some(value =>
  //         typeof value === 'string' && value.toLowerCase().includes(query)
  //       );

  //     return matchesSearchQuery;
  //   });

  //   this.totalItems = this.filteredTourDetail.length;
  // }

  // applyFilterTourDetail(): void {
  //   if (!Array.isArray(this.tour_details)) {
  //     console.error('tour_details không phải là một mảng:', this.tour_details);
  //     return;
  //   }

  //   const query = this.searchQuery.trim().toLowerCase();
  //   this.filteredTourDetail = this.tour_details.filter(tour_detail => {
  //     const matchesSearchQuery =
  //       tour_detail.depart.toLowerCase().includes(query) ||
  //       tour_detail.hotel?.name_hotel.toLowerCase().includes(query) ||
  //       tour_detail.vehicles?.name_vehicles.toLowerCase().includes(query) ||
  //       tour_detail.service?.name_service.toLowerCase().includes(query) ||
  //       tour_detail.tour?.tourname.toLowerCase().includes(query);

  //     return matchesSearchQuery;
  //   });

  //   this.totalItems = this.filteredTourDetail.length;
  // }



      showFormEditTourDetailAuto(id: string): void {
      // Nếu form đang mở và ID người dùng giống nhau, chỉ cần đóng lại
      if (this.isEditTourDetailVisible && this.selectedTourDetail && this.selectedTourDetail.idtour === id) {
        this.isEditTourDetailVisible = false;
        this.selectedTourDetail = null; // Reset selectedUser
        return;
      }

      // Đóng form cũ trước khi mở mới
      this.isEditTourDetailVisible = false;

      setTimeout(() => {
        // Cập nhật thông tin người dùng mới
        this.selectedTourDetail = this.tour_details.find(tour_detail => tour_detail.idtour === id); // Lấy người dùng theo ID
        this.isEditTourDetailVisible = true; // Mở lại form

        // Cuộn đến form và focus vào ô nhập đầu tiên
        this.scrollToAndFocusForm();
      }, 0); // Timeout nhỏ để đảm bảo Angular cập nhật trạng thái
    }

    // Hàm cuộn đến form và focus vào ô nhập đầu tiên
    private scrollToAndFocusForm(): void {
      setTimeout(() => {
        const editFormElement = document.getElementById('editFormTourDetail');
        if (editFormElement) {
          const elementPosition = editFormElement.getBoundingClientRect().top + window.scrollY;
          window.scrollTo({ top: elementPosition, behavior: 'smooth' });

          const firstInputElement = editFormElement.querySelector('input');
          if (firstInputElement) {
            (firstInputElement as HTMLElement).focus();
          }
        }
      }, 100); // Timeout nhỏ để đảm bảo DOM được render đầy đủ
    }

    onBookDetailAdd(tour_detail : TourDetail){
      console.log('Người dùng mới:', tour_detail );
      this.isAddTourDetailVisible = false; // Ẩn form sau khi thêm
      // this.loadTourDetail(this.idtour);
    }


    editTourDetail(id : string) : void {
      this.tourDetailService.findTourDetail(id).subscribe({
        next: (tour_detail) =>{
          this.selectedTourDetail = tour_detail;
          this.isAddTourDetailVisible = false;
          this.isEditTourDetailVisible = true;
        },
        error: (error) =>{
          console.error('Lỗi khi lấy thông tin tài khoản', error);
        }
      });
    }


      // // Hàm xác nhận và xóa người dùng
      // confirmDelete(book_detail: any): void {
      //   const confirmed = confirm(`Bạn có chắc chắn muốn xóa người dùng ${book_detail.idbookdetail}?`);
      //   if (confirmed) {
      //     this.deleteBookDetail(book_detail.idbookdetail); // Gọi hàm xóa
      //   }
      // }

      // Hàm thực hiện xóa người dùng
      // deleteBookDetail(id: string): void {
      //   this.tourDetailService.deleteBookDetail(id).subscribe({
      //     next: () => {
      //       this.book_details = this.book_details.filter(book_detail => book_detail.idbookdetail !== id); // Cập nhật danh sách người dùng
      //       console.log(`Đã xóa thông tin tài khoản với id ${id}`);
      //       this.loadBookDetail();
      //     },
      //     error: (error) => {
      //       console.error('Lỗi khi xóa tài khoản:', error); // Xử lý lỗi nếu có
      //     }
      //   });
      // }
}
