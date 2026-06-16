import { Injectable } from '@angular/core';
import {
  HttpErrorResponse,
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest
} from '@angular/common/http';

import { Router } from '@angular/router';
import { catchError, Observable, throwError } from 'rxjs';
import { AuthService } from '../services/auth.service';

@Injectable()
export class TokenInterceptor implements HttpInterceptor {

  constructor(private auth: AuthService, private router: Router) { }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

    const token = this.auth.getToken();
    let headers = req.headers
      .set('ngrok-skip-browser-warning', '69420');

    // 👉 CHỈ set Content-Type khi KHÔNG phải FormData
    if (!(req.body instanceof FormData)) {
      headers = headers.set('Content-Type', 'application/json');
    }

    // 👉 Gắn token nếu có
    if (token) {
      headers = headers.set('Authorization', `Bearer ${token}`);
    }

    const modifiedReq = req.clone({ headers });

    return next.handle(modifiedReq).pipe(
      catchError((error: HttpErrorResponse) => {

        if (error.status === 401) {
          this.auth.clearToken(); // ❌ chỉ xoá token
          this.router.navigate(['/login']); // ❌ điều hướng
        }

        return throwError(() => error);
      })
    );
  }
}