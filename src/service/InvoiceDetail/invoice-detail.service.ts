import { Injectable } from '@angular/core';

import { HttpClient, HttpParams } from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { InvoiceDetail } from '../../interface/invoiceDetail.interface';
import { response } from 'express';




@Injectable({
  providedIn: 'root'
})
export class InvoiceDetailService {
  public serviceSubject: BehaviorSubject<InvoiceDetail[]> = new BehaviorSubject<InvoiceDetail[]>([]);
  service$: Observable<InvoiceDetail[]> = this.serviceSubject.asObservable(); // Observable để các component có thể lắng nghe
  private totalPagesSubject: BehaviorSubject<number> = new BehaviorSubject<number>(0);
  totalPages$: Observable<number> = this.totalPagesSubject.asObservable();

  public invoiceDetailSubject: BehaviorSubject<InvoiceDetail[]> = new BehaviorSubject<InvoiceDetail[]>([]);
  invoiceDetails$: Observable<InvoiceDetail[]> = this.invoiceDetailSubject.asObservable();


  constructor(private http: HttpClient) {
    this.getLists_InvoiceDetail();
  }
  getLists_InvoiceDetail(): void {
    this.http.get<InvoiceDetail[]>('http://localhost:9000/api/invoiceDetails').subscribe((data) => {
      this.invoiceDetailSubject.next(data);
    });
  }
  getInvoiceDetailIds(): Observable<string[]>{
    return this.http.get<string[]>('http://localhost:9000/api/invoiceDetail');
  }
  getLists_InvoiceDetailCoppy(): Observable<InvoiceDetail[]>{
    return this.http.get<InvoiceDetail[]>(`http://localhost:9000/api/invoice-details`);
  }
  addInvoiceDetail(invoiceDetail : InvoiceDetail): Observable<any>{
    return this.http.post<any>(`http://localhost:9000/api/invoice-detail`, invoiceDetail).pipe(
      tap(() => {
        this.getLists_InvoiceDetail();
      })
    );
  }
  deleteInvoiceDetail(id: string): Observable<void> {
    return this.http.delete<void>(`http://localhost:9000/api/invoice-detail/${id}`).pipe(
      tap(() => {
        this.getLists_InvoiceDetail();
      })
    );
  }
  findInvoiceDetail(id : string): Observable<InvoiceDetail>{
    return this.http.get<InvoiceDetail>(`http://localhost:9000/api/invoice-detail/${id}`);
  }
  updateInvoiceDetail(id: string, invoiceDetailData: any): Observable<InvoiceDetail> {
    return this.http.put<InvoiceDetail>(`http://localhost:9000/api/invoice-detail/${id}`, invoiceDetailData).pipe(
      tap(() => {
        this.getLists_InvoiceDetail();
      })
    );
  }
  getInvoiceDetailWithPagination(page: number, limit: number): Observable<any> {
    let params = new HttpParams()
      .set('page', page)
      .set('limit', limit);
    return this.http.get<any>(`http://localhost:9000/api/invoiceDetail/phantrang`,
    { params }).pipe(
      tap(
        (response) => {
            if (response.content) {
                this.invoiceDetailSubject.next(response.content);
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
  getInvoicesDetailBySearch(query: string): Observable<InvoiceDetail[]> {
    const url = `http://localhost:9000/api/invoiceDetails/search?query=${query}`;
    return this.http.get<InvoiceDetail[]>(url);
  }

}
