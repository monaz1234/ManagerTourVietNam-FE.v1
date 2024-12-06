// import { Component, OnInit } from '@angular/core';
// import { Vehicle } from '../../interface/vehicle.interface';
// import { Tour } from '../../interface/tour.interface';
// import { Hotel } from '../../interface/hotel.interface';
// import { Service } from '../../interface/service.interface';
// import { TourService } from '../../service/tour/tour.service';
// import { ActivatedRoute } from '@angular/router';
// import { ManagerVehicleService } from '../../service/vehicle/vehicle.service';
// import { ManagerHotelService } from '../../service/hotel/manager-hotel.service';
// import { ServiceService } from '../../service/ServiceService/service.service';
// import { TourDetailService } from '../../service/tour_detail/tourdetail.service';
// import { TourDetail } from '../../interface/TourDetailFixAdd.interface';
// @Component({
//   selector: 'app-tour-detail',
//   templateUrl: './tour-detail.component.html',
//   styleUrl: './tour-detail.component.scss'
// })
// export class TourDetailComponent {


//  selectedTourFind: string = '';


//   vehiclePrice :number =0;
//   hotelPrice : number =0;
//   servicePrice :number =0;
//   selectedTour: number = 0;
//   selectedVehicle: number = 0;
//   selectedHotel: number = 0;
//   selectedService: number = 0;
//   selectedDate: string = '';
//   selectedPlace: number = 0;
//   totalPrice: number = 0;
//   groupedTourDetails: { [key: string]: any[] } = {};

//   newTourDetail: any = {
//     idtourdetail: '',
//     idtour: '',
//     id_vehicles: '',
//     id_hotel: '',
//     id_service: '',
//     depart: '',
//     total_price: 0,
//     place: 0,
//     is_deleted: false,
//     tour: {},
//     vehicles: {},
//     hotel: {},
//     service: {}
//   };
//   tourDetails: TourDetail[] = []


//   vehicleOptions: Vehicle[] = [];
//   tourOptions: Tour[] = [];
//   hotelOptions: Hotel[] = [];
//   serviceOptions: Service[] = [];
//   errorMessages: string[] = [];



//   [key: string]: any; // Thêm chỉ số kiểu string
//   formFields: {
//     name: string;
//     label: string;
//     type: string;
//     required: boolean;
//     options?: { value: string; label: string }[];
//   }[] = [
//       { name: 'depart', label: 'Depart', type: 'date', required: false },
//       { name: 'totalPrice', label: 'Total Price', type: 'number', required: false },
//       { name: 'place', label: 'Place', type: 'number', required: false },
//       {
//         name: 'tour',
//         label: 'Id Tour',
//         type: 'select',
//         required: false,
//         options: []
//       },
//       {
//         name: 'vehicle',
//         label: 'Id Vehicle',
//         type: 'select',
//         required: false,
//         options: []
//       },

//       {
//         name: 'hotel',
//         label: 'Id Hotel',
//         type: 'select',
//         required: false,
//         options: []
//       },
//       {
//         name: 'service',
//         label: 'Id Service',
//         type: 'select',
//         required: false,
//         options: []
//       },
//     ];


//   logFormFields() {
//     console.log('Form Fields:', this.formFields);
//   }
//   ngOnInit(): void {
//     // this.groupByIdtour();

//     this.loadVehiclesOptions();
//     this.loadTourOptions();
//     this.loadHotelOptions();
//     this.loadServiceOptions();


//     this.getHotelOptions();
//     this.getServiceOptions();
//     this.getTourOptions();
//     this.getVehicleOptions();

//     this.loadTourDetail(); // Thêm hàm để tải chi tiết tour

//     this.logFormFields();
//   }


//   constructor(
//     private tourService: TourService,
//     private route: ActivatedRoute,
//     private vehicleService: ManagerVehicleService,
//     private hotelService: ManagerHotelService,
//     private serviceService: ServiceService,
//     private tourDetailService: TourDetailService) { }

//   setSelectTour() {
//     // Get the id_tour from the route parameter
//     this.route.params.subscribe(params => {
//       const tourId = params['id']; // Assuming the parameter is 'id' in the route path
//       this.selectedTour = tourId; // Set the selected tour based on the URL parameter

//     });
//   }






