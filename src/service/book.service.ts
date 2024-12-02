import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, catchError, Observable, tap } from 'rxjs';
import { Book } from '../interface/book.interface';


interface PaginatedResponse<T>{
  content: T[];
  totalPages : number;
}


@Injectable({
  providedIn: 'root'
})


export class BookService {
  private bookSubject : BehaviorSubject<Book[]> = new BehaviorSubject<Book[]>([]);
  books$: Observable<Book[]> = this.bookSubject.asObservable();
  private totalPagesSubject: BehaviorSubject<number> = new BehaviorSubject<number>(0);
  totalPages$: Observable<number> = this.totalPagesSubject.asObservable();
  constructor(private http: HttpClient) {
    this.getList_Book();
  }

  getList_Book() : void{
    this.http.get<Book[]>('http://localhost:9000/api/books').subscribe((data) =>{
      this.bookSubject.next(data);
    });
  }

  getBookIds(): Observable<string[]> {
    return this.http.get<string[]>('http://localhost:9000/api/book-ids');
  }


  getList_BookCopppy(): Observable<Book[]> {
    return this.http.get<Book[]>(`http://localhost:9000/api/books`);
  }



  addBook(book: Omit<Book, "idbook">): Observable<Book> {
    console.log('Book data:', book);  // In ra dữ liệu trước khi gửi
    return this.http.post<Book>('http://localhost:9000/api/book/create', book).pipe(
      tap(() => {
        this.getList_Book(); // Cập nhật danh sách sách sau khi thêm
      }),
      catchError(error => {
        console.error('Error adding book:', error);
        throw error; // Tiếp tục ném lỗi để xử lý ở nơi khác nếu cần
      })
    );
  }


  // addBook(book: Book): Observable<any> {
  //   console.log('Book data:', book);  // In ra dữ liệu trước khi gửi
  //   return this.http.post<any>('http://localhost:9000/api/book/create', book).pipe(
  //     tap(() => {
  //       this.getList_Book(); // Cập nhật danh sách sách sau khi thêm
  //     }),
  //     catchError(error => {
  //       console.error('Error adding book:', error);
  //       throw error; // Tiếp tục ném lỗi để xử lý ở nơi khác nếu cần
  //     })
  //   );
  // }


  addBookClient(bookData: any): Observable<any> {
    return this.http.post('http://localhost:9000/api/books', bookData);
  }

  deleteBook(id: string): Observable<void> {
    return this.http.delete<void>(`http://localhost:9000/api/book/${id}`).pipe(
      tap(() => {
        this.getList_Book(); // Cập nhật danh sách người dùng sau khi xóa
      })
    );
  }

  findBook(id: string): Observable<Book> {
    return this.http.get<Book>(`http://localhost:9000/api/book/${id}`);
  }

  updateBook(id: string, bookData: any): Observable<Book> {
    return this.http.put<Book>(`http://localhost:9000/api/book/${id}`, bookData).pipe(
      tap(() => {
        this.getList_Book(); // Cập nhật danh sách người dùng sau khi cập nhật
      })
    );
  }


  getBooksWithPagination(page: number, pageSize: number): Observable<any> {
    const params = new HttpParams()
        .set('page', (page).toString())
        .set('pageSize', pageSize.toString());

    return this.http.get<any>('http://localhost:9000/api/book/phantrang',  
   { params }).pipe(
        tap(
            (response) => {
                console.log('Received data:', response); // Thêm log để kiểm tra dữ liệu
                if (response.content) {
                    this.bookSubject.next(response.content);
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

  getBooksBySearch(query: string): Observable<Book[]> {
    const url = `http://localhost:9000/api/books/search?query=${query}`;
    return this.http.get<Book[]>(url);
  }

  getBookById(id: string): Observable<any> {
    return this.http.get<any>(`http://localhost:9000/api/books/${id}`);
  }


}
