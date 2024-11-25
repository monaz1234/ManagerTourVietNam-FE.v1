import { HttpClient,HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable,  BehaviorSubject, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { tap } from 'rxjs/operators';
import { User } from '../interface/user.interface';
interface PaginatedResponse<T> {
  content: T[];
  totalPages: number;
}

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

  getUserIds(): Observable<string[]> {
    return this.http.get<string[]>('http://localhost:9000/api/user-ids');
  }


  getList_UserCopppy(): Observable<User[]> {
    return this.http.get<User[]>(`http://localhost:9000/api/users`);
  }

  private apiUrl = 'http://localhost:9000/api/user'; // URL của API backend
  // Phương thức lấy user theo username
  getUserByUsername(username: string): Observable<User> {
    return this.http.get<User>(`${this.apiUrl}/${username}`);
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


  getUsersWithPagination(page: number, pageSize: number): Observable<any> {
    const params = new HttpParams()
        .set('page', (page).toString())
        .set('pageSize', pageSize.toString());

    return this.http.get<any>('http://localhost:9000/api/user/phantrang',  
   { params }).pipe(
        tap(
            (response) => {
                console.log('Received data:', response); // Thêm log để kiểm tra dữ liệu
                if (response.content) {
                    this.usersSubject.next(response.content);
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

  getUsersBySearch(query: string): Observable<User[]> {
    const url = `http://localhost:9000/api/users/search?query=${query}`;
    return this.http.get<User[]>(url);
  }




}








