import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable,  BehaviorSubject } from 'rxjs';
import { tap } from 'rxjs/operators';
import { Hotel } from '../../interface/hotel.interface';

@Injectable({
  providedIn: 'root'
})
export class ManagerHotelService {

  private hotelsSubject: BehaviorSubject<Hotel[]> = new BehaviorSubject<Hotel[]>([]);
  hotels$: Observable<Hotel[]> = this.hotelsSubject.asObservable(); // Observable để các component có thể lắng nghe

  constructor(private http : HttpClient) {
    this.getList_Hotel(); // Tải danh sách người dùng ngay khi khởi tạo service
  }


  getListHotelCopppy(): Observable<Hotel[]> {
    return this.http.get<Hotel[]>(`http://localhost:9000/api/hotels`);
  }


  getHotels(): Observable<Hotel[]> {
    return this.http.get<Hotel[]>('http://localhost:9000/api/hotels'); //lấy danh sách hotel ở client
  }
  getList_Hotel(): void {
    this.http.get<Hotel[]>('http://localhost:9000/api/hotels').subscribe((data) => {
      this.hotelsSubject.next(data);
    });
  }

  addHotel(hotel: Hotel): Observable<any> {
    return this.http.post<any>('http://localhost:9000/api/hotel', hotel).pipe(
      tap(() => {
        this.getList_Hotel(); // Cập nhật danh sách người dùng sau khi thêm
      })
    );
  }

  addImageHotelToBackend(formData: FormData): Observable<any> {
    return this.http.post<any>('http://localhost:9000/api/hotel/image/upload', formData).pipe(
  );
  }

  deleteImage(imageName: string): void {
    this.http.delete(`http://localhost:9000/api/hotel/images/${imageName}`)
        .subscribe(response => {
            console.log('Hình ảnh đã được xóa:', response);
            // Thực hiện cập nhật giao diện nếu cần
        }, error => {
            console.error('Có lỗi xảy ra khi xóa hình ảnh:', error);
        });
  }

  deleteHotel(id: string): Observable<void> {
    return this.http.delete<void>(`http://localhost:9000/api/hotel/${id}`).pipe(
      tap(() => {
        this.getList_Hotel(); // Cập nhật danh sách xe sau khi xóa
      })
    );
  }
  findHotel(id: string): Observable<Hotel> {
    return this.http.get<Hotel>(`http://localhost:9000/api/hotel/${id}`);
  }
  updateHotel(id: string, hotelData: any): Observable<Hotel> {
    return this.http.put<Hotel>(`http://localhost:9000/api/hotel/${id}`, hotelData).pipe(
      tap(() => {
        this.getList_Hotel(); // Cập nhật danh sách người dùng sau khi cập nhật
      })
    );
  }


}
