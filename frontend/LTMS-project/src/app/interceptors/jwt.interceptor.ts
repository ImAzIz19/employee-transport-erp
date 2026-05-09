import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, filter, switchMap, take, throwError } from 'rxjs';
import { TokenService } from '../services/tokenService/token-service.service';
import { Router } from '@angular/router';
import { JwtHelperService } from '@auth0/angular-jwt';

export const jwtInterceptor: HttpInterceptorFn = (req, next) => {
  const tokenService = inject(TokenService);
  const router = inject(Router);
  const jwtHelper = new JwtHelperService();

  // Skip token for certain requests
  if (
    req.url.includes('/auth/refresh-token') ||
    req.url.includes('/auth/login') ||
    req.url.includes('/auth/register')
  ) {
    return next(req);
  }

  const token = tokenService.getAccessToken();
  if (token) {
    req = req.clone({
      setHeaders: { Authorization: `Bearer ${token}` },
    });
  }

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      if (error.status === 401 && !req.url.includes('/auth/refresh-token')) {
        if (tokenService['isRefreshing']) {
          return tokenService['refreshTokenSubject'].pipe(
            filter(result => result !== null),
            take(1),
            switchMap(({ accessToken }) => {
              const newRequest = req.clone({
                setHeaders: { Authorization: `Bearer ${accessToken}` },
              });
              return next(newRequest);
            })
          );
        }

        const refreshToken = tokenService.getRefreshToken();
        
        if (!refreshToken || jwtHelper.isTokenExpired(refreshToken)) {
          tokenService.removeTokens();
          router.navigate(['/login']);
          return throwError(() => error);
        }

        if (token && jwtHelper.isTokenExpired(token)) {
          return tokenService.refreshToken().pipe(
            switchMap(({ accessToken }) => {
              const newRequest = req.clone({
                setHeaders: { Authorization: `Bearer ${accessToken}` },
              });
              return next(newRequest);
            }),
            catchError((refreshError) => {
              tokenService.removeTokens();
              router.navigate(['/login']);
              return throwError(() => refreshError);
            })
          );
        }
      }
      return throwError(() => error);
    })
  );
};