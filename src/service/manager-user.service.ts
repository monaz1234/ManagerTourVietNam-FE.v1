import { HttpClient } from '@angular/common/http';
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


  constructor(private http: HttpClient) {
    this.getList_User(); // Tải danh sách người dùng ngay khi khởi tạo service
  }

  getList_User(): void {
    this.http.get<User[]>('http://localhost:9000/api/users').subscribe((data) => {
      this.usersSubject.next(data); // Cập nhật danh sách người dùng
    });
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
}
