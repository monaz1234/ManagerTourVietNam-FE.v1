import { Component, OnInit } from '@angular/core';
import { Vehicle } from '../../interface/vehicle.interface';
import { Tour } from '../../interface/tour.interface';
import { Hotel } from '../../interface/hotel.interface';
import { Service } from '../../interface/service.interface';
import { TourService } from '../../service/tour/tour.service';
import { ActivatedRoute } from '@angular/router';
import { ManagerVehicleService } from '../../service/vehicle/vehicle.service';
import { ManagerHotelService } from '../../service/hotel/manager-hotel.service';
import { ServiceService } from '../../service/ServiceService/service.service';
import { TourDetailService } from '../../service/tour_detail/tourdetail.service';
import { TourDetail } from '../../interface/TourDetailFixAdd.interface';
@Component({
  selector: 'app-tour-detail',
  templateUrl: './tour-detail.component.html',
  styleUrl: './tour-detail.component.scss'
})
export class TourDetailComponent {


 selectedTourFind: string = '';



  selectedTour: number = 0;
  selectedVehicle: number = 0;
  selectedHotel: number = 0;
  selectedService: number = 0;
  selectedDate: string = '';
  selectedPlace: number = 0;
  totalPrice: number = 0;
  groupedTourDetails: { [key: string]: any[] } = {};

  newTourDetail: any = {
    idtourdetail: '',
    idtour: '',
    id_vehicles: '',
    id_hotel: '',
    id_service: '',
    depart: '',
    total_price: 0,
    place: 0,
    is_deleted: false,
    tour: {},
    vehicles: {},
    hotel: {},
    service: {}
  };
  tourDetails: TourDetail[] = []


  vehicleOptions: Vehicle[] = [];
  tourOptions: Tour[] = [];
  hotelOptions: Hotel[] = [];
  serviceOptions: Service[] = [];
  errorMessages: string[] = [];



  [key: string]: any; // Thêm chỉ số kiểu string
  formFields: {
    name: string;
    label: string;
    type: string;
    required: boolean;
    options?: { value: string; label: string }[];
  }[] = [
      { name: 'depart', label: 'Depart', type: 'date', required: false },
      { name: 'totalPrice', label: 'Total Price', type: 'number', required: false },
      { name: 'place', label: 'Place', type: 'number', required: false },
      {
        name: 'tour',
        label: 'Id Tour',
        type: 'select',
        required: false,
        options: []
      },
      {
        name: 'vehicle',
        label: 'Id Vehicle',
        type: 'select',
        required: false,
        options: []
      },

      {
        name: 'hotel',
        label: 'Id Hotel',
        type: 'select',
        required: false,
        options: []
      },
      {
        name: 'service',
        label: 'Id Service',
        type: 'select',
        required: false,
        options: []
      },
    ];

  // groupByIdtour(): void {
  //   // Định nghĩa kiểu cho groups là Record<string, TourDetail[]>
  //   this.groupedTourDetails = this.tourDetails.reduce((groups, tour) => {
  //     const { idtour } = tour;

  //     // Nếu nhóm chưa có key idtour, khởi tạo mảng
  //     if (!groups[idtour]) {
  //       groups[idtour] = [];
  //     }

  //     // Thêm tour vào mảng tương ứng với idtour
  //     groups[idtour].push(tour);

  //     return groups;
  //   }, {} as Record<string, TourDetail[]>); // Cung cấp kiểu cho đối tượng groups
  // }

  ngOnInit(): void {
    // this.groupByIdtour();
    this.setSelectTour();
    this.loadVehiclesOptions();
    this.loadTourOptions();
    this.loadHotelOptions();
    this.loadServiceOptions();


    this.getHotelOptions();
    this.getServiceOptions();
    this.getTourOptions();
    this.getVehicleOptions();

    this.loadTourDetail(); // Thêm hàm để tải chi tiết tour
  }


  constructor(private tourService: TourService,
    private route: ActivatedRoute,
    private vehicleService: ManagerVehicleService,
    private hotelService: ManagerHotelService,
    private serviceService: ServiceService,
    private tourDetailService: TourDetailService) { }

