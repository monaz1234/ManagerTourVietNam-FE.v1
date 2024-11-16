import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { TourService } from '../../service/tour/tour.service'; // Import dịch vụ tour
import { TourDetailService } from '../../service/tour_detail/tourdetail.service'; // Import dịch vụ chi tiết tour
import { Tour } from '../../interface/tour.interface'; // Import interface tour

@Component({
  selector: 'app-customerdetail',
  templateUrl: './customerdetail.component.html',
  styleUrl: './customerdetail.component.scss'
})
export class CustomerdetailComponent {
  tourId: string | null = null; // Lưu ID của tour
  tourDetail: Tour | null = null;

  constructor(
    private route: ActivatedRoute,
    private tourService: TourService,
    private tourDetailService: TourDetailService
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      this.tourId = params.get('id'); // Lấy ID tour từ URL
      if (this.tourId) {
        this.loadTourDetail(this.tourId);
      }
    });
  }

  loadTourDetail(tourId: string): void {
    this.tourService.getTourById(tourId).subscribe(tour => {
      console.log(tour); // Xử lý tour chi tiết ở đây
      this.tourDetail = tour; // Lưu thông tin chi tiết của tour
    });
  }
}
