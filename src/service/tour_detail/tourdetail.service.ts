import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject } from 'rxjs';
import { tap } from 'rxjs/operators';
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
}
