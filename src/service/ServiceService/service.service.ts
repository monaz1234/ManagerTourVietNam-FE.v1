import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject } from 'rxjs';
import { tap } from 'rxjs/operators';
import { Service } from '../../interface/service.interface';

@Injectable({
  providedIn: 'root'
})
export class ServiceService {
  public serviceSubject: BehaviorSubject<Service[]> = new BehaviorSubject<Service[]>([]);
  service$: Observable<Service[]> = this.serviceSubject.asObservable(); // Observable để các component có thể lắng nghe

  constructor(private http: HttpClient) {
    this.getAllService(); // Tải danh sách khuyến mãi ngay khi khởi tạo service
  }

  getAllService(): Observable<Service[]> {
    return this.http.get<Service[]>('http://localhost:9000/api/services').pipe(
      tap(services => this.serviceSubject.next(services)) // Cập nhật danh sách tour trong BehaviorSubject
    );
  }
  

}
