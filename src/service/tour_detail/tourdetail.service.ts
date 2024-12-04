import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { TourDetail } from '../../interface/tourdetail.interface';

@Injectable({
  providedIn: 'root'
})
export class TourDetailService {
  public tourdetailSubject: BehaviorSubject<TourDetail[]> = new BehaviorSubject<TourDetail[]>([]);
  tour$: Observable<TourDetail[]> = this.tourdetailSubject.asObservable(); // Observable để các component có thể lắng nghe

  constructor(private http: HttpClient) {
    this.getTours();
  }

  addTourDetailCreate(tourDetail: Omit<TourDetail, "idtourdetail">): Observable<TourDetail> {
    console.log('Tour Detail Add:', tourDetail);  // In ra dữ liệu trước khi gửi

    // Đảm bảo totalPrice là một số
    const updatedTourDetail = {
      ...tourDetail,
      total_price: Number(tourDetail.total_price) || 0,  // Chuyển totalPrice về kiểu số
    };

    return this.http.post<TourDetail>('http://localhost:9000/api/tour_detail/create', updatedTourDetail).pipe(
      tap(() => {
        this.getTours(); // Cập nhật danh sách sách sau khi thêm
      }),
      catchError(error => {
        console.error('Error adding tour detail:', error);
        throw error; // Tiếp tục ném lỗi để xử lý ở nơi khác nếu cần
      })
    );
  }

  // addTourDetailCreate(tourDetail: Omit<TourDetail, "idtourdetail">): Observable<TourDetail> {
  //   console.log('Tour Detail Add:', tourDetail);  // In ra dữ liệu trước khi gửi
  //   return this.http.post<TourDetail>('http://localhost:9000/api/tour_detail/create', tourDetail).pipe(
  //     tap(() => {
  //       this.getTours(); // Cập nhật danh sách sách sau khi thêm
  //     }),
  //     catchError(error => {
  //       console.error('Error adding book:', error);
  //       throw error; // Tiếp tục ném lỗi để xử lý ở nơi khác nếu cần
  //     })
  //   );
  // }

  getList_TourDetailCopppy(): Observable<TourDetail[]> {
    return this.http.get<TourDetail[]>(`http://localhost:9000/api/tour_detail`);
  }


  getFindTourDetail(idtour: string): Observable<TourDetail[]> {
    return this.http.get<TourDetail[]>(`http://localhost:9000/api/Find/tour_detail/${idtour}`);
  }


  getTours(): Observable<TourDetail[]> {
    return this.http.get<TourDetail[]>('http://localhost:9000/api/tour_detail').pipe(
      tap(toursdetail => this.tourdetailSubject.next(toursdetail)) // Cập nhật danh sách tour trong BehaviorSubject
    );
  }

  getServicePrice(): Observable<TourDetail[]> {
    return this.http.get<TourDetail[]>('http://localhost:9000/api/tour_detail/service_price').pipe(
      tap(serviceprice => this.tourdetailSubject.next(serviceprice)) // Cập nhật danh sách tour trong BehaviorSubject
    );
  }

  getVehiclesPrice(): Observable<TourDetail[]> {
    return this.http.get<TourDetail[]>('http://localhost:9000/api/tour_detail/vehicles').pipe(
      tap(vehicleprice => this.tourdetailSubject.next(vehicleprice)) // Cập nhật danh sách tour trong BehaviorSubject
    );
  }

  getHotelsPrice(): Observable<TourDetail[]> {
    return this.http.get<TourDetail[]>('http://localhost:9000/api/tour_detail/hotel_price').pipe(
      tap(hotelprice => this.tourdetailSubject.next(hotelprice)) // Cập nhật danh sách tour trong BehaviorSubject
    );
  }

  getTotalPrice(): Observable<TourDetail[]> {
    return this.http.get<TourDetail[]>('http://localhost:9000/api/tour_detail/total_price').pipe(
      tap(totalprice => this.tourdetailSubject.next(totalprice)) // Cập nhật danh sách tour trong BehaviorSubject
    );
  }

  applyPromotion(payload: any): Observable<number> {
    return this.http.post<number>('http://localhost:9000/api/apply-promotion', payload);
}

  findTourDetail(id: string): Observable<TourDetail> {
    return this.http.get<TourDetail>(`http://localhost:9000/api/tour_detail/${id}`);
  }

  getTourDetailsByTour(idtour: string): Observable<TourDetail[]> {
    return this.http.get<TourDetail[]>(`http://localhost:9000/api/tourdetailbyidtour/${idtour}`);
  }



}
