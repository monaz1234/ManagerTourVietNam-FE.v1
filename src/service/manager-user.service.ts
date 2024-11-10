import { HttpClient,HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable,  BehaviorSubject } from 'rxjs';
import { tap } from 'rxjs/operators';
import { User } from '../interface/user.interface';

@Injectable({
  providedIn: 'root'
})
export class ManagerUserService {
  private usersSubject: BehaviorSubject<User[]> = new BehaviorSubject<User[]>([]);
  users$: Observable<User[]> = this.usersSubject.asObservable(); // Observable để các component có thể lắng nghe
  private totalPagesSubject: BehaviorSubject<number> = new BehaviorSubject<number>(0);
  totalPages$: Observable<number> = this.totalPagesSubject.asObservable();

  constructor(private http: HttpClient) {
    this.getList_User(); // Tải danh sách người dùng ngay khi khởi tạo service
  }

  getList_User(): void {
    this.http.get<User[]>('http://localhost:9000/api/users').subscribe((data) => {
      this.usersSubject.next(data); // Cập nhật danh sách người dùng
    });
  }

  getList_UserCopppy(): Observable<User[]> {
    return this.http.get<User[]>(`http://localhost:9000/api/users`);
  }


  addUser(user: User): Observable<any> {
    return this.http.post<any>('http://localhost:9000/api/user', user).pipe(
      tap(() => {
        this.getList_User(); // Cập nhật danh sách người dùng sau khi thêm
      })
    );
  }

  deleteUser(id: string): Observable<void> {
    return this.http.delete<void>(`http://localhost:9000/api/user/${id}`).pipe(
      tap(() => {
        this.getList_User(); // Cập nhật danh sách người dùng sau khi xóa
      })
    );
  }

  findUser(id: string): Observable<User> {
    return this.http.get<User>(`http://localhost:9000/api/user/${id}`);
  }

  updateUser(id: string, userData: any): Observable<User> {
    return this.http.put<User>(`http://localhost:9000/api/user/${id}`, userData).pipe(
      tap(() => {
        this.getList_User(); // Cập nhật danh sách người dùng sau khi cập nhật
      })
    );
  }
  currentPage: number = 1; // Default page number
  itemsPerPage: number = 1; // Default items per page

  private apiUrl = `http://localhost:9000/api/user/phantrang?page=${this.currentPage}&size=${this.itemsPerPage}`;

  getUsersWithPagination(page: number, pageSize: number): Observable<any> {
    const params = new HttpParams()
      .set('page', (page - 1).toString()) // Chuyển đổi page từ 1 thành 0 cho backend
      .set('pageSize', pageSize.toString());

    return this.http.get<any>(this.apiUrl, { params }).pipe(
      tap((response) => {
        this.usersSubject.next(response.content); // Cập nhật danh sách người dùng
        this.totalPagesSubject.next(response.totalPages); // Cập nhật tổng số trang
      })
    );
  }
}








