import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(private router: Router) {}

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {

    // Kiểm tra nếu người dùng có quyền truy cập vào admin (ví dụ: kiểm tra nếu là admin)
    const isAdmin = false;  // Thay đổi điều kiện này dựa trên logic xác thực của bạn

    if (isAdmin) {
      return true;
    } else {
      this.router.navigate(['/login']);  // Nếu không phải admin, chuyển hướng về trang người dùng
      return false;
    }
  }
}
