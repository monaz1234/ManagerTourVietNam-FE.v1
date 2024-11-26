import { HttpClient, HttpParams } from '@angular/common/http';
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
  private totalPagesSubject: BehaviorSubject<number> = new BehaviorSubject<number>(0);
  totalPages$: Observable<number> = this.totalPagesSubject.asObservable();

  constructor(private http: HttpClient) {
    this.getList_Service(); // Tải danh sách khuyến mãi ngay khi khởi tạo service
  }

  getList_Service(): void {
    this.http.get<Service[]>('http://localhost:9000/api/services').subscribe((data) => {
      this.serviceSubject.next(data); // Cập nhật danh sách người dùng
    });
  }


  getServiceIds(): Observable<string[]>{
    return this.http.get<string[]>('http://localhost:9000/api/service-ids');
  }
  getList_ServiceCoppy(): Observable<Service[]>{
    return this.http.get<Service[]>(`http://localhost:9000/api/services`);
  }

  addService(service : Service): Observable<any>{
    return this.http.post<any>(`http://localhost:9000/service`, service).pipe(
      tap(() => {
        this.getList_Service(); // Cập nhật danh sách người dùng sau khi thêm
      })
    );
  }

  deleteService(id: string): Observable<void> {
    return this.http.delete<void>(`http://localhost:9000//service/{${id}`).pipe(
      tap(() => {
        this.getList_Service(); // Cập nhật danh sách người dùng sau khi xóa
      })
    );
  }

  findService(id : string): Observable<Service>{
    return this.http.get<Service>(`http://localhost:9000//service/${id}`);
  }

  updateService(id: string, serviceData: any): Observable<Service> {
    return this.http.put<Service>(`http://localhost:9000//service/${id}`, serviceData).pipe(
      tap(() => {
        this.getList_Service(); // Cập nhật danh sách người dùng sau khi cập nhật
      })
    );
  }


  getServicesWithPagination(page: number, pageSize: number): Observable<any> {
    const params = new HttpParams()
        .set('page', (page).toString())
        .set('pageSize', pageSize.toString());

    return this.http.get<any>('http://localhost:9000/api/service/phantrang',  
   { params }).pipe(
        tap(
            (response) => {
                console.log('Received data:', response); // Thêm log để kiểm tra dữ liệu
                if (response.content) {
                    this.serviceSubject.next(response.content);
                    this.totalPagesSubject.next(response.totalPages);
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

  getServicesBySearch(query: string): Observable<Service[]> {
    const url = `http://localhost:9000/api/services/search?query=${query}`;
    return this.http.get<Service[]>(url);
  }

}
