import { HttpClient, HttpParams } from '@angular/common/http';
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
  private totalPagesSubject: BehaviorSubject<number> = new BehaviorSubject<number>(0);
  totalPages$: Observable<number> = this.totalPagesSubject.asObservable();

  constructor(private http: HttpClient) {
    this.getTours(); // Tải danh sách khuyến mãi ngay khi khởi tạo service
  }

  getTours(): Observable<Tour[]> {
    return this.http.get<Tour[]>('http://localhost:9000/api/tour').pipe(
      tap(tours => this.tourSubject.next(tours)) // Cập nhật danh sách tour trong BehaviorSubject
    );
  }

  updateTours(idtour: string, tour: Tour): Observable<Tour> {
    return this.http.put<Tour>(`http://localhost:9000/api/tour/update_tour/${idtour}`, tour).pipe(
      tap(() => {
        this.getTours().subscribe();; // Cập nhật danh sách người dùng sau khi cập nhật
      })
    );
  }

  // getTourById(idtour: string): Observable<Tour> {
  //   return this.http.get<Tour>(`http://localhost:9000/api/tour/${idtour}`); // Không cần sử dụng tap ở đây
  // }

  getTourIds(): Observable<string[]>{
    return this.http.get<string[]>('http://localhost:9000/api/tour-ids');
  }


  getList_TourCopppy(): Observable<Tour[]> {
    return this.http.get<Tour[]>(`http://localhost:9000/api/tour`);
  }

  addTour(tour : Tour): Observable<any>{
    return this.http.post<any>(`http://localhost:9000/api/tour/add_tour`, tour).pipe(
      tap(() => {
        this.getTours(); // Cập nhật danh sách người dùng sau khi thêm
      })
    );
  }

  deleteTour(id: string): Observable<void> {
    return this.http.delete<void>(`http://localhost:9000/api/tour/delete_tour/${id}`).pipe(
      tap(() => {
        this.getTours(); // Cập nhật danh sách người dùng sau khi xóa
      })
    );
  }

  findTour(id : string): Observable<Tour>{
    return this.http.get<Tour>(`http://localhost:9000/api/tourcheck/${id}`);
  }


  updateTour(id: string, tourData: any): Observable<Tour> {
    return this.http.put<Tour>(`http://localhost:9000/api/tour/${id}`, tourData).pipe(
      tap(() => {
        this.getTours(); // Cập nhật danh sách người dùng sau khi cập nhật
      })
    );
  }


  getToursWithPagination(page: number, pageSize: number): Observable<any> {
    const params = new HttpParams()
        .set('page', (page).toString())
        .set('pageSize', pageSize.toString());

    return this.http.get<any>('http://localhost:9000/api/tour/phantrang',  
   { params }).pipe(
          tap(
            (response) => {
                if (response.content) {
                    this.tourSubject.next(response.content);
                    this.totalPagesSubject.next(response.totalPages || 0); // Đảm bảo totalPages không undefined
                } else {
                    console.error('Content is undefined', response);
                }
            },
            (error) => {
                console.error('Error fetching data', error);
            }
        )

    );
  }

  // getToursBySearch(query: string): Observable<Tour[]> {
  //   const url = `http://localhost:9000/api/tours/search?query=${query}`;
  //   return this.http.get<Tour[]>(url);
  // }

  addImageTourToBackend(formData: FormData): Observable<any> {
    return this.http.post<any>('http://localhost:9000/api/tour/image/upload', formData).pipe(
  );
  }

  deleteImage(imageName: string): void {
    this.http.delete(`http://localhost:9000/api/tour/images/${imageName}`)
        .subscribe(response => {
            console.log('Hình ảnh đã được xóa:', response);
            // Thực hiện cập nhật giao diện nếu cần
        }, error => {
            console.error('Có lỗi xảy ra khi xóa hình ảnh:', error);
        });
  }







}