//   loadTourDetail() {
//     this.route.params.subscribe(params => {
//       const tourId = params['id']; // Lấy tham số từ route
//       this.selectedTourFind = tourId.toString(); // Gán giá trị
//     });

//     this.tourDetailService.getFindTourDetail(this.selectedTourFind).subscribe({
//       next: (tourDetail) => {
//         console.log('Tour details:', tourDetail);
//       },
//       error: (err) => {
//         console.error('Lỗi khi lấy chi tiết tour:', err);
//       }
//     });
//   }


//   loadServiceOptions(): void {
//     this.serviceService.getList_ServiceCoppy().subscribe((Services: any[]) => {
//       const activeUsers = Services.filter(service => service.status !== 2);
//       const serviceOptions = activeUsers.map(service => ({
//         value: service.id_service,
//         label: service.name_service
//       }));


//       const field = this.formFields.find(field => field.name === 'service');
//       if (field) {
//         field.options = serviceOptions;
//       }
//     });
//   }

//   loadTourOptions(): void {



//     this.tourService.getList_TourCopppy().subscribe((Tours: any[]) => {
//       const activeUsers = Tours.filter(tour => tour.status !== 2);
//       const tourOptions = activeUsers.map(tour => ({
//         value: tour.idtour,
//         label: tour.tourname
//       }));

//       const field = this.formFields.find(field => field.name === 'tour');
//       if (field) {
//         field.options = tourOptions;
//       }
//       this.setSelectTour();
//       console.log('setSelectTour', this.selectedTour);
//       this.newTourDetail.idtour = this.selectedTour;

//       console.log('newTourDetail:',this.newTourDetail);

//       this.tourService.findTour(this.selectedTour.toString()).subscribe({
//         next: (tour) => {
//           if (tour) {
//             this.newTourDetail.tour = tour;

//           }
//         },
//         error: (err) => {
//           console.error('Lỗi khi lấy chi tiết tour:', err);
//         }
//       });

//     });
//   }


//   loadVehiclesOptions(): void {
//     this.vehicleService.getListVehicleCopppy().subscribe((vehicles: any[]) => {
//       const activeUsers = vehicles.filter(vehicle => vehicle.status !== 2);
//       const vehicleOptions = activeUsers.map(vehicle => ({
//         value: vehicle.id_vehicles,
//         label: vehicle.name_vehicles
//       }));

//       const field = this.formFields.find(field => field.name === 'vehicle');
//       if (field) {
//         field.options = vehicleOptions;


//       }
//     });


//   }

//   loadHotelOptions(): void {
//     this.hotelService.getListHotelCopppy().subscribe((hotels: any[]) => {
//       const activeUsers = hotels.filter(hotel => hotel.status !== 2);
//       const hotelOptions = activeUsers.map(hotel => ({
//         value: hotel.id_hotel,
//         label: hotel.name_hotel
//       }));

//       const field = this.formFields.find(field => field.name === 'hotel');
//       if (field) {
//         field.options = hotelOptions;
//       }
//     });
//   }

//   getVehicleOptions() {
//     this.vehicleService.getListVehicleCopppy().subscribe((data: any) => {
//       this.vehicleOptions = data;
//     });
//   }

//   onVehicleChange(selectedVehicleId: string) {


//     const selectedVehicle = this.vehicleOptions.find((vehicle) => vehicle.id_vehicles === selectedVehicleId);


//     if (selectedVehicle) {
//       this.newTourDetail.vehicles = {
//         ...selectedVehicle, // Copy tất cả các thuộc tính của vehicle

//       };
//       this.newTourDetail.id_vehicles = selectedVehicleId; // Cập nhật id_vehicles
//       const selectedVehicleItem = this.vehicleOptions.find(vehicle => vehicle.id_vehicles === String(this.newTourDetail.id_vehicles));
//       if (selectedVehicleItem) {
//         this.vehiclePrice = selectedVehicleItem.price ;
//         this.updateTotalPrice();
//       }

//     }
//     console.log('vehicelPrice:',this.vehiclePrice);



//   }



//   getServiceOptions() {
//     this.serviceService.getList_ServiceCoppy().subscribe((data: any) => {
//       this.serviceOptions = data;
//     });
//   }
//   onServiceChange(selectedServiceId: string) {
//     const selectedService = this.serviceOptions.find((service) => service.id_service === selectedServiceId);

