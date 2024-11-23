import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { Account } from '../../interface/account.interface';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class AccountService {
  private accountsSuubject : BehaviorSubject<Account[]> = new BehaviorSubject<Account[]>([]);
  account$: Observable<Account[]> = this.accountsSuubject.asObservable();


  constructor(private http: HttpClient) {
    this.getList_Account();
   }

  getList_Account() : void {
    this.http.get<Account[]>('http://localhost:9000/api/accounts').subscribe((data)=>{
      this.accountsSuubject.next(data);
    });
  }

  addAccount(account : Account) : Observable<any>{
    return this.http.post<any>('http://localhost:9000/api/account', account).pipe(
      tap(() =>{
        this.getList_Account();
      })
    );
  }

  deleteAccount(id : string) : Observable<void>{
    return this.http.delete<void>(`http://localhost:9000/api/account/${id}`).pipe(
      tap(() => {
        this.getList_Account();
      })
    );
  }

  findAccount(id : string) : Observable<Account>{
    return this.http.get<Account>(`http://localhost:9000/api/account/${id}`);
  }

  updateAccount(id : string, accountData: any) : Observable<Account>{
    return this.http.put<Account>(`http://localhost:9000/api/account/${id}`, accountData).pipe(
      tap(() =>{
        this.getList_Account();
      })
    )
  }

  addImageAccountToBackend(formData: FormData): Observable<any> {
    return this.http.post<any>('http://localhost:9000/api/account/image/upload', formData).pipe(
    );
  }
  deleteImage(imageName: string): void {
    this.http.delete(`http://localhost:9000/api/account/images/${imageName}`)
        .subscribe(response => {
            console.log('Hình ảnh đã được xóa:', response);
        }, error => {
            console.error('Có lỗi xảy ra khi xóa hình ảnh:', error);
        });
  }


}
