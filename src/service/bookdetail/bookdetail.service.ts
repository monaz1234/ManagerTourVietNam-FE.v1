import { Injectable } from '@angular/core';
import { BehaviorSubject, catchError, Observable, tap } from 'rxjs';
import { bookdetail } from '../../interface/bookdetail.interface';
import { HttpClient, HttpParams } from '@angular/common/http';

interface PaginatedResponse<T> {
  content: T[];
  totalPages: number;
}

@Injectable({
  providedIn: 'root'
})
export class BookdetailService {
  private bookDetailSubject: BehaviorSubject<bookdetail[]> = new BehaviorSubject<bookdetail[]>([]);
  users$: Observable<bookdetail[]> = this.bookDetailSubject.asObservable(); // Observable để các component có thể lắng nghe
  private totalPagesSubject: BehaviorSubject<number> = new BehaviorSubject<number>(0);
  totalPages$: Observable<number> = this.totalPagesSubject.asObservable();

  constructor(private http: HttpClient) {
    this.getList_bookDetail();
   }

   getList_bookDetail() : void{
    this.http.get<bookdetail[]>('http://localhost:9000/api/bookdetails').subscribe((data) => {
      this.bookDetailSubject.next(data); // Cập nhật danh sách người dùng
    });
   }

   getBookDetailIds(): Observable<string[]> {
    return this.http.get<string[]>('http://localhost:9000/api/bookdetail-ids');
  }

  getList_BookDetailCopppy(): Observable<bookdetail[]> {
    return this.http.get<bookdetail[]>(`http://localhost:9000/api/bookdetails`);
  }

  addBookDetail(bookdetail: bookdetail): Observable<any> {
    return this.http.post<any>('http://localhost:9000/api/bookdetail', bookdetail).pipe(
      tap(() => {
        this.getList_bookDetail(); // Cập nhật danh sách người dùng sau khi thêm
      })
    );
  }

  deleteBookDetail(id: string): Observable<void> {
    return this.http.delete<void>(`http://localhost:9000/api/bookdetail/${id}`).pipe(
      tap(() => {
        this.getList_bookDetail(); // Cập nhật danh sách người dùng sau khi xóa
      })
    );
  }

  findBookDetail(id: string): Observable<bookdetail> {
    return this.http.get<bookdetail>(`http://localhost:9000/api/bookdetail/${id}`);
  }

  updateBookDetail(id: string, userData: any): Observable<bookdetail> {
    return this.http.put<bookdetail>(`http://localhost:9000/api/bookdetail/${id}`, userData).pipe(
      tap(() => {
        this.getList_bookDetail(); // Cập nhật danh sách người dùng sau khi cập nhật
      })
    );
  }

  getBookDetailWithPagination(page: number, pageSize: number): Observable<any> {
    const params = new HttpParams()
        .set('page', (page).toString())
        .set('pageSize', pageSize.toString());

    return this.http.get<any>('http://localhost:9000/api/bookdetail/phantrang',  
   { params }).pipe(
        tap(
            (response) => {
                console.log('Received data:', response); // Thêm log để kiểm tra dữ liệu
                if (response.content) {
                    this.bookDetailSubject.next(response.content);
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

  getBookDetailBySearch(query: string): Observable<bookdetail[]> {
    const url = `http://localhost:9000/api/bookdetail/search?query=${query}`;
    return this.http.get<bookdetail[]>(url);
  }

  getBookDetailsByBook(idbook: string): Observable<bookdetail[]> {
    return this.http.get<bookdetail[]>(`http://localhost:9000/api/bookdetailbyidbook/${idbook}`);
  }


  addBookDetailCreate(bookdetail: Omit<bookdetail, "idbookdetail">): Observable<bookdetail> {
    console.log('Book data:', bookdetail);  // In ra dữ liệu trước khi gửi
    return this.http.post<bookdetail>('http://localhost:9000/api/bookdetail/create', bookdetail).pipe(
      tap(() => {
        this.getList_bookDetail(); // Cập nhật danh sách sách sau khi thêm
      }),
      catchError(error => {
        console.error('Error adding book:', error);
        throw error; // Tiếp tục ném lỗi để xử lý ở nơi khác nếu cần
      })
    );
  }

}
