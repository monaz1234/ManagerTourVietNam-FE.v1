
import { Component,OnInit } from '@angular/core';
import { Tour } from '../../interface/tour.interface';
import { TourService } from '../../service/tour/tour.service';
import { TourDetail } from '../../interface/TourDetailFixAdd.interface';
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

  vehiclePrice : number =0;
  hotelPrice : number =0;
  servicePrice : number =0;





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

    // Thêm giá trị của phương tiện nếu có chọn
    if (this.selectedVehicle) {
      const selectedVehicleItem = this.vehicle_select.find(vehicle => vehicle.id_vehicles === String(this.selectedVehicle));

      if (selectedVehicleItem) {
        this.newTourDetail.vehicles = {
          ...selectedVehicleItem, // Copy tất cả các thuộc tính của vehicle

        };
        this.vehiclePrice = selectedVehicleItem.price || 0;
        this.newTourDetail.id_vehicles=String(this.selectedVehicle);
      }


    }

    // Thêm giá trị của khách sạn nếu có chọn
    if (this.selectedHotel) {
      const selectedHotelItem = this.hotel_select.find(hotel => hotel.id_hotel === String(this.selectedHotel));
      if (selectedHotelItem) {
        this.newTourDetail.service = {
          ...selectedHotelItem, // Copy tất cả các thuộc tính của service
        };
        this.hotelPrice = selectedHotelItem.price || 0;
        this.newTourDetail.id_hotel=String(this.selectedHotel);
      }
    }

    // Thêm giá trị của dịch vụ nếu có chọn
    if (this.selectedService) {
      const selectedServiceItem = this.service_select.find(service => service.id_service === String(this.selectedService));
      if (selectedServiceItem) {
        this.newTourDetail.hotel = {
          ...selectedServiceItem, // Copy tất cả các thuộc tính của hotel
        };
        this.servicePrice = selectedServiceItem.price || 0;
        this.newTourDetail.id_service=String(this.selectedService);
      }
    }
    this.totalPrice = this.vehiclePrice+this.hotelPrice+this.servicePrice;
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








  addTourDetail(){
    this.saveDate();
    this.newTourDetail.idtour = this.selectedTour;
    this.newTourDetail.depart = this.selectedDate;
    this.newTourDetail.total_price = this.totalPrice;
    this.newTourDetail.place = this.selectedPlace;
    this.newTourDetail.is_deleted = false;
    // this.vehicleService.findVehicle(this.newTourDetail.id_vehicles.toString()).subscribe({
    //   next: (vehicle) => {
    //     if(vehicle){
    //       this.newTourDetail.vehicles = vehicle;
    //     }
    //   },
    //   error : (err) =>{
    //     console.error('Lỗi :', err);
    //   }
    // });
    // this.hotelService.findHotel(this.newTourDetail.id_hotel.toString()).subscribe({
    //   next: (hotel) => {
    //     if(hotel){
    //       this.newTourDetail.hotel = hotel;
    //     }
    //   },
    //   error : (err) =>{
    //     console.error('Lỗi :', err);
    //   }
    // });
    // this.serviceService.findService(this.newTourDetail.id_service.toString()).subscribe({
    //   next: (service) => {
    //     if(service){
    //       this.newTourDetail.service = service;
    //     }
    //   },
    //   error : (err) =>{
    //     console.error('Lỗi :', err);
    //   }
    // });
    // this.tourService.findTour(this.newTourDetail.idtour.toString()).subscribe({
    //   next: (tour) => {
    //     if (tour) {
    //       this.newTourDetail.tour = tour;

    //     }
    //   },
    //   error: (err) => {
    //     console.error('Lỗi khi lấy chi tiết tour:', err);
    //   }
    // });


    console.log('Dữ liệu gửi lên:', this.newTourDetail);

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

