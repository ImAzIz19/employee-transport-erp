// src/app/services/user-manager.service.ts

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import { User } from '../../interface/user/user';

@Injectable({
  providedIn: 'root'
})
export class UserManagerService {

  constructor(private http: HttpClient) { }

  // Get all RH Managers
  getRhManagers(): Observable<User[]> {
    return this.http.get<User[]>(`${environment.apiUrl}/api/users/rh-managers`).pipe(
      catchError(this.handleError)
    );
  }

  // Get all PS Managers
  getPsManagers(): Observable<User[]> {
    return this.http.get<User[]>(`${environment.apiUrl}/api/users/ps-managers`).pipe(
      catchError(this.handleError)
    );
  }

  // Get all RH Segment users
  getRhSegmentUsers(): Observable<User[]> {
    return this.http.get<User[]>(`${environment.apiUrl}/api/users/rh-segment`).pipe(
      catchError(this.handleError)
    );
  }

  // Get all Chef Segment users
  getChefSegmentUsers(): Observable<User[]> {
    return this.http.get<User[]>(`${environment.apiUrl}/api/users/chef-segment`).pipe(
      catchError(this.handleError)
    );
  }

  getAllUsers(): Observable<User[]> {
    return this.http.get<User[]>(`${environment.apiUrl}/api/users`);
  }


  private handleError(error: any) {
    console.error('An error occurred:', error);
    return throwError(() => new Error(
      error.error?.message || 
      error.message || 
      'Server error'
    ));
  }
}