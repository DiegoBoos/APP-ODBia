import { inject } from '@angular/core';
import {
  HttpRequest,
  HttpErrorResponse,
  HttpInterceptorFn,
  HttpHandlerFn,
} from '@angular/common/http';
import { catchError, tap, throwError } from 'rxjs';
import { AuthService } from '../core/auth/services/auth.service';
import { ErrorMagement } from '@shared/helpers/error-management.helper';


export const authenticationInterceptor: HttpInterceptorFn = (
  req: HttpRequest<unknown>,
  next: HttpHandlerFn
) => {
  const authService = inject(AuthService);
  const token = localStorage.getItem('token-app-odb') || '';

  const modifiedReq = req.clone({
    headers: req.headers.set('Authorization', `Bearer ${token}`),
  });

  return next(modifiedReq).pipe(
    tap({
      error: (error: HttpErrorResponse) => {
        if (error.status === 401) {
          authService.logout();
        }
      }
    }),
    catchError(manageError)
  )
};

const manageError = (err: HttpErrorResponse) => {
  console.warn(err);
  ErrorMagement(err);
  
  return throwError(() => err);
}