  setSelectTour() {
    // Get the id_tour from the route parameter
    this.route.params.subscribe(params => {
      const tourId = params['id']; // Assuming the parameter is 'id' in the route path
      this.selectedTour = tourId; // Set the selected tour based on the URL parameter

    });
  }

  updateTotalPrice() {
    const tourPrice = this.newTourDetail.tour?.price || 0;
    const vehiclePrice = this.newTourDetail.vehicles?.price || 0;
    const hotelPrice = this.newTourDetail.hotel?.price || 0;
    const servicePrice = this.newTourDetail.service?.price || 0;

    this.newTourDetail.total_price = tourPrice + vehiclePrice + hotelPrice + servicePrice;
  }

  // loadTourDetail() {
  //   this.route.params.subscribe(params => {
  //     const tourId = params['id'];
  //     this.selectedTour = tourId;

  //     this.tourDetailService.getFindTourDetail(this.selectedTourFind).subscribe({
  //       next: (tourDetail) => {
  //         if (tourDetail) {
  //           this.newTourDetail = {
  //             // idtourdetail: tourDetail.idtourdetail,
  //             depart: tourDetail.depart,
  //             id_hotel: tourDetail.id_hotel,
  //             hotelName: tourDetail.hotel?.name_hotel, // Lấy từ đối tượng hotel
  //             id_service: tourDetail.service?.id_service,
  //             id_vehicles: tourDetail.id_vehicles,
  //             tourName: tourDetail.tour?.tourname, // Lấy từ đối tượng tour
  //           };
  //         }
  //       },
  //       error: (err) => {
  //         console.error('Lỗi khi lấy chi tiết tour:', err);
  //       }
  //     });
  //   });
  // }


  loadTourDetail() {
    this.route.params.subscribe(params => {
      const tourId = params['id']; // Lấy tham số từ route
      this.selectedTourFind = tourId.toString(); // Gán giá trị
    });

    this.tourDetailService.getFindTourDetail(this.selectedTourFind).subscribe({
      next: (tourDetail) => {
        console.log('Tour details:', tourDetail);
      },
      error: (err) => {
        console.error('Lỗi khi lấy chi tiết tour:', err);
      }
    });
  }


  loadServiceOptions(): void {
    this.serviceService.getList_ServiceCoppy().subscribe((Services: any[]) => {
      const activeUsers = Services.filter(service => service.status !== 2);
      const serviceOptions = activeUsers.map(service => ({
        value: service.id_service,
        label: service.name_service
      }));

      const field = this.formFields.find(field => field.name === 'service');
      if (field) {
        field.options = serviceOptions;
      }
    });
  }

  loadTourOptions(): void {
    this.tourService.getList_TourCopppy().subscribe((Tours: any[]) => {
      const activeUsers = Tours.filter(tour => tour.status !== 2);
      const tourOptions = activeUsers.map(tour => ({
        value: tour.idtour,
        label: tour.tourname
      }));

      const field = this.formFields.find(field => field.name === 'tour');
      if (field) {
        field.options = tourOptions;
      }
    });
  }


  loadVehiclesOptions(): void {
    this.vehicleService.getListVehicleCopppy().subscribe((vehicles: any[]) => {
      const activeUsers = vehicles.filter(vehicle => vehicle.status !== 2);
      const vehicleOptions = activeUsers.map(vehicle => ({
        value: vehicle.id_vehicles,
        label: vehicle.name_vehicles
      }));

      const field = this.formFields.find(field => field.name === 'vehicle');
      if (field) {
        field.options = vehicleOptions;
      }
    });
  }

  loadHotelOptions(): void {
    this.hotelService.getListHotelCopppy().subscribe((hotels: any[]) => {
      const activeUsers = hotels.filter(hotel => hotel.status !== 2);
      const hotelOptions = activeUsers.map(hotel => ({
        value: hotel.id_hotel,
        label: hotel.name_hotel
      }));

      const field = this.formFields.find(field => field.name === 'hotel');
      if (field) {
        field.options = hotelOptions;
      }
    });
  }

