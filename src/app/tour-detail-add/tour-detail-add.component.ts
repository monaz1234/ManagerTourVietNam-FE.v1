
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

  vehicles: Vehicle[] = [];
  tour_select : Tour [] = [];
  vehicle_select : Vehicle [] = [];
  hotel_select : Hotel [] = [];
  service_select : Service [] = [];
  tourdetails: TourDetail[] = [];

  newTourDetail: any = {
    idtour: '',
    depart: new Date(),
    total_price: 0,
    place: 0,
    is_deleted: false,
    tour: '',
    vehicles: '',
    hotel: '',
    service: ''
  };

  constructor(private tourService: TourService,
    private route: ActivatedRoute,
    private vehicleService: ManagerVehicleService,
    private hotelService: ManagerHotelService,
    private serviceService: ServiceService,
    private tourDetailService : TourDetailService) { }
  ngOnInit(): void {
    this.getAll();
    this.generateNewTourDetailId();
    this.setSelectTour();

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
        this.totalPrice += selectedVehicleItem.price || 0;
      }
    }

    // Thêm giá trị của khách sạn nếu có chọn
    if (this.selectedHotel) {
      const selectedHotelItem = this.hotel_select.find(hotel => hotel.id_hotel === String(this.selectedHotel));
      if (selectedHotelItem) {
        this.totalPrice += selectedHotelItem.price || 0;
      }
    }

    // Thêm giá trị của dịch vụ nếu có chọn
    if (this.selectedService) {
      const selectedServiceItem = this.service_select.find(service => service.id_service === String(this.selectedService));
      if (selectedServiceItem) {
        this.totalPrice += selectedServiceItem.price || 0;
      }
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




  generateNewTourDetailId(): void {
    this.tourDetailService.getTours().subscribe((data: TourDetail[]) => {
      this.tourdetails = data;
      console.log('allTourDetails', data);
      this.newtourDetailId = 'T' + (parseInt(this.tourdetails[this.tourdetails.length - 1].idtour.slice(1)) + 1);
      console.log('newTourDetailId', this.newtourDetailId);
    });
  }
  addTourDetail(){
    this.saveDate();
    this.newTourDetail.idtour = this.newtourDetailId;
    this.newTourDetail.depart = this.selectedDate;
    this.newTourDetail.total_price = this.totalPrice;
    this.newTourDetail.place = this.selectedPlace;
    this.newTourDetail.is_deleted = false;
    this.newTourDetail.tour = this.selectedTour;
    this.newTourDetail.vehicles = this.selectedVehicle;
    this.newTourDetail.hotel = this.selectedHotel;
    this.newTourDetail.service = this.selectedService;
    console.log('newTourDetail', this.newTourDetail);

    // this.tourDetailService.addTourDetail(this.newTourDetail).subscribe(response => {
    //   console.log('Tour detail added successfully', response);
    //   // Reset form or perform any other necessary actions
    // }, error => {
    //   console.error('Error adding tour detail', error);
    // });

  }

  }

