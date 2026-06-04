import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment.prod';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AIChatService {

  constructor(private http: HttpClient) {}

  chat(threadId: string | null, message: string): Observable<any> {
    return this.http.post(`${environment.apiUrl}/api/chat`, {
      threadId,
      message
    });
  }
}