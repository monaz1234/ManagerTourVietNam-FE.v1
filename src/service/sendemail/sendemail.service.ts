import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SendemailService {

  private baseUrl = 'http://localhost:9000/api';

  constructor(private http: HttpClient) {}

  sendEmailConfirm(recipientEmail: string): Observable<any> {
    const url = `${this.baseUrl}/sendemails1`;
    return this.http.get(url, {
      params: {
        recipientEmail: recipientEmail,
      },
    });
  }
  sendEmailSucces(recipientEmail: string): Observable<any> {
    const url = `${this.baseUrl}/sendemails2`;
    return this.http.get(url, {
      params: {
        recipientEmail: recipientEmail,
      },
    });
  }
}
