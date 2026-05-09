import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable, of, throwError } from 'rxjs';
import { catchError, map, tap, switchMap } from 'rxjs/operators';
import { JwtHelperService } from '@auth0/angular-jwt';
import { environment } from '../environments/environment';
import { User } from '../interface/user/user';
import { RegisterRequest } from '../interface/registerRequest/registerRequest';
import { TokenService } from './tokenService/token-service.service';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private jwtHelper = new JwtHelperService();
  private isAuthenticatedSubject = new BehaviorSubject<boolean>(false);
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  private authCheckComplete = new BehaviorSubject<boolean>(false);

  constructor(
    private http: HttpClient,
    private router: Router,
    private tokenService: TokenService
  ) {
    this.initializeAuthState();
  }

  private initializeAuthState(): void {
    this.checkAuthStatus().subscribe({
      next: (isAuthenticated) => {
        this.isAuthenticatedSubject.next(isAuthenticated);
        this.authCheckComplete.next(true);
      },
      error: () => {
        this.clearAuthState();
        this.authCheckComplete.next(true);
      }
    });
  }

  get authCheckComplete$(): Observable<boolean> {
    return this.authCheckComplete.asObservable();
  }

  get isAuthenticated$(): Observable<boolean> {
    return this.isAuthenticatedSubject.asObservable();
  }

  get currentUser$(): Observable<User | null> {
    return this.currentUserSubject.asObservable();
  }

  register(userData: RegisterRequest): Observable<any> {
    return this.http.post(`${environment.apiUrl}/auth/register`, userData).pipe(
      tap((response: any) => {
        if (response.accessToken && response.refreshToken) {
          this.tokenService.setTokens(response.accessToken, response.refreshToken);
          this.isAuthenticatedSubject.next(true);
        }
      })
    );
  }

  handleSendEmail(email: string): Observable<any> {
    return this.http.post(`${environment.apiUrl}/auth/verify-email`, { email }, { responseType: 'text' as 'json' });
  }

  handleVerifyMfa(email: string, code: string): Observable<any> {
    return this.http.post(`${environment.apiUrl}/auth/verify-mfa`, { email, code }, { responseType: 'text' as 'json' });
  }

  handleCreateNewPassword(email: string, newPassword: string): Observable<any> {
    return this.http.post(`${environment.apiUrl}/auth/change-password`, { email, newPassword }, { responseType: 'text' as 'json' });
  }

  login(credentials: { email: string; password: string }): Observable<any> {
    return this.http.post(`${environment.apiUrl}/auth/login`, credentials).pipe(
      tap((response: any) => {
        if (response.userEntityDTO.isVerified) {
          this.tokenService.setTokens(response.accesToken, response.refrechToken);
          const user: User = {
            ...response.userEntityDTO,
            roles: response.userEntityDTO.roles.map((role: any) => ({
              ...role,
              permissions: Array.isArray(role.permissions) ? role.permissions : [...role.permissions],
            })),
          };
          this.currentUserSubject.next(user);
          this.isAuthenticatedSubject.next(true);
        }
      })
    );
  }

  logout(): void {
    this.tokenService.removeTokens();
    this.isAuthenticatedSubject.next(false);
    this.currentUserSubject.next(null);
    this.router.navigate(['/login']);
  }

  checkAuthStatus(): Observable<boolean> {
    return new Observable<boolean>(subscriber => {
      const token = this.tokenService.getAccessToken();
      const refreshToken = this.tokenService.getRefreshToken();
      
      if (!token || !refreshToken) {
        this.clearAuthState();
        subscriber.next(false);
        subscriber.complete();
        return;
      }

      if (this.jwtHelper.isTokenExpired(token)) {
        if (this.jwtHelper.isTokenExpired(refreshToken)) {
          this.clearAuthState();
          subscriber.next(false);
          subscriber.complete();
        } else {
          this.refreshToken().pipe(
            map(() => true),
            catchError(() => {
              this.clearAuthState();
              return of(false);
            })
          ).subscribe({
            next: (result) => subscriber.next(result),
            error: () => subscriber.next(false),
            complete: () => subscriber.complete()
          });
        }
      } else {
        this.setUserFromToken(token);
        subscriber.next(true);
        subscriber.complete();
      }
    });
  }

  public clearAuthState(): void {
    this.tokenService.removeTokens();
    this.isAuthenticatedSubject.next(false);
    this.currentUserSubject.next(null);
    this.router.navigate(['/login']);
  }

  private setUserFromToken(token: string): void {
    try {
      const decodedToken = this.jwtHelper.decodeToken(token);
      if (decodedToken && decodedToken.id && decodedToken.email) {
        const user: User = {
          id: decodedToken.id,
          firstName: decodedToken.firstName,
          lastName: decodedToken.lastName,
          email: decodedToken.email,
          loginName: decodedToken.sub,
          isVerified: decodedToken.isVerified,
          roles: (decodedToken.roles || []).map((role: string) => ({
            name: role,
            id: 0,
            permissions: Array.isArray(decodedToken.authorities)
              ? decodedToken.authorities
              : [...(decodedToken.authorities || [])],
          })),
        };
        this.currentUserSubject.next(user);
        this.isAuthenticatedSubject.next(true);
      } else {
        this.clearAuthState();
      }
    } catch (e) {
      console.error('Invalid JWT token:', e);
      this.clearAuthState();
    }
  }

  hasRole(role: string): boolean {
    const user = this.currentUserSubject.value;
    return user?.roles.some(r => r.name === role) || false;
  }

  hasPermission(permission: string): boolean {
    const user = this.currentUserSubject.value;
    if (!user) return false;

    return user.roles.some((role) => {
      if (Array.isArray(role.permissions)) {
        return role.permissions.includes(permission);
      } else if (role.permissions instanceof Set) {
        return role.permissions.has(permission);
      }
      return false;
    });
  }
  
  refreshToken(): Observable<{ accessToken: string, refreshToken: string }> {
    return this.tokenService.refreshToken().pipe(
      tap(({ accessToken, refreshToken }) => {
        this.tokenService.setTokens(accessToken, refreshToken);
        const decodedToken = this.jwtHelper.decodeToken(accessToken);
        if (decodedToken && decodedToken.id && decodedToken.email) {
          const user: User = {
            id: decodedToken.id,
            firstName: decodedToken.firstName,
            lastName: decodedToken.lastName,
            email: decodedToken.email,
            loginName: decodedToken.sub,
            isVerified: decodedToken.isVerified,
            roles: (decodedToken.roles || []).map((role: string) => ({
              name: role,
              id: 0,
              permissions: Array.isArray(decodedToken.authorities)
                ? decodedToken.authorities
                : [...(decodedToken.authorities || [])],
            })),
          };
          this.currentUserSubject.next(user);
          this.isAuthenticatedSubject.next(true);
        }
      }),
      catchError((error) => {
        console.error('Error refreshing token:', error);
        this.logout();
        return throwError(() => error);
      })
    );
  }

  public get currentUserValue(): User | null {
    return this.currentUserSubject.value;
  }
}