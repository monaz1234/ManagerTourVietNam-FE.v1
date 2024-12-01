import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { Invoice } from '../../interface/invoice.interface';
import { HttpClient, HttpParams } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class InvoiceService {

  public invoiceSubject: BehaviorSubject<Invoice[]> = new BehaviorSubject<Invoice[]>([]);
  invoices$: Observable<Invoice[]> = this.invoiceSubject.asObservable(); // Observable để các component có thể lắng nghe
  private totalPagesSubject: BehaviorSubject<number> = new BehaviorSubject<number>(0);
  totalPages$: Observable<number> = this.totalPagesSubject.asObservable();


  constructor(private http: HttpClient) {
    this.getList_Invoice(); // Tải danh sách khuyến mãi ngay khi khởi tạo service
  }
  getList_Invoice(): void {
    this.http.get<Invoice[]>('http://localhost:9000/api/invoices').subscribe((data) => {
      this.invoiceSubject.next(data); // Cập nhật danh sách người dùng
    });
  }

  getInvoiceIds(): Observable<string[]>{
    return this.http.get<string[]>('http://localhost:9000/api/invoice-ids');
  }
  getList_InvoiceCoppy(): Observable<Invoice[]>{
    return this.http.get<Invoice[]>(`http://localhost:9000/api/invoices`);
  }

  addInvoice(invoice : Invoice): Observable<any>{
    return this.http.post<any>(`http://localhost:9000/api/service`, invoice).pipe(
      tap(() => {
        this.getList_Invoice(); // Cập nhật danh sách người dùng sau khi thêm
      })
    );
  }

  deleteInvoice(id: string): Observable<void> {
    return this.http.delete<void>(`http://localhost:9000/api/invoice/${id}`).pipe(
      tap(() => {
        this.getList_Invoice(); // Cập nhật danh sách người dùng sau khi xóa
      })
    );
  }

  findInvoice(id : string): Observable<Invoice>{
    return this.http.get<Invoice>(`http://localhost:9000/api/invoice/${id}`);
  }

  updateInvoice(id: string, invoiceData: any): Observable<Invoice> {
    return this.http.put<Invoice>(`http://localhost:9000/api/invoice/${id}`, invoiceData).pipe(
      tap(() => {
        this.getList_Invoice(); // Cập nhật danh sách người dùng sau khi cập nhật
      })
    );
  }

  getInvoiceWithPagination(page: number, pageSize: number): Observable<any> {
    const params = new HttpParams()
        .set('page', (page).toString())
        .set('pageSize', pageSize.toString());

    return this.http.get<any>('http://localhost:9000/api/invoice/phantrang',  
   { params }).pipe(
          tap(
            (response) => {
                if (response.content) {
                    this.invoiceSubject.next(response.content);
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

  getInvoicesBySearch(query: string): Observable<Invoice[]> {
    const url = `http://localhost:9000/api/invoices/search?query=${query}`;
    return this.http.get<Invoice[]>(url);
  }


}
