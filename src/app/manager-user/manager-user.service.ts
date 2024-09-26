import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ManagerUserService {

  constructor(private http: HttpClient) {

  }

  getList_User() : Observable<any>{
    return this.http.get<any>('http://localhost:8080/user');
  }
}
