
import { Component,OnInit } from '@angular/core';
import { Tour } from '../../interface/tour.interface';
import { TourService } from '../../service/tour/tour.service';
import { TourDetail } from '../../interface/tourdetail.interface';
import { TourDetailService } from '../../service/tour_detail/tourdetail.service';

import { Vehicle } from '../../interface/vehicle.interface';
import { ManagerVehicleService } from '../../service/vehicle/vehicle.service';
import { Hotel } from '../../interface/hotel.interface';
import { ManagerHotelService } from '../../service/hotel/manager-hotel.service';
import { Service } from '../../interface/service.interface';
import { ServiceService } from '../../service/ServiceService/service.service';

import { ActivatedRoute } from '@angular/router';
interface Option {
  id: string; // hoặc số nếu ID là kiểu số
  name: string;
}
@Component({
  selector: 'app-tour-detail-add',
  templateUrl: './tour-detail-add.component.html',
  styleUrl: './tour-detail-add.component.scss'
})
export class TourDetailAddComponent implements OnInit{

  // Các biến lưu trữ giá trị đã chọn
  selectedTour: number = 0;
  selectedVehicle: number = 0;
  selectedHotel: number = 0;
  selectedService: number = 0;
  selectedDate: string = '';
  selectedPlace: number = 0;
  totalPrice: number = 0;
   newtourDetailId : string =' ';
   errorMessages: string[] = [];

  vehicles: Vehicle[] = [];
  tour_select : Tour [] = [];
  vehicle_select : Vehicle [] = [];
  hotel_select : Hotel [] = [];
  service_select : Service [] = [];
  tourdetails: TourDetail[] = [];


  vehicleOptions : Vehicle[] = [];
  tourOptions : Tour [] = [];
  hotelOptions : Hotel [] = [];
  serviceOptions : Service [] = [];






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

  constructor(private tourService: TourService,
    private route: ActivatedRoute,
    private vehicleService: ManagerVehicleService,
    private hotelService: ManagerHotelService,
    private serviceService: ServiceService,
    private tourDetailService : TourDetailService) { }
  ngOnInit(): void {
    this.getAll();
    // this.generateNewTourDetailId();
    this.setSelectTour();



    this.getVehicleOptions();
    this.getHotelOptions();
    this.getServiceOptions();
    this.getTourOptions();

  }

  getVehicleOptions() {
    this.vehicleService.getListVehicleCopppy().subscribe((data: any) => {
      this.vehicleOptions = data;
    });
  }

  getServiceOptions() {
    this.serviceService.getList_ServiceCoppy().subscribe((data: any) => {
      this.serviceOptions = data;
    });
  }


  getTourOptions() {
    this.tourService.getList_TourCopppy().subscribe((data: any) => {
      this.tourOptions = data;
    });
  }

  getHotelOptions() {
    this.hotelService.getListHotelCopppy().subscribe((data: any) => {
      this.hotelOptions = data;

    });
  }


  getAll(){
    this.tourService.getTours().subscribe((data: Tour[]) => {
      this.tour_select = data;
      console.log('alltour_select',this.tour_select);

    });
    this.vehicleService.vehicles$.subscribe((data: Vehicle[]) => {
      this.vehicle_select = data;
      console.log('allvehicle_select',this.vehicle_select[0]?.price);

    });
    this.hotelService.hotels$.subscribe((data: Hotel[]) => {
      this.hotel_select = data;
    });
    this.serviceService.service$.subscribe((data: Service[]) => {
      this.service_select = data;
    });


    console.log('allvehicle_select',this.vehicle_select);
    console.log('allhotel_select',this.hotel_select);
    console.log('allservice_select',this.service_select);
  }



  updateTotalPrice() {
    this.totalPrice = 0; // Khởi tạo lại totalPrice
    this.onTourChange(String(this.selectedTour)); // Thêm giá trị của tour nếu có chọn
    // Thêm giá trị của phương tiện nếu có chọn
    if (this.selectedVehicle) {
      const selectedVehicleItem = this.vehicle_select.find(vehicle => vehicle.id_vehicles === String(this.selectedVehicle));
      if (selectedVehicleItem) {
        this.totalPrice += selectedVehicleItem.price || 0;
      }
      this.onVehicleChange(String(this.selectedVehicle));
    }

    // Thêm giá trị của khách sạn nếu có chọn
    if (this.selectedHotel) {
      const selectedHotelItem = this.hotel_select.find(hotel => hotel.id_hotel === String(this.selectedHotel));
      if (selectedHotelItem) {
        this.totalPrice += selectedHotelItem.price || 0;
      }
      this.onHotelChange(String(this.selectedHotel));
    }

    // Thêm giá trị của dịch vụ nếu có chọn
    if (this.selectedService) {
      const selectedServiceItem = this.service_select.find(service => service.id_service === String(this.selectedService));
      if (selectedServiceItem) {
        this.totalPrice += selectedServiceItem.price || 0;
      }
      this.onServiceChange(String(this.selectedService));
    }

    // In ra totalPrice để kiểm tra
    console.log('Total Price:', this.totalPrice);
  }

  setSelectTour(){
    // Get the id_tour from the route parameter
    this.route.params.subscribe(params => {
      const tourId = params['id']; // Assuming the parameter is 'id' in the route path
      this.selectedTour = tourId; // Set the selected tour based on the URL parameter

    });
  }
  saveDate() {
    // Chuyển selectedDate thành đối tượng Date chỉ bao gồm phần ngày
    if (this.selectedDate) {
      const [year, month, day] = this.selectedDate.split('-');
      this.newTourDetail.depart = new Date(`${year}-${month}-${day}`);
    }
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
  onServiceChange(selectedServiceId: string) {
    const selectedService = this.serviceOptions.find((service) => service.id_service === selectedServiceId);

    if (selectedService) {
      this.newTourDetail.service = {
        ...selectedService, // Copy tất cả các thuộc tính của service
      };
      this.newTourDetail.id_service = selectedServiceId; // Cập nhật id_service
    }
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
  onTourChange(selectedTourId: string) {
    const selectedTour = this.tourOptions.find((tour) => tour.idtour === selectedTourId);

    if (selectedTour) {
      this.newTourDetail.tour = {
        ...selectedTour, // Copy tất cả các thuộc tính của tour
      };
      this.newTourDetail.idtour = selectedTourId; // Cập nhật idtour
    }
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
  addTourDetail(){
    console.log('Dữ liệu gửi lên:', this.newTourDetail);

    // if (!this.validateForm()) return;

    // Chuyển đổi các thông tin cần thiết
    const tourDetailData = {
      ...this.newTourDetail,
      place: this.selectedPlace,
      total_price: this.totalPrice,  // Đảm bảo bạn sử dụng total_price hoặc totalPrice đúng cách
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

