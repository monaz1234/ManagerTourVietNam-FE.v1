import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor() { }

  // Giả lập phương thức xác thực (có thể thay bằng API xác thực thực tế)
  isAuthenticated(): boolean {
    return localStorage.getItem('auth_token') !== null;
  }

  isAdmin(): boolean {
    // Kiểm tra xem người dùng có phải là admin không, ví dụ qua token
    return localStorage.getItem('role') === 'admin';
  }
}