  getVehicleOptions() {
    this.vehicleService.getListVehicleCopppy().subscribe((data: any) => {
      this.vehicleOptions = data;
    });
  }

  onVehicleChange(selectedVehicleId: string) {
    const selectedVehicle = this.vehicleOptions.find((vehicle) => vehicle.id_vehicles === selectedVehicleId);

    if (selectedVehicle) {
      this.newTourDetail.vehicles = {
        ...selectedVehicle, // Copy tất cả các thuộc tính của vehicle
      };
      this.newTourDetail.id_vehicles = selectedVehicleId; // Cập nhật id_vehicles
    }
  }



  getServiceOptions() {
    this.serviceService.getList_ServiceCoppy().subscribe((data: any) => {
      this.serviceOptions = data;
    });
  }
  onServiceChange(selectedServiceId: string) {
    const selectedService = this.serviceOptions.find((service) => service.id_service === selectedServiceId);

    if (selectedService) {
      this.newTourDetail.service = {
        ...selectedService, // Copy tất cả các thuộc tính của service
      };
      this.newTourDetail.id_service = selectedServiceId; // Cập nhật id_service
    }
  }



  getTourOptions() {
    this.tourService.getList_TourCopppy().subscribe((data: any) => {
      this.tourOptions = data;
    });
  }



  onTourChange(selectedTourId: string) {
    const selectedTour = this.tourOptions.find((tour) => tour.idtour === selectedTourId);

    if (selectedTour) {
      this.newTourDetail.tour = {
        ...selectedTour, // Copy tất cả các thuộc tính của tour
      };
      this.newTourDetail.idtour = selectedTourId; // Cập nhật idtour
    }
  }


  getHotelOptions() {
    this.hotelService.getListHotelCopppy().subscribe((data: any) => {
      this.hotelOptions = data;  // Sai ở đây, phải gán cho this.hotelOptions
    });
  }

  onHotelChange(selectedHotelId: string) {
    const selectedHotel = this.hotelOptions.find((hotel) => hotel.id_hotel === selectedHotelId);

    if (selectedHotel) {
      this.newTourDetail.hotel = {
        ...selectedHotel, // Copy tất cả các thuộc tính của hotel
      };
      this.newTourDetail.id_hotel = selectedHotelId; // Cập nhật id_hotel
    }
  }



  onSelectChange(selectedValue: any) {
    // Gọi cả hai hàm khi giá trị thay đổi
    this.onHotelChange(selectedValue);
    this.onServiceChange(selectedValue);
    this.onTourChange(selectedValue);
    this.onVehicleChange(selectedValue);

  }




  validateForm(): boolean {
    this.errorMessages = [];

    if (!this.newTourDetail.idtour) this.errorMessages.push('Vui lòng chọn tour.');
    if (!this.newTourDetail.id_vehicles) this.errorMessages.push('Vui lòng chọn phương tiện.');
    if (!this.newTourDetail.id_hotel) this.errorMessages.push('Vui lòng chọn khách sạn.');
    if (!this.newTourDetail.id_service) this.errorMessages.push('Vui lòng chọn dịch vụ.');
    if (!this.newTourDetail.depart) this.errorMessages.push('Vui lòng chọn ngày khởi hành.');

    return this.errorMessages.length === 0;
  }
  onSubmit() {
    console.log('Dữ liệu gửi lên:', this.newTourDetail);

    if (!this.validateForm()) return;

    // Chuyển đổi các thông tin cần thiết
    const tourDetailData = {
      ...this.newTourDetail,
      totalPrice: this.newTourDetail.total_price,  // Đảm bảo bạn sử dụng total_price hoặc totalPrice đúng cách
    };

    this.tourDetailService.addTourDetailCreate(tourDetailData).subscribe({
      next: (response) => {
        console.log('Thêm chi tiết tour thành công:', response);
        // Thực hiện các hành động sau khi thành công, ví dụ reset form
      },
      error: (error) => {
        console.error('Lỗi khi thêm chi tiết tour:', error);
      }
    });
  }
}

