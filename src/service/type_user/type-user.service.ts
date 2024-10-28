import { TypeUser } from './../../interface/typeuser.interface';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class TypeUserService {

private typeuserSubject : BehaviorSubject<TypeUser[]> = new BehaviorSubject<TypeUser[]>([]);
TypeUser$ : Observable<TypeUser[]> = this.typeuserSubject.asObservable();



  constructor(private http : HttpClient) {
    this.getListType_User();
   }


   getListType_User() : void{
    this.http.get<TypeUser[]>('http://localhost:9000/api/type_users').subscribe((data) =>{
      this.typeuserSubject.next(data);
    })
   }

   addTypeUser(typeUser : TypeUser ): Observable<any>{
    return this.http.post<any>('http://localhost:9000/api/type_user', typeUser).pipe(
      tap(() => {
        this.getListType_User();
      })
    );
   }

   deleteTypeUser(id : String ):Observable<void>{
    return this.http.delete<void>('http://localhost:9000/api/type_user/${id}').pipe(
      tap(() =>{
        this.getListType_User();
      })
    );
   }

   findTypeUser(id : String) : Observable<TypeUser>{
    return this.http.get<TypeUser>(`http://localhost:9000/api/type_user/${id}`);
   }

   updateTypeUser(id : String, typeUserData : any) : Observable<TypeUser>{
    return this.http.put<TypeUser>('http://localhost:9000/api/type_user/${id}', typeUserData).pipe(
      tap(() => {
        this.getListType_User();
      })
    );
   }
}
