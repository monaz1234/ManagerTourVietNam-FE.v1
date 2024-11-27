import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject } from 'rxjs';
import { tap } from 'rxjs/operators';
import { Comment } from '../interface/comment.interface';

@Injectable({
    providedIn: 'root'
})
export class CommentService {
    private apiUrl = 'http://localhost:9000/api/comments'; // Đường dẫn API backend
    constructor(private http: HttpClient) {}
    // Lấy danh sách bình luận
    getComments(idtour: string): Observable<Comment[]> {
        return this.http.get<Comment[]>(`${this.apiUrl}/${idtour}`);
    }
    
    // Thêm bình luận mới
    addComment(comment: Partial<Comment>): Observable<Comment> {
        return this.http.post<Comment>(`${this.apiUrl}/${comment.idtour}`, comment);
    }
    
            
}