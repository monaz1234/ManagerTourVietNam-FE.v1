import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject } from 'rxjs';
import { tap } from 'rxjs/operators';
import { Tour } from '../../interface/tour.interface';

@Injectable({
  providedIn: 'root'
})
export class TourService {
  public tourSubject: BehaviorSubject<Tour[]> = new BehaviorSubject<Tour[]>([]);
  tour$: Observable<Tour[]> = this.tourSubject.asObservable(); // Observable để các component có thể lắng nghe

  constructor(private http: HttpClient) {
    this.getTours(); // Tải danh sách khuyến mãi ngay khi khởi tạo service
  }

  getTours(): Observable<Tour[]> {
    return this.http.get<Tour[]>('http://localhost:9000/api/tour').pipe(
      tap(tours => this.tourSubject.next(tours)) // Cập nhật danh sách tour trong BehaviorSubject
    );
  }
  
  updateTours(idtour: string, toura: Tour): Observable<Tour> {
    return this.http.put<Tour>(`http://localhost:9000//tour/update_tour/${idtour}`, toura).pipe(
      tap(() => {
        this.getTours().subscribe();; // Cập nhật danh sách người dùng sau khi cập nhật
      })
    );
  }

  getTourById(idtour: string): Observable<Tour> {
    return this.http.get<Tour>(`http://localhost:9000/tour/${idtour}`); // Không cần sử dụng tap ở đây
  }
  
}