//     if (selectedService) {
//       this.newTourDetail.service = {
//         ...selectedService, // Copy tất cả các thuộc tính của service
//       };
//       this.newTourDetail.id_service = selectedServiceId; // Cập nhật id_service
//       const selectedServiceItem = this.serviceOptions.find(service => service.id_service === String(this.selectedService));
//       if (selectedServiceItem) {
//         this.servicePrice = selectedServiceItem.price || 0;
//       }
//     }
//     this.updateTotalPrice();

//   }



//   getTourOptions() {
//     this.tourService.getList_TourCopppy().subscribe((data: any) => {
//       this.tourOptions = data;
//     });
//   }






//   getHotelOptions() {
//     this.hotelService.getListHotelCopppy().subscribe((data: any) => {
//       this.hotelOptions = data;  // Sai ở đây, phải gán cho this.hotelOptions
//     });
//   }

//   onHotelChange(selectedHotelId: string) {
//     const selectedHotel = this.hotelOptions.find((hotel) => hotel.id_hotel === selectedHotelId);

//     if (selectedHotel) {
//       this.newTourDetail.hotel = {
//         ...selectedHotel, // Copy tất cả các thuộc tính của hotel
//       };
//       this.newTourDetail.id_hotel = selectedHotelId; // Cập nhật id_hotel
//       const selectedHotelItem = this.hotelOptions.find(hotel => hotel.id_hotel === String(this.selectedHotel));
//       if (selectedHotelItem) {
//         this.hotelPrice = selectedHotelItem.price || 0;
//       }
//     }
//     this.updateTotalPrice();
//   }



//   onSelectChange(selectedValue: any) {
//     // Gọi cả hai hàm khi giá trị thay đổi
//     this.onHotelChange(selectedValue);
//     this.onServiceChange(selectedValue);
//     this.onVehicleChange(selectedValue);

//   }




//   validateForm(): boolean {
//     this.errorMessages = [];

//     if (!this.newTourDetail.idtour) this.errorMessages.push('Vui lòng chọn tour.');
//     if (!this.newTourDetail.id_vehicles) this.errorMessages.push('Vui lòng chọn phương tiện.');
//     if (!this.newTourDetail.id_hotel) this.errorMessages.push('Vui lòng chọn khách sạn.');
//     if (!this.newTourDetail.id_service) this.errorMessages.push('Vui lòng chọn dịch vụ.');
//     if (!this.newTourDetail.depart) this.errorMessages.push('Vui lòng chọn ngày khởi hành.');

//     return this.errorMessages.length === 0;
//   }
//   onSubmit() {
//     console.log('Dữ liệu gửi lên:', this.newTourDetail);

//     if (!this.validateForm()) return;

//     // Chuyển đổi các thông tin cần thiết
//     const tourDetailData = {
//       ...this.newTourDetail,
//       totalPrice: this.newTourDetail.total_price,  // Đảm bảo bạn sử dụng total_price hoặc totalPrice đúng cách
//     };

//     this.tourDetailService.addTourDetailCreate(tourDetailData).subscribe({
//       next: (response) => {
//         console.log('Thêm chi tiết tour thành công:', response);
//         // Thực hiện các hành động sau khi thành công, ví dụ reset form
//       },
//       error: (error) => {
//         console.error('Lỗi khi thêm chi tiết tour:', error);
//       }
//     });
//   }
//   getNgModelValue(field: any) {
//     if (field.name === 'tour') {
//       console.log("tour:",this.newTourDetail.tour);

//       return this.newTourDetail.tour?.tourname || ''; // Trả về tên tour nếu có
//     }
//     return this.newTourDetail[field.name]; // Giá trị mặc định cho các trường khác
//   }
//   setNgModelValue(field: any, value: any) {
//     if (field.name === 'tour') {
//       if (!this.newTourDetail.tour) {
//         this.newTourDetail.tour = {}; // Khởi tạo đối tượng nếu null
//       }
//       this.newTourDetail.tour.tourname = value;
//     } else {
//       this.newTourDetail[field.name] = value;
//     }
//   }

//   updateTotalPrice() {


//     this.totalPrice = this.vehiclePrice + this.hotelPrice + this.servicePrice;
//     console.log('Total Price:',this.newTourDetail.tour.price);

//   }

// }


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


