import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject } from 'rxjs';
import { tap } from 'rxjs/operators';
import { Promotion } from '../../interface/promotion.interface';

@Injectable({
  providedIn: 'root'
})
export class ManagerPromotionService {
  public promotionsSubject: BehaviorSubject<Promotion[]> = new BehaviorSubject<Promotion[]>([]);
  promotions$: Observable<Promotion[]> = this.promotionsSubject.asObservable(); // Observable để các component có thể lắng nghe

  constructor(private http: HttpClient) {
    this.getPromotions(); // Tải danh sách khuyến mãi ngay khi khởi tạo service
  }

  getPromotions(): Observable<Promotion[]> {
    return this.http.get<Promotion[]>('http://localhost:9000/api/promotions').pipe(
      tap(promotions => this.promotionsSubject.next(promotions)) // Cập nhật danh sách khuyến mãi trong BehaviorSubject
    );
  }

  addPromotion(promotion: Promotion): Observable<any> {
    return this.http.post<any>('http://localhost:9000/api/promotions', promotion).pipe(
      tap(() => {
        this.getPromotions(); // Cập nhật danh sách khuyến mãi sau khi thêm
      })
    );
  }

  // Cập nhật để trả về mảng khuyến mãi
  searchPromotions(query: string): Observable<Promotion[]> {
    return this.http.get<Promotion[]>(`http://localhost:9000/api/promotions/search?query=${query}`);
}


  deletePromotion(promotion_code: string): Observable<void> {
    return this.http.delete<void>(`http://localhost:9000/api/promotions/${promotion_code}`).pipe(
      tap(() => {
        this.getPromotions().subscribe(); // Cập nhật danh sách khuyến mãi sau khi xóa
      })
    );
  }

  updatePromotions(promotion_code: string, promotion: Promotion): Observable<Promotion> {
    return this.http.put<Promotion>(`http://localhost:9000/api/promotions/${promotion_code}`, promotion).pipe(
      tap(() => {
        this.getPromotions().subscribe();; // Cập nhật danh sách người dùng sau khi cập nhật
      })
    );
  }
  updatePromotionsList(promotions: Promotion[]): void {
    this.promotionsSubject.next(promotions); // Cập nhật danh sách khuyến mãi trong BehaviorSubject
  }

  findPromotion(promotion_code: string): Observable<any> {
    return this.http.get<Promotion[]>(`http://localhost:9000/api/promotions/${promotion_code}`).pipe(
      tap(() => {
        this.getPromotions().subscribe(); // Cập nhật danh sách khuyến mãi sau khi tìm kiếm
      })
    );
  }
}
