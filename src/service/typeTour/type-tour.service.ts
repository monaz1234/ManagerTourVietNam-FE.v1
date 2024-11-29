import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { TypeTour } from '../../interface/typeTour.interface';
import { HttpClient } from '@angular/common/http';
import { Tour } from '../../interface/tour.interface';

@Injectable({
  providedIn: 'root'
})
export class TypeTourService {
  public tourTypeSubject: BehaviorSubject<TypeTour[]> = new BehaviorSubject<TypeTour[]>([]);
  tourType$: Observable<TypeTour[]> = this.tourTypeSubject.asObservable(); // Observable để các component có thể lắng nghe
  private totalPagesSubject: BehaviorSubject<number> = new BehaviorSubject<number>(0);
  totalPages$: Observable<number> = this.totalPagesSubject.asObservable();



  constructor(private http: HttpClient) {
    this.getTourstype(); // Tải danh sách khuyến mãi ngay khi khởi tạo service
  }

  getTourstype(): Observable<TypeTour[]> {
    return this.http.get<TypeTour[]>('http://localhost:9000/api/type_tour').pipe(
      tap(tours => this.tourTypeSubject.next(tours)) // Cập nhật danh sách tour trong BehaviorSubject
    );
  }
  getList_TourTypeCopppyNew(): Observable<TypeTour[]> {
    return this.http.get<TypeTour[]>(`http://localhost:9000/api/type_tour`);
  }
}
