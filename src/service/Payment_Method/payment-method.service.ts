import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { Payment_Medthod } from '../../interface/payment_method.interface';
import { HttpClient, HttpParams } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class PaymentMethodService {
  public PaymentMethodSubject: BehaviorSubject<Payment_Medthod[]> = new BehaviorSubject<Payment_Medthod[]>([]);
  paymentMethod$: Observable<Payment_Medthod[]> = this.PaymentMethodSubject.asObservable(); // Observable để các component có thể lắng nghe
  private totalPagesSubject: BehaviorSubject<number> = new BehaviorSubject<number>(0);
  totalPages$: Observable<number> = this.totalPagesSubject.asObservable();

  constructor(private http : HttpClient) { this.getList_PaymentMethod(); }

  getList_PaymentMethod(): void {
    this.http.get<Payment_Medthod[]>('http://localhost:9000/api/payment').subscribe((data) => {
      this.PaymentMethodSubject.next(data); // Cập nhật danh sách người dùng
    });
  }

  getPaymentMethodIds(): Observable<string[]>{
    return this.http.get<string[]>('http://localhost:9000/api/payment_method-ids');
  }

  getList_Payment_MedthodCoppy(): Observable<Payment_Medthod[]>{
    return this.http.get<Payment_Medthod[]>(`http://localhost:9000/api/payment`);
  }

  addPayment_Medthod(paymentMethod : Payment_Medthod): Observable<any>{
    return this.http.post<any>(`http://localhost:9000/api/payment/add_payment`, paymentMethod).pipe(
      tap(() => {
        this.getList_PaymentMethod(); // Cập nhật danh sách người dùng sau khi thêm
      })
    );
  }

  deletePayment_Medthod(id: string): Observable<void> {
    return this.http.delete<void>(`http://localhost:9000/api/payment/${id}`).pipe(
      tap(() => {
        this.getList_PaymentMethod(); // Cập nhật danh sách người dùng sau khi xóa
      })
    );
  }

  findPayment_Medthod(id : string): Observable<Payment_Medthod>{
    return this.http.get<Payment_Medthod>(`http://localhost:9000/api/payment/${id}`);
  }

  updatePayment_Medthod(id: string, paymentMethodData: any): Observable<Payment_Medthod> {
    return this.http.put<Payment_Medthod>(`http://localhost:9000/api/payment/${id}`, paymentMethodData).pipe(
      tap(() => {
        this.getList_PaymentMethod(); // Cập nhật danh sách người dùng sau khi cập nhật
      })
    );
  }


  getPayment_MedthodWithPagination(page: number, pageSize: number): Observable<any> {
    const params = new HttpParams()
        .set('page', (page).toString())
        .set('pageSize', pageSize.toString());

    return this.http.get<any>('http://localhost:9000/api/payment_method/phantrang',  
   { params }).pipe(
          tap(
            (response) => {
                if (response.content) {
                    this.PaymentMethodSubject.next(response.content);
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














}
