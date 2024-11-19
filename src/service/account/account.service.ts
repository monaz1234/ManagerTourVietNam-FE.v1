import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { Account } from '../../interface/account.interface';
import { HttpClient, HttpParams } from '@angular/common/http';
interface PaginatedResponse<T> {
  content: T[];
  totalPages: number;
}
@Injectable({
  providedIn: 'root'
})
export class AccountService {
  private accountsSubject : BehaviorSubject<Account[]> = new BehaviorSubject<Account[]>([]);
  account$: Observable<Account[]> = this.accountsSubject.asObservable();
  private totalPagesSubject: BehaviorSubject<number> = new BehaviorSubject<number>(0);
  totalPages$: Observable<number> = this.totalPagesSubject.asObservable();



  constructor(private http: HttpClient) {
    this.getList_Account();
   }

  getList_Account() : void {
    this.http.get<Account[]>('http://localhost:9000/api/accounts').subscribe((data)=>{
      this.accountsSubject.next(data);
    });
  }

  getList_UserCopppy(): Observable<Account[]> {
    return this.http.get<Account[]>(`http://localhost:9000/api/accounts`);
  }

  getAccountIds(): Observable<string[]> {
    return this.http.get<string[]>('http://localhost:9000/api/account-ids');
  }

  addAccount(account : Account) : Observable<any>{
    return this.http.post<any>(`http://localhost:9000/api/account`, account).pipe(
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

  getAccountsWithPagination(page: number, pageSize: number): Observable<any> {
    const params = new HttpParams()
        .set('page', (page).toString())
        .set('pageSize', pageSize.toString());

    return this.http.get<any>('http://localhost:9000/api/account/phantrang',  
   { params }).pipe(
        tap(
            (response) => {
                console.log('Received data:', response); // Thêm log để kiểm tra dữ liệu
                if (response.content) {
                    this.accountsSubject.next(response.content);
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

  getAccountsBySearch(query: string): Observable<Account[]> {
    const urlAccount = `http://localhost:9000/api/accounts/search?query=${query}`;
    return this.http.get<Account[]>(urlAccount);
  }


  // login(account: Account): Observable<Account> {
  //   return this.http.post<Account>(`http://localhost:9000//api/account/login`, account);
  // }

  login(username: string, password: string): Observable<Account | null> {
    const loginPayload = { username, password };
    return this.http.post<Account | null>(`http://localhost:9000/api/account/login`, loginPayload);
  }


}
