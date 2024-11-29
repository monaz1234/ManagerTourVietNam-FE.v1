import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { InvoiceDetail } from '../../interface/invoiceDetail.interface';

@Injectable({
  providedIn: 'root'
})
export class InvoiceDetailService {
  public serviceSubject: BehaviorSubject<InvoiceDetail[]> = new BehaviorSubject<InvoiceDetail[]>([]);
  service$: Observable<InvoiceDetail[]> = this.serviceSubject.asObservable(); // Observable để các component có thể lắng nghe
  private totalPagesSubject: BehaviorSubject<number> = new BehaviorSubject<number>(0);
  totalPages$: Observable<number> = this.totalPagesSubject.asObservable();

  constructor() { }
}
