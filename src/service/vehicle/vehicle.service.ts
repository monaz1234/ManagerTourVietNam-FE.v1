import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable,  BehaviorSubject } from 'rxjs';
import { tap } from 'rxjs/operators';
import { Vehicle } from '../../interface/vehicle.interface';

@Injectable({
  providedIn: 'root'
})
export class ManagerVehicleService {

  private vehiclesSubject: BehaviorSubject<Vehicle[]> = new BehaviorSubject<Vehicle[]>([]);
  vehicles$: Observable<Vehicle[]> = this.vehiclesSubject.asObservable(); // Observable để các component có thể lắng nghe

  constructor(private http: HttpClient) {
    this.getList_Vehicle(); // Tải danh sách người dùng ngay khi khởi tạo service
  }

  getList_Vehicle(): void {
    this.http.get<Vehicle[]>('http://localhost:9000/api/vehicles').subscribe((data) => {
      this.vehiclesSubject.next(data); // Cập nhật danh sách xe
    });
  }

  addVehicle(vehicle: Vehicle): Observable<any> {
    return this.http.post<any>('http://localhost:9000/api/vehicle', vehicle).pipe(
      tap(() => {
        this.getList_Vehicle(); // Cập nhật danh sách người dùng sau khi thêm
      })
    );
  }

  addImageVehicleToBackend(formData: FormData): Observable<any> {
    return this.http.post<any>('http://localhost:9000/api/vehicle/image/upload', formData).pipe(
  );
  }
  deleteImage(imageName: string): void {
    this.http.delete(`http://localhost:9000/api/vehicle/images/${imageName}`)
        .subscribe(response => {
            console.log('Hình ảnh đã được xóa:', response);
            // Thực hiện cập nhật giao diện nếu cần
        }, error => {
            console.error('Có lỗi xảy ra khi xóa hình ảnh:', error);
        });
  }


  deleteVehicle(id: string): Observable<void> {
    return this.http.delete<void>(`http://localhost:9000/api/vehicles/${id}`).pipe(
      tap(() => {
        this.getList_Vehicle(); // Cập nhật danh sách xe sau khi xóa
      })
    );
  }

}
