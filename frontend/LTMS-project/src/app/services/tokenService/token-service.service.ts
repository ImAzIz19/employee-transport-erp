import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable, of, throwError } from 'rxjs';
import { tap, switchMap, map, catchError, filter, take, finalize } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import { JwtHelperService } from '@auth0/angular-jwt';

@Injectable({
  providedIn: 'root'
})
export class TokenService {
  private isRefreshing = false;
  private refreshTokenSubject = new BehaviorSubject<{accessToken: string, refreshToken: string} | null>(null);

  constructor(
    private http: HttpClient,
    private router: Router
  ) {}

  getAccessToken(): string | null {
    return localStorage.getItem('accessToken');
  }

  getRefreshToken(): string | null {
    return localStorage.getItem('refreshToken');
  }

  setTokens(accessToken: string, refreshToken: string): void {
    localStorage.setItem('accessToken', accessToken);
    localStorage.setItem('refreshToken', refreshToken);
  }

  removeTokens(): void {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
  }

  private clearTokensAndRedirect(): void {
    this.removeTokens();
    this.router.navigate(['/login']);
  }

  refreshToken(): Observable<{ accessToken: string, refreshToken: string }> {
    if (this.isRefreshing) {
      return this.refreshTokenSubject.pipe(
        filter(result => result !== null),
        take(1),
        switchMap(result => of(result as { accessToken: string, refreshToken: string }))
      );
    }

    this.isRefreshing = true;
    this.refreshTokenSubject.next(null);

    const currentRefreshToken = this.getRefreshToken();
    if (!currentRefreshToken) {
      this.isRefreshing = false;
      this.clearTokensAndRedirect();
      return throwError(() => new Error('No refresh token available'));
    }

    const jwtHelper = new JwtHelperService();
    if (jwtHelper.isTokenExpired(currentRefreshToken)) {
      this.isRefreshing = false;
      this.clearTokensAndRedirect();
      return throwError(() => new Error('Refresh token expired'));
    }

    return this.http.post<{ accesToken: string, refrechToken: string }>(
      `${environment.apiUrl}/auth/refresh-token`,
      {},
      { headers: new HttpHeaders({ 'Authorization': `Bearer ${currentRefreshToken}` })} 
    ).pipe(
      tap(response => {
        const newAccessToken = response.accesToken;
        const newRefreshToken = response.refrechToken;
        this.setTokens(newAccessToken, newRefreshToken);
        this.refreshTokenSubject.next({
          accessToken: newAccessToken,
          refreshToken: newRefreshToken
        });
      }),
      map(response => ({
        accessToken: response.accesToken,
        refreshToken: response.refrechToken
      })),
      catchError(error => {
        this.isRefreshing = false;
        this.clearTokensAndRedirect();
        return throwError(() => error);
      }),
      finalize(() => {
        this.isRefreshing = false;
      })
    );
  }
}